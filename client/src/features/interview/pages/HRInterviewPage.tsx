import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { sessionId: routeSessionId } = useParams<{ sessionId?: string }>();
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

  const hasSpokenOpeningRef = useRef<boolean>(false);

  // Initialize or resume HR session
  useEffect(() => {
    let isSubscribed = true;

    const initHRInterview = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data;
        if (routeSessionId) {
          data = await interviewApi.getSession(routeSessionId);
          if (data.report && isSubscribed) {
            setEvaluationReport(data.report);
          }
        } else {
          data = await interviewApi.startOrResume('HR');
        }

        if (!isSubscribed) return;

        setSession(data.session);
        setTranscript(data.transcript || []);
        setCurrentQuestion(data.currentQuestion);
        setCurrentQuestionIndex(
          data.currentQuestion?.index ?? data.session.currentQuestionIndex ?? 0
        );
        if ((data as any).starProgress) {
          setStarProgress((data as any).starProgress);
        }
        setIsQuestionComplete(!!(data as any).isQuestionComplete);

        if (data.questionsOverview && data.questionsOverview.length > 0) {
          setQuestionsOverview(data.questionsOverview);
        }

        // Voice greeting from interviewer
        if (data.openingTurn && !hasSpokenOpeningRef.current) {
          hasSpokenOpeningRef.current = true;
          const candidateFirst = user?.firstName ? `, ${user.firstName}` : '';
          const personalizedOpening = data.openingTurn.content.replace(
            /Hello/i,
            `Hello${candidateFirst}`
          );

          setTimeout(() => {
            speak(personalizedOpening);
          }, 600);
        }
      } catch (err: any) {
        console.error('Failed to initialize HR interview session:', err);
        if (isSubscribed) {
          setError(
            err.response?.data?.message || 'Failed to start HR behavioral session.'
          );
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    initHRInterview();

    return () => {
      isSubscribed = false;
      cancelSpeech();
    };
  }, [routeSessionId, speak, cancelSpeech, user?.firstName]);

  // Handle sending candidate response
  const handleSendTurn = async (utterance: string) => {
    if (!session || !utterance.trim() || isSendingTurn) return;

    try {
      setIsSendingTurn(true);
      setError(null);
      cancelSpeech();

      // Optimistic user turn
      const candidateTurn: InterviewTurn = {
        role: 'candidate',
        content: utterance,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, candidateTurn]);

      const response = await interviewApi.sendTurn(session.id, utterance);

      // Append AI response turn
      const aiTurn: InterviewTurn = {
        role: 'ai',
        content: response.replyText,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, aiTurn]);

      // Update real-time STAR progress
      if (response.starProgress) {
        setStarProgress(response.starProgress);
      }
      if (response.isQuestionComplete !== undefined) {
        setIsQuestionComplete(response.isQuestionComplete);
      }

      speak(response.replyText);
    } catch (err: any) {
      console.error('Failed to process candidate turn:', err);
      setError(err.response?.data?.message || 'Failed to deliver response.');
    } finally {
      setIsSendingTurn(false);
    }
  };

  // Advance to next question
  const handleAdvanceQuestion = async () => {
    if (!session || isAdvancing) return;

    try {
      setIsAdvancing(true);
      setError(null);
      cancelSpeech();

      const res = await interviewApi.advanceQuestion(session.id);

      if ((res.isFinished || (res as any).sessionComplete) && res.report) {
        setEvaluationReport(res.report);
        return;
      }

      if (res.currentQuestion) {
        setCurrentQuestion(res.currentQuestion);
        setCurrentQuestionIndex(res.currentQuestion.index ?? currentQuestionIndex + 1);
        setStarProgress({
          situation: false,
          task: false,
          action: false,
          result: false,
        });
        setIsQuestionComplete(false);

        if (res.aiTransitionTurn) {
          setTranscript((prev) => [...prev, res.aiTransitionTurn!]);
          speak(res.aiTransitionTurn.content);
        }
      }
    } catch (err: any) {
      console.error('Failed to advance question:', err);
      setError(err.response?.data?.message || 'Failed to move to next question.');
    } finally {
      setIsAdvancing(false);
    }
  };

  // Finish interview and generate report
  const handleFinishInterview = useCallback(async () => {
    if (!session || isFinishing) return;

    const confirmed = window.confirm(
      'Are you ready to conclude your HR behavioral interview and generate your STAR evaluation report?'
    );
    if (!confirmed) return;

    try {
      setIsFinishing(true);
      cancelSpeech();
      const res = await interviewApi.finishInterview(session.id);
      setEvaluationReport(res.report);
      setSession(res.session);
    } catch (err: any) {
      console.error('Failed to finalize interview:', err);
      setError(err.response?.data?.message || 'Failed to generate behavioral evaluation report.');
    } finally {
      setIsFinishing(false);
    }
  }, [session, isFinishing, cancelSpeech]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-56px)] flex flex-col items-center justify-center space-y-4 bg-[#FFFAF7]">
        <Loader2 className="w-8 h-8 text-[#FF7A48] animate-spin" />
        <p className="text-[#6B544A] text-xs font-medium">Entering HR Behavioral Interview Suite...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="h-[calc(100vh-56px)] flex items-center justify-center bg-[#FFFAF7] p-4">
        <div className="max-w-md w-full p-6 bg-white border border-[#F2DDD2] rounded-3xl space-y-4 text-center shadow-sm">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-[#0A0706]">Session Error</h2>
          <p className="text-xs text-[#6B544A]">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary px-5 py-2 text-xs font-semibold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isLastQuestion =
    currentQuestionIndex >= (questionsOverview.length > 0 ? questionsOverview.length - 1 : 2);

  const candidateTurnsCount = transcript.filter((t) => t.role === 'candidate').length;
  const isQuestionUnlocked =
    isQuestionComplete ||
    (starProgress.action && starProgress.result) ||
    candidateTurnsCount >= 3;

  const candidateDisplayName = user?.firstName
    ? `${user.firstName} (You)`
    : 'Candidate (You)';

  return (
    <div className="h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] flex flex-col overflow-hidden px-2.5 sm:px-4 py-2 bg-[#FFFAF7] select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-white border border-[#F2DDD2] rounded-2xl shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <BackButton label="Exit" fallbackRoute="/dashboard" />
          <div className="p-1.5 rounded-xl bg-[#FFEBE1] border border-[#FFD7C5] text-[#FF7A48]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-[#0A0706] leading-tight flex items-center gap-2">
              <span>AI HR Behavioral Round</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FBD7C7] text-[10px] font-semibold">
                STAR Methodology
              </span>
            </h1>
            <p className="text-[11px] text-[#6B544A]">
              Interviewer: <strong className="text-[#0A0706]">{BEHAVIORAL_PERSONA.name}</strong> ({BEHAVIORAL_PERSONA.role})
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
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-[#F2DDD2] text-[#6B544A] hover:bg-[#FFF5F0]'
            }`}
            title={isMuted ? 'Unmute Voice' : 'Mute Voice'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-xs">{isMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          <button
            type="button"
            onClick={handleFinishInterview}
            disabled={isFinishing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
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
          <div className="flex-1 min-h-[200px] rounded-2xl overflow-hidden relative shadow-xs">
            <AIAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              interviewerName={BEHAVIORAL_PERSONA.name}
              personaKey={BEHAVIORAL_PERSONA.key}
              subtitle="Senior Talent Partner (STAR Probing)"
            />
          </div>

          {/* Student Live Webcam Feed Tile */}
          <div className="h-[160px] sm:h-[185px] shrink-0 rounded-2xl overflow-hidden relative shadow-xs">
            <StudentWebcam
              candidateName={candidateDisplayName}
              isListening={isListening}
            />
          </div>
        </div>

        {/* Right Column: Question Card + STAR Tracker + Transcript */}
        <div className="lg:col-span-7 flex flex-col gap-2 min-h-0 h-full overflow-hidden">
          {/* Active Question & STAR Tracker Card */}
          <div className="p-3.5 bg-white border border-[#F2DDD2] rounded-2xl space-y-2 shrink-0 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FBD7C7] text-[10px] font-bold uppercase tracking-wider">
                  {currentQuestion?.competency || 'Behavioral Competency'}
                </span>
                <span className="text-xs font-bold text-[#6B544A]">
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
                    ? 'btn-primary text-white cursor-pointer'
                    : 'bg-[#FFFAF7] border border-[#F2DDD2] text-[#8C7268] cursor-not-allowed opacity-60'
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
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
            <h2 className="text-xs sm:text-sm font-semibold text-[#0A0706] leading-snug">
              {currentQuestion?.text || 'Describe a challenging engineering situation you navigated.'}
            </h2>

            {/* STAR Story Tracker */}
            <StarTracker progress={starProgress} />

            {/* Helper Pro-Tip Accordion */}
            <div className="pt-1 border-t border-[#F2DDD2] flex items-center justify-between text-[11px] text-[#6B544A]">
              <span className="text-[11px]">
                {!isQuestionUnlocked ? (
                  <span className="text-[#FF7A48]">
                    💡 Pro-Tip: Ensure you mention the specific <strong>Action</strong> you took and the measurable <strong>Result</strong>.
                  </span>
                ) : (
                  <span className="text-[#1F7A3A] font-semibold">
                    ✅ STAR Story Complete! You can answer further or click "Next Question".
                  </span>
                )}
              </span>

              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="hover:text-[#0A0706] flex items-center gap-1 text-[11px] shrink-0"
              >
                <HelpCircle className="w-3 h-3 text-[#FF7A48]" />
                <span>Format Tips</span>
                {showTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {showTips && (
              <div className="p-2.5 rounded-xl bg-[#FFF5F0] border border-[#F2DDD2] text-[11px] text-[#6B544A] space-y-1">
                <p>
                  <strong>S (Situation):</strong> Set context, company/academic backdrop, and the problem.
                </p>
                <p>
                  <strong>T (Task):</strong> Explain your specific role, responsibility, and goal.
                </p>
                <p>
                  <strong>A (Action):</strong> Describe initiatives, tools, and technical actions you took.
                </p>
                <p>
                  <strong>R (Result):</strong> Quantify the outcome (e.g., % improvement, saved hours, delivery).
                </p>
              </div>
            )}
          </div>

          {/* Dialogue Transcript & Voice Controls */}
          <div className="flex-1 min-h-0 bg-white border border-[#F2DDD2] rounded-2xl p-2.5 overflow-hidden flex flex-col gap-2 shadow-xs">
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
