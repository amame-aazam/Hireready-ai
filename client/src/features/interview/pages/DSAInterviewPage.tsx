import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';
import {
  interviewApi,
  InterviewSessionData,
  InterviewTurn,
  ProblemData,
  QuestionOverviewItem,
  EvaluationReportData,
} from '../api/interviewApi';
import { AIAvatar } from '../components/AIAvatar';
import { TranscriptFeed } from '../components/TranscriptFeed';
import { VoiceControls } from '../components/VoiceControls';
import { QuestionStepper } from '../components/QuestionStepper';
import { EditorLockOverlay } from '../components/EditorLockOverlay';
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
  ArrowRight,
  Lock,
} from 'lucide-react';

export const DSAInterviewPage: React.FC = () => {
  const { sessionId: routeSessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSessionData | null>(null);
  const [transcript, setTranscript] = useState<InterviewTurn[]>([]);
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [questionsOverview, setQuestionsOverview] = useState<QuestionOverviewItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isEditorUnlocked, setIsEditorUnlocked] = useState<boolean>(false);

  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSendingTurn, setIsSendingTurn] = useState<boolean>(false);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [isAdvancing, setIsAdvancing] = useState<boolean>(false);
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

  const hasSpokenOpeningRef = useRef(false);

  // Helper to extract starter code for a specific language
  const getStarterCodeForLanguage = (prob: ProblemData | null, lang: string): string => {
    if (!prob) return '';
    if (typeof prob.starterCode === 'object') {
      return (prob.starterCode as any)[lang] || prob.starterCode.javascript;
    }
    return prob.starterCode || '';
  };

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
        setProblem(data.currentQuestion);
        setCurrentQuestionIndex(data.currentQuestion?.index ?? data.session.currentQuestionIndex ?? 0);
        setIsEditorUnlocked(data.isEditorUnlocked);

        if (data.questionsOverview && data.questionsOverview.length > 0) {
          setQuestionsOverview(data.questionsOverview);
        }

        const initialCode =
          data.currentCode || getStarterCodeForLanguage(data.currentQuestion, 'javascript');
        setCode(initialCode);

        // If newly started and has opening turn, speak it aloud
        if (data.openingTurn && !hasSpokenOpeningRef.current) {
          hasSpokenOpeningRef.current = true;
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

  // Handle candidate sending a turn (voice or text)
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
        codeSnippet: isEditorUnlocked && code.trim().length > 30 ? code : undefined,
      };
      setTranscript((prev) => [...prev, candidateTurn]);

      const res = await interviewApi.sendTurn(session.id, utterance, isEditorUnlocked ? code : undefined);

      // Append AI turn
      const aiTurn: InterviewTurn = {
        role: 'ai',
        content: res.replyText,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, aiTurn]);

      // If Sophia approved the approach, unlock the Monaco editor!
      if (res.isEditorUnlocked !== undefined) {
        setIsEditorUnlocked(res.isEditorUnlocked);
      }
      if (res.stage) {
        setSession((prev) => (prev ? { ...prev, stage: res.stage! } : null));
      }

      // Speak AI reply aloud
      speak(res.replyText);
    } catch (err: any) {
      console.error('Failed to send interview turn:', err);
      setError(err.response?.data?.message || 'Turn exchange failed.');
    } finally {
      setIsSendingTurn(false);
    }
  };

  // Handle language change and starter template auto-switching
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const starterForNewLang = getStarterCodeForLanguage(problem, newLang);
    const currentStarter = getStarterCodeForLanguage(problem, language);

    const isStarterOrEmpty = !code.trim() || code.trim() === currentStarter.trim();
    if (isStarterOrEmpty && starterForNewLang) {
      setCode(starterForNewLang);
    }
  };

  // Reset current code to template for active language
  const handleResetCode = () => {
    const starter = getStarterCodeForLanguage(problem, language);
    setCode(starter);
  };

  // Run code against test cases in sandbox
  const handleRunCode = async () => {
    if (!session || isRunningCode || !isEditorUnlocked) return;

    try {
      setIsRunningCode(true);
      const res = await interviewApi.runCode(session.id, code, language);
      setTestResults(res.results);

      // If all test cases passed, Sophia congratulates candidate
      if (res.allPassed && !isSpeaking) {
        speak('All test cases passed! You can click "Submit & Next Question" to proceed to the next problem.');
      }
    } catch (err: any) {
      console.error('Failed to execute code in interview:', err);
      setError(err.response?.data?.message || 'Code execution failed.');
    } finally {
      setIsRunningCode(false);
    }
  };

  // Advance to the next question in the 3-question sequence
  const handleAdvanceQuestion = async () => {
    if (!session || isAdvancing) return;

    try {
      setIsAdvancing(true);
      cancelSpeech();

      const res = await interviewApi.advanceQuestion(session.id, code, language);

      if (res.isFinished && res.report) {
        setEvaluationReport(res.report);
        if (res.session) setSession(res.session);
        return;
      }

      if (res.currentQuestion) {
        setProblem(res.currentQuestion);
        setCurrentQuestionIndex(res.currentQuestion.index);
        setIsEditorUnlocked(res.isEditorUnlocked);

        // Update code to next question template for selected language
        const nextStarter = getStarterCodeForLanguage(res.currentQuestion, language);
        setCode(nextStarter);

        // Clear previous question test results
        setTestResults(undefined);

        // Append AI transition turn and speak it aloud
        if (res.aiTransitionTurn) {
          setTranscript((prev) => [...prev, res.aiTransitionTurn!]);
          speak(res.aiTransitionTurn.content);
        }
      }
    } catch (err: any) {
      console.error('Failed to advance question:', err);
      setError(err.response?.data?.message || 'Failed to advance to next challenge.');
    } finally {
      setIsAdvancing(false);
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
        <p className="text-slate-400 text-sm">Initializing AI Technical Interview Workspace...</p>
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

  const isLastQuestion = currentQuestionIndex >= (questionsOverview.length > 0 ? questionsOverview.length - 1 : 2);

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col space-y-2.5 px-3 sm:px-6 py-2.5">
      {/* Top Bar: Title + Question Stepper + Mute + End Interview */}
      <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
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
              Interviewer: <span className="text-slate-200 font-semibold">Sophia</span> (Senior Staff Bar Raiser)
            </p>
          </div>
        </div>

        {/* Center: Question Stepper */}
        <div className="hidden md:flex items-center">
          <QuestionStepper currentIndex={currentQuestionIndex} questions={questionsOverview} />
        </div>

        {/* Controls: Mute & End Interview */}
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

      {/* LeetCode-Style Resizable Split Workspace */}
      <Group orientation="horizontal" className="flex-1 min-h-[660px] rounded-2xl overflow-hidden">
        {/* Left Panel: AI Interviewer (Sophia Avatar Top Half + Dialogue Transcript Bottom Half) */}
        <Panel id="interviewer" defaultSize="38%" minSize="28%" maxSize="50%" className="flex flex-col gap-2.5 pr-1">
          {/* Top Half: Sophia Avatar (Prominent, Visible, Animated) */}
          <div className="h-[46%] min-h-[260px] flex flex-col">
            <AIAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              interviewerName="Sophia"
            />
          </div>

          {/* Bottom Half: Dialogue Transcript & Voice Controls */}
          <div className="h-[54%] min-h-[290px] flex flex-col gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-2.5 overflow-hidden shadow-lg">
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
        </Panel>

        {/* Draggable Vertical Resize Divider */}
        <Separator className="w-2.5 px-0.5 flex items-center justify-center cursor-col-resize group outline-none select-none">
          <div className="w-1 h-14 rounded-full bg-slate-700/80 group-hover:bg-indigo-400 group-hover:w-1.5 group-hover:h-20 group-active:bg-indigo-500 transition-all shadow-sm" />
        </Separator>

        {/* Right Panel: Coding Workspace (Problem Statement + Monaco Editor + Test Cases) */}
        <Panel id="workspace" defaultSize="62%" minSize="50%" maxSize="72%" className="flex flex-col space-y-2.5 pl-1">
          {/* Problem Prompt Card */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    problem?.difficulty === 'EASY'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {problem?.difficulty || 'DSA'}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight">
                  Question {currentQuestionIndex + 1} of 3: {problem?.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400">
                <span>Time Target: {problem?.timeComplexityTarget || 'O(N)'}</span>
                {problem?.spaceComplexityTarget && (
                  <span>• Space: {problem.spaceComplexityTarget}</span>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
              {problem?.prompt}
            </p>
          </div>

          {/* Monaco Editor Header & Controls Bar */}
          <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="python">Python 3</option>
                <option value="java">Java (OpenJDK 17)</option>
                <option value="cpp">C++ (GCC 11)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetCode}
                disabled={!isEditorUnlocked}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* Run Code Button */}
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunningCode || !isEditorUnlocked}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-sm transition ${
                  isEditorUnlocked
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
                }`}
                title={isEditorUnlocked ? 'Run tests against sandbox' : 'Editor locked: Explain approach to Sophia first'}
              >
                {isRunningCode ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : !isEditorUnlocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isEditorUnlocked ? 'Run Code' : 'Locked'}</span>
              </button>

              {/* Advance to Next Question / Finish Button */}
              {isEditorUnlocked && (
                <button
                  type="button"
                  onClick={handleAdvanceQuestion}
                  disabled={isAdvancing}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  title={isLastQuestion ? 'Submit final solution & generate report' : 'Submit solution and advance to next challenge'}
                >
                  {isAdvancing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                  <span>{isLastQuestion ? 'Submit & Conclude' : 'Submit & Next'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Monaco Code Editor with Frosted Lock Overlay */}
          <div className="flex-1 min-h-[240px] rounded-xl overflow-hidden border border-slate-800 relative">
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
                readOnly: !isEditorUnlocked,
              }}
            />

            {/* Approach First: Lock Overlay when in APPROACH stage */}
            {!isEditorUnlocked && (
              <EditorLockOverlay
                questionTitle={problem?.title}
                timeComplexityTarget={problem?.timeComplexityTarget}
              />
            )}
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
        </Panel>
      </Group>

      {/* Post-Interview Evaluation Report Modal */}
      {evaluationReport && <InterviewReportModal report={evaluationReport} />}
    </div>
  );
};
