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
import { TranscriptFeed } from '../components/TranscriptFeed';
import { VoiceControls } from '../components/VoiceControls';
import { QuestionStepper } from '../components/QuestionStepper';
import { StarTracker } from '../components/StarTracker';
import { HRReportModal } from '../components/HRReportModal';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
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
  MessageCircle,
} from 'lucide-react';

export const HRInterviewPage: React.FC = () => {
  const { sessionId: routeSessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();

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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSendingTurn, setIsSendingTurn] = useState<boolean>(false);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(false);
  const [evaluationReport, setEvaluationReport] = useState<EvaluationReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Web Speech hooks
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
  useEffect(() => {
    const initInterview = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data;
        if (routeSessionId) {
          data = await interviewApi.getSession(routeSessionId);
          if (data.report) {
            setEvaluationReport(data.report);
          }
        } else {
          data = await interviewApi.startOrResume('HR');
        }

        setSession(data.session);
        setTranscript(data.transcript || []);
        setCurrentQuestion(data.currentQuestion);
        setCurrentQuestionIndex(data.currentQuestion?.index ?? data.session.currentQuestionIndex ?? 0);

        if (data.questionsOverview && data.questionsOverview.length > 0) {
          setQuestionsOverview(data.questionsOverview);
        }

        // If newly started and has opening turn, speak it aloud
        if (data.openingTurn && !hasSpokenOpeningRef.current) {
          hasSpokenOpeningRef.current = true;
          speak(data.openingTurn.content);
        }
      } catch (err: any) {
        console.error('Failed to initialize HR interview session:', err);
        setError(err.response?.data?.message || 'Failed to start HR Behavioral Interview.');
      } finally {
        setIsLoading(false);
      }
    };

    initInterview();
  }, [routeSessionId, speak]);

  // Send candidate voice/text utterance to Sophia
  const handleSendTurn = async (utterance: string) => {
    if (!session || isSendingTurn || !utterance.trim()) return;

    try {
      setIsSendingTurn(true);
      setError(null);
      cancelSpeech();

      // Optimistically append candidate turn
      const candidateTurn: InterviewTurn = {
        role: 'candidate',
        content: utterance,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, candidateTurn]);
      resetTranscript();

      // Call API
      const res = await interviewApi.sendTurn(session.id, utterance);

      // Append AI response
      const aiTurn: InterviewTurn = {
        role: 'ai',
        content: res.replyText,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, aiTurn]);

      // Update STAR detection state
      if (res.starProgress) {
        setStarProgress((prev) => ({
          situation: prev.situation || !!res.starProgress?.situation,
          task: prev.task || !!res.starProgress?.task,
          action: prev.action || !!res.starProgress?.action,
          result: prev.result || !!res.starProgress?.result,
        }));
      }

      // Speak response aloud
      speak(res.replyText);
    } catch (err: any) {
      console.error('Failed to process interview turn:', err);
      setError(err.response?.data?.message || 'Sophia could not process your answer.');
    } finally {
      setIsSendingTurn(false);
    }
  };

  // Advance to next behavioral question
  const handleAdvanceQuestion = async () => {
    if (!session || isAdvancing) return;

    try {
      setIsAdvancing(true);
      setError(null);
      cancelSpeech();

      const res = await interviewApi.advanceQuestion(session.id, '');

      if (res.isFinished && res.report) {
        setEvaluationReport(res.report);
        if (res.session) setSession(res.session);
      } else if (res.currentQuestion) {
        setCurrentQuestion(res.currentQuestion);
        setCurrentQuestionIndex(res.currentQuestionIndex ?? currentQuestionIndex + 1);

        // Reset STAR tracker for the new question
        setStarProgress({
          situation: false,
          task: false,
          action: false,
          result: false,
        });

        // Append AI transition turn and speak aloud
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
      <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
        <p className="text-slate-400 text-sm">Entering HR Behavioral Interview Suite...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-100">Session Error</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const isLastQuestion =
    currentQuestionIndex >= (questionsOverview.length > 0 ? questionsOverview.length - 1 : 2);

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col space-y-3 px-3 sm:px-6 py-3 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-tight flex items-center gap-2">
              <span>AI HR Behavioral Round</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-semibold">
                STAR Methodology
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Interviewer: <span className="text-slate-200 font-semibold">Sophia</span> (Senior Staff Talent Partner)
            </p>
          </div>
        </div>

        {/* Center: Question Stepper */}
        <div className="hidden md:flex items-center">
          <QuestionStepper currentIndex={currentQuestionIndex} questions={questionsOverview} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isMuted
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          <button
            type="button"
            onClick={handleFinishInterview}
            disabled={isFinishing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition disabled:opacity-50"
          >
            {isFinishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>End Interview</span>
          </button>
        </div>
      </div>

      {/* Main Executive Stage (Grid Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[620px]">
        {/* Left Column: Sophia Avatar Tile (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex-1 min-h-[360px] flex flex-col">
            <AIAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              interviewerName="Sophia"
            />
          </div>

          {/* Quick Voice Prompt Reminder */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center space-y-1">
            <p className="text-[11px] text-slate-400">
              🎤 <span className="text-slate-200 font-semibold">Voice Enabled:</span> Click the microphone below or use push-to-talk to respond naturally.
            </p>
          </div>
        </div>

        {/* Right Column: Question Card + STAR Live Tracker + Dialogue (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Active Question Card */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider">
                  {currentQuestion?.competency || 'Behavioral Competency'}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Question {currentQuestionIndex + 1} of 3
                </span>
              </div>

              {/* Advance / Next Question Button */}
              <button
                type="button"
                onClick={handleAdvanceQuestion}
                disabled={isAdvancing}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {isAdvancing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>{isLastQuestion ? 'Submit & Conclude' : 'Next Question'}</span>
              </button>
            </div>

            <div>
              <h2 className="text-sm sm:text-base font-bold text-white mb-1.5">
                {currentQuestion?.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentQuestion?.prompt}
              </p>
            </div>

            {/* Real-Time STAR Story Tracker */}
            <StarTracker progress={starProgress} />

            {/* Collapsible STAR Method Guide */}
            <div className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-950/40">
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  How Sophia evaluates your answer using STAR
                </span>
                {showTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTips && (
                <div className="px-3 pb-3 pt-1 space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/60 font-sans">
                  <p>
                    <strong className="text-emerald-400">Situation:</strong> Set the context and background. Where were you working and what was the challenge?
                  </p>
                  <p>
                    <strong className="text-purple-400">Task:</strong> What was your specific goal or assignment within the team?
                  </p>
                  <p>
                    <strong className="text-indigo-400">Action:</strong> Focus on "I" rather than "we". What direct technical or leadership steps did you take?
                  </p>
                  <p>
                    <strong className="text-amber-400">Result:</strong> Share the quantifiable impact (metrics, latency, uptime, or key learnings).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Dialogue Transcript Feed & Voice Controls */}
          <div className="flex-1 min-h-[290px] flex flex-col gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-3 overflow-hidden shadow-lg">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80">
              <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
              <h3 className="text-xs font-semibold text-slate-300">Live Dialogue Transcript</h3>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <TranscriptFeed
                turns={transcript}
                onReplaySpeech={speak}
                isAiSpeaking={isSpeaking}
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

      {/* Post-Interview STAR Report Modal */}
      {evaluationReport && (
        <HRReportModal
          report={evaluationReport}
          onClose={() => navigate('/dashboard')}
        />
      )}
    </div>
  );
};
