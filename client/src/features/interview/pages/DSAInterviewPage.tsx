import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  interviewApi,
  InterviewSessionData,
  InterviewTurn,
  ProblemData,
  EvaluationReportData,
} from '../api/interviewApi';
import { AIAvatar } from '../components/AIAvatar';
import { TranscriptFeed } from '../components/TranscriptFeed';
import { VoiceControls } from '../components/VoiceControls';
import { InterviewReportModal } from '../components/InterviewReportModal';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { TestCasesDrawer } from '../../assessment/components/TestCasesDrawer';
import { TestCaseResult } from '../../assessment/api/assessmentApi';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import {
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

export const DSAInterviewPage: React.FC = () => {
  const { sessionId: routeSessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSessionData | null>(null);
  const [transcript, setTranscript] = useState<InterviewTurn[]>([]);
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSendingTurn, setIsSendingTurn] = useState<boolean>(false);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestCaseResult[] | undefined>(undefined);
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

  // Speak opening turn once session starts
  const hasSpokenOpeningRef = useRef(false);

  // Initialize or resume session
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
          data = await interviewApi.startOrResume('DSA');
        }

        setSession(data.session);
        setTranscript(data.transcript || []);
        setProblem(data.problem);
        setCode(data.session.currentCode || data.problem.starterCode);

        // If newly started and has opening turn, speak it
        if (data.openingTurn && !hasSpokenOpeningRef.current) {
          hasSpokenOpeningRef.current = true;
          // Small delay for browser speech synthesis initialization
          setTimeout(() => {
            speak(data.openingTurn!.content);
          }, 600);
        }
      } catch (err: any) {
        console.error('Failed to initialize DSA interview session:', err);
        setError(err.response?.data?.message || 'Failed to start interview session.');
      } finally {
        setIsLoading(false);
      }
    };

    initInterview();
  }, [routeSessionId, speak]);

  // Handle candidate sending a turn
  const handleSendTurn = async (utterance: string) => {
    if (!session || !utterance.trim() || isSendingTurn) return;

    try {
      setIsSendingTurn(true);
      setError(null);
      cancelSpeech();

      // Optimistically append candidate turn
      const candidateTurn: InterviewTurn = {
        role: 'candidate',
        content: utterance,
        timestamp: new Date().toISOString(),
        codeSnippet: code.trim().length > 30 ? code : undefined,
      };
      setTranscript((prev) => [...prev, candidateTurn]);

      const res = await interviewApi.sendTurn(session.id, utterance, code);

      // Append AI turn
      const aiTurn: InterviewTurn = {
        role: 'ai',
        content: res.replyText,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, aiTurn]);

      // Speak AI reply aloud
      speak(res.replyText);

      // Auto-prompt finish if terminal turn
      if (res.isTerminalTurn) {
        setTimeout(() => {
          handleFinishInterview();
        }, 4000);
      }
    } catch (err: any) {
      console.error('Failed to send interview turn:', err);
      setError(err.response?.data?.message || 'Turn exchange failed.');
    } finally {
      setIsSendingTurn(false);
    }
  };

  // Run code against test cases in sandbox
  const handleRunCode = async () => {
    if (!session || isRunningCode) return;

    try {
      setIsRunningCode(true);
      const res = await interviewApi.runCode(session.id, code, language);
      setTestResults(res.results);
    } catch (err: any) {
      console.error('Failed to execute code in interview:', err);
    } finally {
      setIsRunningCode(false);
    }
  };

  // Finish interview and generate AI evaluation report
  const handleFinishInterview = useCallback(async () => {
    if (!session || isFinishing) return;

    const confirmed = window.confirm(
      'Are you ready to conclude your technical interview and generate your AI evaluation report?'
    );
    if (!confirmed) return;

    try {
      setIsFinishing(true);
      cancelSpeech();
      const res = await interviewApi.finishInterview(session.id, code);
      setEvaluationReport(res.report);
      setSession(res.session);
    } catch (err: any) {
      console.error('Failed to finalize interview:', err);
      setError(err.response?.data?.message || 'Failed to complete interview evaluation.');
    } finally {
      setIsFinishing(false);
    }
  }, [session, isFinishing, cancelSpeech, code]);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Initializing AI Technical Interview Room...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-100">Interview Session Error</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <button
          onClick={() => navigate('/oa')}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] flex flex-col space-y-3 px-3 sm:px-6 py-3">
      {/* Top Bar: Title + Mute + Finish Interview */}
      <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-tight flex items-center gap-2">
              <span>AI Technical Interview (DSA)</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                Live Turn-Based
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              {problem?.title || 'Algorithmic Problem Solving'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Mute TTS button */}
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

          {/* End Interview */}
          <button
            type="button"
            onClick={handleFinishInterview}
            disabled={isFinishing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition disabled:opacity-50"
          >
            {isFinishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : null}
            <span>End Interview</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column (AI Avatar & Voice Turns) | Right Column (Monaco Editor & Sandbox) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[600px]">
        {/* Left Column: AI Avatar, Turn Feed & Voice Controls */}
        <div className="lg:col-span-5 flex flex-col space-y-3 h-[600px] lg:h-[calc(100vh-175px)]">
          {/* AI Avatar */}
          <AIAvatar
            isSpeaking={isSpeaking}
            isListening={isListening}
            interviewerName="Sophia — Technical Bar Raiser"
          />

          {/* Turn-by-Turn Dialogue Feed */}
          <TranscriptFeed
            turns={transcript}
            onReplaySpeech={speak}
            isAiSpeaking={isSpeaking}
          />

          {/* Voice & Speech Controls */}
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

        {/* Right Column: Problem Prompt, Monaco Code Editor & Test Cases */}
        <div className="lg:col-span-7 flex flex-col space-y-3 h-[600px] lg:h-[calc(100vh-175px)]">
          {/* Problem Prompt Accordion / Card */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Challenge: {problem?.title}
              </h3>
              <span className="text-[10px] text-indigo-400 font-mono">Time Constraint: O(N)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">
              {problem?.prompt}
            </p>
          </div>

          {/* Code Editor Header */}
          <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCode(problem?.starterCode || '')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunningCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {isRunningCode ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Run Code</span>
              </button>
            </div>
          </div>

          {/* Monaco Code Editor */}
          <div className="flex-1 min-h-[220px] rounded-xl overflow-hidden border border-slate-800">
            <CodeEditor
              language={language}
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Test Cases Drawer */}
          {problem?.visibleTestCases && (
            <div className="shrink-0 max-h-[190px] overflow-y-auto">
              <TestCasesDrawer
                testCases={problem.visibleTestCases}
                results={testResults}
                isRunning={isRunningCode}
                onRunTestCases={handleRunCode}
              />
            </div>
          )}
        </div>
      </div>

      {/* Post-Interview Evaluation Report Modal */}
      {evaluationReport && <InterviewReportModal report={evaluationReport} />}
    </div>
  );
};
