import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
import { PersonaSelector } from '../components/PersonaSelector';
import { Persona, TECHNICAL_PERSONAS } from '../types/persona';
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
  Building2,
  Clock,
} from 'lucide-react';
import { BackButton } from '../../../components/common/BackButton';

export const DSAInterviewPage: React.FC = () => {
  const { sessionId: routeSessionId } = useParams<{ sessionId?: string }>();

  // Setup / Persona Configuration Stage
  const [selectedPersona, setSelectedPersona] = useState<Persona>(TECHNICAL_PERSONAS[2]); // Default Samarth
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [formatMinutes, setFormatMinutes] = useState<number>(45);
  const [hasConfirmedSetup, setHasConfirmedSetup] = useState<boolean>(!!routeSessionId);

  const [session, setSession] = useState<InterviewSessionData | null>(null);
  const [transcript, setTranscript] = useState<InterviewTurn[]>([]);
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [questionsOverview, setQuestionsOverview] = useState<QuestionOverviewItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isEditorUnlocked, setIsEditorUnlocked] = useState<boolean>(false);

  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const startInterviewSession = async () => {
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

      setHasConfirmedSetup(true);

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

  useEffect(() => {
    if (routeSessionId) {
      startInterviewSession();
    }
  }, [routeSessionId]);

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
        codeSnippet: isEditorUnlocked ? code : undefined,
        codeSnapshot: isEditorUnlocked ? code : undefined,
      };
      setTranscript((prev) => [...prev, candidateTurn]);

      const response = await interviewApi.sendTurn(session.id, utterance, isEditorUnlocked ? code : undefined);

      const replyContent = response.aiReply || response.replyText;

      // Append AI response turn
      const aiTurn: InterviewTurn = {
        role: 'ai',
        content: replyContent,
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, aiTurn]);

      // State Machine check: Unlock Monaco editor if AI approves approach
      if (response.isEditorUnlocked) {
        setIsEditorUnlocked(true);
      }

      // Voice synthesis response aloud
      speak(replyContent);
    } catch (err: any) {
      console.error('Failed to process interview turn:', err);
      setError(err.response?.data?.message || 'Failed to send response.');
    } finally {
      setIsSendingTurn(false);
    }
  };

  // Run Code against Judge0 Sandbox
  const handleRunCode = async () => {
    if (!session || isRunningCode || !isEditorUnlocked) return;

    try {
      setIsRunningCode(true);
      setTestResults(undefined);
      setError(null);

      const result = await interviewApi.runCode(session.id, code, language);

      const resList = result.testResults || result.results || [];
      setTestResults(resList);

      const total = result.totalTestCases ?? result.totalCount ?? resList.length;
      const passedCount = result.passedTestCases ?? result.passedCount ?? resList.filter((r) => r.passed).length;

      const passMessage = result.allPassed || result.passed
        ? `Great! All ${total} test cases passed.`
        : `${passedCount} out of ${total} test cases passed.`;

      speak(passMessage);
    } catch (err: any) {
      console.error('Failed to run code:', err);
      setError(err.response?.data?.message || 'Code execution failed.');
    } finally {
      setIsRunningCode(false);
    }
  };

  // Reset Code to starter snippet
  const handleResetCode = () => {
    setCode(getStarterCodeForLanguage(problem, language));
  };

  // Change Language
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(getStarterCodeForLanguage(problem, newLang));
  };

  // Advance to next question
  const handleAdvanceQuestion = async () => {
    if (!session || isAdvancing) return;

    try {
      setIsAdvancing(true);
      setError(null);
      cancelSpeech();

      const nextData = await interviewApi.advanceQuestion(session.id, code, language);

      if ((nextData.isFinished || nextData.sessionComplete) && nextData.report) {
        setEvaluationReport(nextData.report);
        return;
      }

      setProblem(nextData.currentQuestion || null);
      setCurrentQuestionIndex(nextData.currentQuestion?.index ?? currentQuestionIndex + 1);
      setIsEditorUnlocked(nextData.isEditorUnlocked);
      setTestResults(undefined);

      const newCode =
        nextData.starterCode || getStarterCodeForLanguage(nextData.currentQuestion || null, language);
      setCode(newCode);

      if (nextData.aiTransitionTurn) {
        setTranscript((prev) => [...prev, nextData.aiTransitionTurn!]);
        speak(nextData.aiTransitionTurn.content);
      } else if (nextData.nextQuestionOpening) {
        const openingContent = nextData.nextQuestionOpening.content;
        const openingTurn: InterviewTurn = {
          role: 'ai',
          content: openingContent,
          timestamp: new Date().toISOString(),
        };
        setTranscript((prev) => [...prev, openingTurn]);
        speak(openingContent);
      }
    } catch (err: any) {
      console.error('Failed to advance question:', err);
      setError(err.response?.data?.message || 'Failed to advance to next challenge.');
    } finally {
      setIsAdvancing(false);
    }
  };

  // Finish interview early
  const handleFinishInterview = async () => {
    if (!session || isFinishing) return;
    const confirm = window.confirm(
      'Are you sure you want to conclude your technical interview? A comprehensive evaluation report will be generated.'
    );
    if (!confirm) return;

    try {
      setIsFinishing(true);
      setError(null);
      cancelSpeech();

      const finishData = await interviewApi.finishInterview(session.id, code);
      setEvaluationReport(finishData.report);
    } catch (err: any) {
      console.error('Failed to finish interview:', err);
      setError(err.response?.data?.message || 'Failed to conclude interview.');
    } finally {
      setIsFinishing(false);
    }
  };

  // PRE-INTERVIEW SETUP STAGE (Sakshaat AI Design)
  if (!hasConfirmedSetup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F2DDD2]">
          <div className="flex items-center gap-3">
            <BackButton label="Home" fallbackRoute="/dashboard" />
            <div>
              <h1 className="text-2xl font-bold text-[#0A0706] tracking-tight">Set up your Technical DSA Interview</h1>
              <p className="text-xs text-[#6B544A] mt-0.5">
                Each persona simulates a realistic hiring style. Pick the interviewer and format that matches your prep goal.
              </p>
            </div>
          </div>
          <span className="badge-chip">Step 3 of 5</span>
        </div>

        {/* Step Indicator */}
        <div className="p-3 rounded-2xl bg-white border border-[#F2DDD2] flex items-center justify-between text-xs text-[#6B544A]">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-[#FF7A48] text-white flex items-center justify-center font-bold text-[11px]">
              1
            </span>
            <span>Choose your Interviewer & Problem Tier</span>
          </div>
          <span className="text-[#8C7268] font-mono text-[11px]">Target: {targetCompany}</span>
        </div>

        {/* Persona Selector Grid */}
        <PersonaSelector
          selectedPersona={selectedPersona}
          onSelectPersona={setSelectedPersona}
        />

        {/* Format & Target Company Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Format / Duration */}
          <div className="p-4 rounded-2xl bg-white border border-[#F2DDD2] space-y-2.5">
            <label className="text-xs font-bold text-[#0A0706] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF7A48]" />
              <span>Interview Duration</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setFormatMinutes(mins)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    formatMinutes === mins
                      ? 'bg-[#FFEBE1] border-[#FF7A48] text-[#A83E14]'
                      : 'bg-[#FFFAF7] border-[#F2DDD2] text-[#6B544A] hover:bg-white'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#8C7268]">
              Includes approach validation, live code implementation, and complexity Q&A.
            </p>
          </div>

          {/* Target Company */}
          <div className="p-4 rounded-2xl bg-white border border-[#F2DDD2] space-y-2.5">
            <label className="text-xs font-bold text-[#0A0706] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#FF7A48]" />
              <span>Target Company Loop</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Google', 'Amazon', 'Microsoft', 'Uber', 'Atlassian', 'Startup'].map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => setTargetCompany(comp)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                    targetCompany === comp
                      ? 'bg-[#FFEBE1] border-[#FF7A48] text-[#A83E14]'
                      : 'bg-[#FFFAF7] border-[#F2DDD2] text-[#6B544A] hover:bg-white'
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#8C7268]">
              Calibrates standard problem archetypes asked in recent recruitment loops.
            </p>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F2DDD2]">
          <div className="text-xs text-[#6B544A]">
            Selected: <strong className="text-[#0A0706]">{selectedPersona.name}</strong> ({selectedPersona.tier} • {formatMinutes}m)
          </div>

          <button
            type="button"
            onClick={startInterviewSession}
            disabled={isLoading}
            className="btn-primary px-8 py-3 text-sm font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Start Technical Round with {selectedPersona.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#FF7A48] animate-spin" />
        <h2 className="text-base font-bold text-[#0A0706]">Connecting to {selectedPersona.name}...</h2>
        <p className="text-xs text-[#6B544A]">Initializing voice recognition and algorithmic test sandbox.</p>
      </div>
    );
  }

  // Error State
  if (error && !session) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-white border border-[#F2DDD2] text-center space-y-4 shadow-sm">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-[#0A0706]">Interview Session Error</h2>
        <p className="text-xs text-[#6B544A]">{error}</p>
        <button
          onClick={() => setHasConfirmedSetup(false)}
          className="btn-primary px-5 py-2 text-xs font-semibold"
        >
          Return to Setup
        </button>
      </div>
    );
  }

  const isLastQuestion =
    currentQuestionIndex >= (questionsOverview.length > 0 ? questionsOverview.length - 1 : 2);

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col space-y-2.5 px-3 sm:px-6 py-2.5 bg-[#FFFAF7]">
      {/* Top Bar: Title + Question Stepper + Mute + End Interview */}
      <div className="flex items-center justify-between p-3 bg-white border border-[#F2DDD2] rounded-2xl shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <BackButton label="Exit" fallbackRoute="/dashboard" />
          <div className="p-2 rounded-xl bg-[#FFEBE1] border border-[#FFD7C5] text-[#FF7A48]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0A0706] leading-tight flex items-center gap-2">
              <span>Technical DSA Interview</span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                style={{
                  backgroundColor: selectedPersona.accentBg,
                  borderColor: selectedPersona.accentBorder,
                  color: selectedPersona.accentColor,
                }}
              >
                {selectedPersona.name} ({selectedPersona.tier})
              </span>
            </h1>
            <p className="text-[11px] text-[#6B544A]">
              Target: <strong className="text-[#0A0706]">{targetCompany}</strong> • Speak aloud to validate your logic
            </p>
          </div>
        </div>

        {/* Center: Question Stepper */}
        <div className="hidden md:flex items-center">
          <QuestionStepper currentIndex={currentQuestionIndex} questions={questionsOverview} />
        </div>

        {/* Controls: Mute & End Interview */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-[#F2DDD2] text-[#6B544A] hover:bg-[#FFF5F0]'
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            {isFinishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>End Interview</span>
          </button>
        </div>
      </div>

      {/* Resizable Split Workspace */}
      <Group orientation="horizontal" className="flex-1 min-h-[660px] rounded-2xl overflow-hidden">
        {/* Left Panel: AI Interviewer (Avatar Top Half + Dialogue Bottom Half) */}
        <Panel id="interviewer" defaultSize="38%" minSize="28%" maxSize="50%" className="flex flex-col gap-2.5 pr-1">
          {/* Top Half: Persona Avatar */}
          <div className="h-[46%] min-h-[260px] flex flex-col">
            <AIAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              interviewerName={selectedPersona.name}
              personaKey={selectedPersona.key}
              subtitle={`${selectedPersona.role} (${selectedPersona.tier})`}
            />
          </div>

          {/* Bottom Half: Dialogue Transcript & Voice Controls */}
          <div className="h-[54%] min-h-[290px] flex flex-col gap-2 bg-white border border-[#F2DDD2] rounded-2xl p-2.5 overflow-hidden shadow-xs">
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <TranscriptFeed
                turns={transcript}
                onReplaySpeech={speak}
                isAiSpeaking={isSpeaking}
                aiName={selectedPersona.name}
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

        {/* Draggable Divider */}
        <Separator className="w-2 px-0.5 flex items-center justify-center cursor-col-resize group outline-hidden select-none">
          <div className="w-1 h-14 rounded-full bg-[#E8CBBE] group-hover:bg-[#FF7A48] group-hover:w-1.5 group-hover:h-20 transition-all shadow-xs" />
        </Separator>

        {/* Right Panel: Problem Statement + Monaco Code Editor */}
        <Panel id="workspace" defaultSize="62%" minSize="50%" maxSize="72%" className="flex flex-col space-y-2.5 pl-1">
          {/* Problem Prompt Card */}
          <div className="p-3.5 bg-white border border-[#F2DDD2] rounded-2xl space-y-1.5 shrink-0 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    problem?.difficulty === 'EASY'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {problem?.difficulty || 'DSA'}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-[#0A0706] tracking-tight">
                  Question {currentQuestionIndex + 1} of 3: {problem?.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF7A48]">
                <span>Time Target: {problem?.timeComplexityTarget || 'O(N)'}</span>
                {problem?.spaceComplexityTarget && <span>• Space: {problem.spaceComplexityTarget}</span>}
              </div>
            </div>
            <p className="text-xs text-[#6B544A] leading-relaxed font-sans line-clamp-3">
              {problem?.prompt}
            </p>
          </div>

          {/* Monaco Editor Header & Controls Bar */}
          <div className="flex items-center justify-between p-2.5 bg-white border border-[#F2DDD2] rounded-2xl shrink-0 shadow-xs">
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#6B544A] font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#FFFAF7] border border-[#F2DDD2] text-[#0A0706] text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-[#FF7A48]"
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
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#6B544A] hover:text-[#0A0706] hover:bg-[#FFF5F0] rounded-full transition disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              {/* Run Code Button */}
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunningCode || !isEditorUnlocked}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  isEditorUnlocked
                    ? 'bg-[#FF7A48] hover:bg-[#F05A24] text-white shadow-xs'
                    : 'bg-[#FFFAF7] text-[#8C7268] cursor-not-allowed border border-[#F2DDD2]'
                }`}
                title={isEditorUnlocked ? 'Run tests against sandbox' : `Editor locked: Explain approach to ${selectedPersona.name} first`}
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

              {/* Advance Question Button */}
              {isEditorUnlocked && (
                <button
                  type="button"
                  onClick={handleAdvanceQuestion}
                  disabled={isAdvancing}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                  title={isLastQuestion ? 'Submit final solution & generate report' : 'Submit solution and advance to next challenge'}
                >
                  {isAdvancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>{isLastQuestion ? 'Submit & Conclude' : 'Submit & Next'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Monaco Code Editor with Approach-First Lock Overlay */}
          <div className="flex-1 min-h-[240px] rounded-2xl overflow-hidden border border-[#F2DDD2] relative shadow-xs">
            <CodeEditor
              language={language}
              theme="vs-dark"
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
                interviewerName={selectedPersona.name}
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
export default DSAInterviewPage;
