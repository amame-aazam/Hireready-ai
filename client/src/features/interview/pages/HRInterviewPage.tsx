import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  interviewApi,
  InterviewSessionData,
  InterviewTurn,
  QuestionOverviewItem,
  EvaluationReportData,
  StarProgress,
} from '../api/interviewApi';
import { AIAvatar } from '../components/AIAvatar';
import { StudentWebcam } from '../components/StudentWebcam';
import { TranscriptFeed } from '../components/TranscriptFeed';
import { VoiceControls } from '../components/VoiceControls';
import { QuestionStepper } from '../components/QuestionStepper';
import { StarTracker } from '../components/StarTracker';
import { HRReportModal } from '../components/HRReportModal';
import { BEHAVIORAL_PERSONA } from '../types/persona';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useAuth } from '../../auth/hooks/useAuth';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Loader2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lock,
} from 'lucide-react';
import { BackButton } from '../../../components/common/BackButton';

export const HRInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState<InterviewSessionData | null>(null);
  const [transcript, setTranscript] = useState<InterviewTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [questionsOverview, setQuestionsOverview] = useState<QuestionOverviewItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [starProgress, setStarProgress] = useState<StarProgress>({
    situation: false,
    task: false,
    action: false,
    result: false,
  });
  const [isQuestionComplete, setIsQuestionComplete] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSendingTurn, setIsSendingTurn] = useState<boolean>(false);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Web Speech synthesis and recognition
  const {
    isListening,
    transcript: sttTranscript,
    interimTranscript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: isSttSupported,
  } = useSpeechRecognition();

  const {
    speak,
    cancel: cancelSpeech,
    isSpeaking,
    isMuted,
    toggleMute,
  } = useSpeechSynthesis();

  const hasSpokenOpeningRef = useRef(false);

  // Initialize or resume HR session
  const initHRSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await interviewApi.startOrResume('HR');

      setSession(data.session);
      setTranscript(data.transcript);
      setCurrentQuestion(data.currentQuestion);
      setQuestionsOverview(data.questionsOverview || []);
      setCurrentQuestionIndex(data.currentQuestion?.index ?? 0);

      if (data.starProgress) {
        setStarProgress(data.starProgress);
      }

      // Spoken greeting from Kavya
      if (data.transcript.length > 0 && !hasSpokenOpeningRef.current) {
        const lastTurn = data.transcript[data.transcript.length - 1];
        if (lastTurn.role === 'ai') {
          hasSpokenOpeningRef.current = true;
          setTimeout(() => speak(lastTurn.content), 600);
        }
      }
    } catch (err: any) {
      console.error('Failed to start HR interview:', err);
      setError(err.response?.data?.message || 'Failed to start HR interview session.');
    } finally {
      setIsLoading(false);
    }
  }, [speak]);

  useEffect(() => {
    initHRSession();
  }, [initHRSession]);

  // Send candidate speech or text response
  const handleSendTurn = async (candidateText: string) => {
    if (!session || !candidateText.trim() || isSendingTurn) return;

    try {
      setIsSendingTurn(true);
      setError(null);
      cancelSpeech();

      // Optimistic append candidate turn
      const candidateTurn: InterviewTurn = {
        role: 'candidate',
        content: candidateText.trim(),
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, candidateTurn]);
      resetTranscript();

      // Call HR session turn API
      const response = await interviewApi.sendTurn(session.id, candidateText.trim());

      // Append AI response
      const aiTurn: InterviewTurn = {
        role: 'ai',
        content: response.replyText || response.aiReply || '',
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, aiTurn]);

      // Speak response
      speak(aiTurn.content);

      // Update real-time STAR progress
      if (response.starProgress) {
        setStarProgress(response.starProgress);
      }
      if (response.isQuestionComplete !== undefined) {
        setIsQuestionComplete(response.isQuestionComplete);
      }

      // Check if session concluded
      if ((response.isFinished || response.sessionComplete) && response.report) {
        setEvaluationReport(response.report);
      }
    } catch (err: any) {
      console.error('Failed to process HR turn:', err);
      setError(err.response?.data?.message || 'Failed to receive interviewer response.');
    } finally {
      setIsSendingTurn(false);
    }
  };

  // Advance to next behavioral competency question
  const handleAdvanceQuestion = async () => {
    if (!session || isAdvancing) return;

    try {
      setIsAdvancing(true);
      setError(null);
      cancelSpeech();

      const nextData = await interviewApi.advanceQuestion(session.id);

      if ((nextData.isFinished || nextData.sessionComplete) && nextData.report) {
        setEvaluationReport(nextData.report);
        return;
      }

      setCurrentQuestion(nextData.currentQuestion);
      setCurrentQuestionIndex(nextData.currentQuestion?.index ?? currentQuestionIndex + 1);
      setStarProgress({ situation: false, task: false, action: false, result: false });
      setIsQuestionComplete(false);

      if (nextData.aiTransitionTurn) {
        setTranscript((prev) => [...prev, nextData.aiTransitionTurn!]);
        speak(nextData.aiTransitionTurn.content);
      }
    } catch (err: any) {
      console.error('Failed to advance HR question:', err);
      setError(err.response?.data?.message || 'Failed to advance to next question.');
    } finally {
      setIsAdvancing(false);
    }
  };

  // Finish HR round early
  const handleFinishInterview = async () => {
    if (!session || isFinishing) return;
    const confirm = window.confirm(
      'Are you sure you want to conclude the behavioral interview? Your STAR evaluation report will be generated.'
    );
    if (!confirm) return;

    try {
      setIsFinishing(true);
      setError(null);
      cancelSpeech();

      const finishData = await interviewApi.finishInterview(session.id);
      setEvaluationReport(finishData.report);
    } catch (err: any) {
      console.error('Failed to conclude HR interview:', err);
      setError(err.response?.data?.message || 'Failed to finish interview.');
    } finally {
      setIsFinishing(false);
    }
  };

  const isQuestionUnlocked =
    isQuestionComplete ||
    [starProgress.situation, starProgress.task, starProgress.action, starProgress.result].filter(
      Boolean
    ).length >= 2;

  const isLastQuestion =
    currentQuestionIndex >= (questionsOverview.length > 0 ? questionsOverview.length - 1 : 2);

  const candidateDisplayName = user ? `${user.firstName} ${user.lastName}` : 'Candidate';

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4 text-[#F5E8DD]">
        <Loader2 className="w-9 h-9 text-[#F0B87A] animate-spin" />
        <h2 className="text-base font-serif font-medium text-[#F5E8DD]">
          Connecting to {BEHAVIORAL_PERSONA.name}...
        </h2>
        <p className="text-xs text-[#A88879]">
          Configuring STAR methodology rubric, speech synthesis, and video stream.
        </p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-3xl space-y-4 text-center shadow-sm text-[#F5E8DD]">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
        <h2 className="text-base font-serif font-medium text-[#F5E8DD]">Interview Session Error</h2>
        <p className="text-xs text-[#A88879]">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] text-[#140808] font-bold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col space-y-2.5 px-3 sm:px-6 py-2.5 text-[#F5E8DD]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-3 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl shrink-0 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <BackButton label="Exit" fallbackRoute="/dashboard" />
          <div className="p-2 rounded-xl bg-[#2D1A10] border border-[#522E22] text-[#F0B87A]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-serif font-medium text-[#F5E8DD] leading-tight flex items-center gap-2">
              <span>AI HR Behavioral Round</span>
              <span className="px-2 py-0.5 rounded-full bg-[#2D1A10] text-[#F0B87A] border border-[#522E22] text-[10px] font-semibold">
                STAR Methodology
              </span>
            </h1>
            <p className="text-[11px] text-[#A88879]">
              Interviewer: <strong className="text-[#F5E8DD]">{BEHAVIORAL_PERSONA.name}</strong> ({BEHAVIORAL_PERSONA.role})
            </p>
          </div>
        </div>

        {/* Center: Question Stepper */}
        <div className="hidden md:flex items-center">
          <QuestionStepper currentIndex={currentQuestionIndex} questions={questionsOverview} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              isMuted
                ? 'bg-[#2E100D] border-red-800 text-red-300'
                : 'bg-[#140705] border-[#3E1D19] text-[#A88879] hover:text-[#F5E8DD]'
            }`}
            title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-xs">{isMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          <button
            type="button"
            onClick={handleFinishInterview}
            disabled={isFinishing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2E100D] border border-red-800 text-red-300 hover:bg-[#3D1410] text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {isFinishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>End Interview</span>
          </button>
        </div>
      </div>

      {/* Main Video & Dialogue Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 flex-1 min-h-0 overflow-hidden mt-2">
        {/* Left Column: Video Feeds (AI Avatar + Student Webcam) */}
        <div className="lg:col-span-5 flex flex-col gap-2 min-h-0 h-full overflow-hidden">
          {/* AI Avatar Tile */}
          <div className="flex-1 min-h-[200px] rounded-2xl overflow-hidden relative shadow-sm">
            <AIAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              interviewerName={BEHAVIORAL_PERSONA.name}
              personaKey={BEHAVIORAL_PERSONA.key}
              subtitle="Senior Talent Partner (STAR Probing)"
            />
          </div>

          {/* Student Live Webcam Feed Tile */}
          <div className="h-[160px] sm:h-[185px] shrink-0 rounded-2xl overflow-hidden relative shadow-sm">
            <StudentWebcam
              candidateName={candidateDisplayName}
              isListening={isListening}
            />
          </div>
        </div>

        {/* Right Column: Question Card + STAR Tracker + Transcript */}
        <div className="lg:col-span-7 flex flex-col gap-2 min-h-0 h-full overflow-hidden">
          {/* Active Question & STAR Tracker Card */}
          <div className="p-3.5 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl space-y-2 shrink-0 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#2D1A10] text-[#F0B87A] border border-[#522E22] text-[10px] font-bold uppercase tracking-wider">
                  {currentQuestion?.competency || 'Behavioral Competency'}
                </span>
                <span className="text-xs font-bold text-[#A88879]">
                  Question {currentQuestionIndex + 1} of 3
                </span>
              </div>

              {/* Advance / Next Question Button */}
              <button
                type="button"
                onClick={handleAdvanceQuestion}
                disabled={isAdvancing || !isQuestionUnlocked}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs transition ${
                  isQuestionUnlocked
                    ? 'bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold shadow-[0_0_15px_rgba(240,184,122,0.3)] cursor-pointer'
                    : 'bg-[#140705] border border-[#3E1D19] text-[#856658] cursor-not-allowed opacity-60'
                }`}
                title={
                  isQuestionUnlocked
                    ? isLastQuestion
                      ? 'Conclude interview & generate STAR evaluation'
                      : 'Advance to next behavioral question'
                    : 'Provide Situation, Task, Action & Result to unlock next question'
                }
              >
                {isAdvancing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#140808]" />
                ) : !isQuestionUnlocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {isLastQuestion
                    ? 'Conclude Interview'
                    : isQuestionUnlocked
                    ? 'Next Question'
                    : 'Complete Story to Unlock'}
                </span>
              </button>
            </div>

            {/* Question Text */}
            <h2 className="text-xs sm:text-sm font-serif font-medium text-[#F5E8DD] leading-snug">
              {currentQuestion?.text || 'Describe a challenging engineering situation you navigated.'}
            </h2>

            {/* STAR Story Tracker */}
            <StarTracker progress={starProgress} />

            {/* Helper Pro-Tip Accordion */}
            <div className="pt-1 border-t border-[#3E1D19] flex items-center justify-between text-[11px] text-[#A88879]">
              <span className="text-[11px]">
                {!isQuestionUnlocked ? (
                  <span className="text-[#F0B87A]">
                    💡 Pro-Tip: Ensure you mention the specific <strong>Action</strong> you took and the measurable <strong>Result</strong>.
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    ✅ STAR Story Complete! You can answer further or click "Next Question".
                  </span>
                )}
              </span>

              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="hover:text-[#F5E8DD] flex items-center gap-1 text-[11px] shrink-0 transition"
              >
                <HelpCircle className="w-3 h-3 text-[#F0B87A]" />
                <span>Format Tips</span>
                {showTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {showTips && (
              <div className="p-2.5 rounded-xl bg-[#140705] border border-[#3E1D19] text-[11px] text-[#A88879] space-y-1">
                <p>
                  <strong className="text-[#F5E8DD]">S (Situation):</strong> Set context, company/academic backdrop, and the problem.
                </p>
                <p>
                  <strong className="text-[#F5E8DD]">T (Task):</strong> Explain your specific role, responsibility, and goal.
                </p>
                <p>
                  <strong className="text-[#F5E8DD]">A (Action):</strong> Describe initiatives, tools, and technical actions you took.
                </p>
                <p>
                  <strong className="text-[#F5E8DD]">R (Result):</strong> Quantify the outcome (e.g., % improvement, saved hours, delivery).
                </p>
              </div>
            )}
          </div>

          {/* Dialogue Transcript & Voice Controls */}
          <div className="flex-1 min-h-0 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl p-2.5 overflow-hidden flex flex-col gap-2 shadow-sm backdrop-blur-md">
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <TranscriptFeed
                turns={transcript}
                onReplaySpeech={speak}
                isAiSpeaking={isSpeaking}
                aiName={BEHAVIORAL_PERSONA.name}
              />
            </div>

            <VoiceControls
              isListening={isListening}
              transcript={sttTranscript}
              interimTranscript={interimTranscript}
              onStartListening={startListening}
              onStopListening={stopListening}
              onSendTurn={handleSendTurn}
              onClearTranscript={resetTranscript}
              isSendingTurn={isSendingTurn}
              isSupported={isSttSupported}
            />
          </div>
        </div>
      </div>

      {/* Final HR Behavioral Evaluation Report Modal */}
      {evaluationReport && (
        <HRReportModal
          report={evaluationReport}
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
};
export default HRInterviewPage;