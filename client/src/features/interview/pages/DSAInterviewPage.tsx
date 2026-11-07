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
  const [mobileTab, setMobileTab] = useState<'panel' | 'editor'>('panel');

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

      const data = routeSessionId
        ? await interviewApi.getSession(routeSessionId)
        : await interviewApi.startOrResume('DSA');

      setSession(data.session);
      setTranscript(data.transcript);
      setProblem(data.currentQuestion);
      setQuestionsOverview(data.questionsOverview || []);
      setCurrentQuestionIndex(data.currentQuestion.index ?? 0);
      setIsEditorUnlocked(data.isEditorUnlocked);

      // Initialize code from starter template
      const initialCode =
        (data as any).starterCode || getStarterCodeForLanguage(data.currentQuestion, language);
      setCode(initialCode);

      setHasConfirmedSetup(true);

      // Spoken greeting from interviewer
      if (data.transcript.length > 0 && !hasSpokenOpeningRef.current) {
        const lastTurn = data.transcript[data.transcript.length - 1];
        if (lastTurn.role === 'ai') {
          hasSpokenOpeningRef.current = true;
          setTimeout(() => speak(lastTurn.content), 600);
        }
      }
    } catch (err: any) {
      console.error('Failed to start interview:', err);
      setError(err.response?.data?.message || 'Failed to initialize AI interview.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resume existing session if route param provided
  useEffect(() => {
    if (routeSessionId && !session) {
      startInterviewSession();
    }
  }, [routeSessionId]);

  // Handle switching programming language
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const starter = getStarterCodeForLanguage(problem, newLang);
    setCode(starter);
  };

  // Reset current code to template
  const handleResetCode = () => {
    const starter = getStarterCodeForLanguage(problem, language);
    setCode(starter);
  };

  // Send candidate speech or text turn
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

      // Call AI Interview turn API
      const response = await interviewApi.sendTurn(session.id, candidateText.trim(), code);

      // Append AI response
      const aiTurn: InterviewTurn = {
        role: 'ai',
        content: response.replyText || response.aiReply || '',
        timestamp: new Date().toISOString(),
      };
      setTranscript((prev) => [...prev, aiTurn]);

      // Speak AI response
      speak(aiTurn.content);

      // Check if candidate passed approach validation and unlocked code editor
      if (response.isEditorUnlocked !== undefined) {
        setIsEditorUnlocked(response.isEditorUnlocked);
      }

      // Check if interview concluded
      if ((response.isFinished || response.sessionComplete) && response.report) {
        setEvaluationReport(response.report);
      }
    } catch (err: any) {
      console.error('Failed to process interview turn:', err);
      setError(err.response?.data?.message || 'Failed to receive interviewer response.');
    } finally {
      setIsSendingTurn(false);
    }
  };

  // Run code against sandbox test cases
  const handleRunCode = async () => {
    if (!session || !problem || isRunningCode) return;

    try {
      setIsRunningCode(true);
      setError(null);

      const execResult = await interviewApi.runCode(
        session.id,
        code,
        language
      );
      setTestResults(execResult.results || execResult.testResults);

      // Also notify AI interviewer of execution attempt
      const passedCount = (execResult.results || execResult.testResults || []).filter((r: any) => r.passed).length;
      const totalCount = (execResult.results || execResult.testResults || []).length;
      const executionSummary = `I executed my solution. Result: ${passedCount}/${totalCount} visible test cases passed.`;

      // Inform AI quietly without full turn reload
      await interviewApi.sendTurn(session.id, executionSummary, code);
    } catch (err: any) {
      console.error('Failed to run code:', err);
      setError(err.response?.data?.message || 'Code execution failed.');
    } finally {
      setIsRunningCode(false);
    }
  };

  // Advance to next question in sequence
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

  // PRE-INTERVIEW SETUP STAGE
  if (!hasConfirmedSetup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-[#F5E8DD]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3E1D19]">
          <div className="flex items-center gap-3">
            <BackButton label="Home" fallbackRoute="/dashboard" />
            <div>
              <h1 className="text-2xl font-serif font-normal text-[#F5E8DD] tracking-tight">
                Set up your Technical DSA Interview
              </h1>
              <p className="text-xs text-[#A88879] mt-0.5">
                Each persona simulates a realistic hiring style. Pick the interviewer and format that matches your prep goal.
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#2D1A10] border border-[#522E22] text-[#F0B87A] text-xs font-semibold">
            Step 3 of 5
          </span>
        </div>

        {/* Step Indicator */}
        <div className="p-3.5 rounded-2xl bg-[#1A0C09]/80 border border-[#3E1D19] flex items-center justify-between text-xs text-[#A88879] backdrop-blur-md">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] text-[#140808] flex items-center justify-center font-bold text-[11px]">
              1
            </span>
            <span className="text-[#F5E8DD]">Choose your Interviewer & Problem Tier</span>
          </div>
          <span className="text-[#F0B87A] font-mono text-[11px]">Target: {targetCompany}</span>
        </div>

        {/* Persona Selector Grid */}
        <PersonaSelector
          selectedPersona={selectedPersona}
          onSelectPersona={setSelectedPersona}
        />

        {/* Format & Target Company Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Format / Duration */}
          <div className="p-4 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] space-y-2.5 backdrop-blur-md">
            <label className="text-xs font-bold text-[#F0B87A] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F0B87A]" />
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
                      ? 'bg-[#2D1A10] border-[#F0B87A] text-[#F0B87A]'
                      : 'bg-[#140705] border-[#3E1D19] text-[#A88879] hover:text-[#F5E8DD] hover:bg-[#24110E]'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#856658]">
              Includes approach validation, live code implementation, and complexity Q&A.
            </p>
          </div>

          {/* Target Company */}
          <div className="p-4 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] space-y-2.5 backdrop-blur-md">
            <label className="text-xs font-bold text-[#F0B87A] uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#F0B87A]" />
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
                      ? 'bg-[#2D1A10] border-[#F0B87A] text-[#F0B87A]'
                      : 'bg-[#140705] border-[#3E1D19] text-[#A88879] hover:text-[#F5E8DD] hover:bg-[#24110E]'
                  }`}
                >
                  {comp}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#856658]">
              Calibrates standard problem archetypes asked in recent recruitment loops.
            </p>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[#3E1D19]">
          <div className="text-xs text-[#A88879]">
            Selected: <strong className="text-[#F5E8DD]">{selectedPersona.name}</strong> ({selectedPersona.tier} • {formatMinutes}m)
          </div>

          <button
            type="button"
            onClick={startInterviewSession}
            disabled={isLoading}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] text-sm font-bold shadow-[0_0_20px_rgba(240,184,122,0.3)] flex items-center gap-2 cursor-pointer disabled:opacity-50 transition"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-[#140808]" /> : null}
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-[#F5E8DD]">
        <Loader2 className="w-8 h-8 text-[#F0B87A] animate-spin" />
        <h2 className="text-base font-serif font-medium text-[#F5E8DD]">Connecting to {selectedPersona.name}...</h2>
        <p className="text-xs text-[#A88879]">Initializing voice recognition and algorithmic test sandbox.</p>
      </div>
    );
  }

  // Error State
  if (error && !session) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-3xl bg-[#1A0C09]/90 border border-[#3E1D19] text-center space-y-4 shadow-sm text-[#F5E8DD]">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
        <h2 className="text-base font-serif font-medium text-[#F5E8DD]">Interview Session Error</h2>
        <p className="text-xs text-[#A88879]">{error}</p>
        <button
          onClick={() => setHasConfirmedSetup(false)}
          className="px-5 py-2 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] text-[#140808] text-xs font-bold"
        >
          Return to Setup
        </button>
      </div>
    );
  }

  const isLastQuestion =
    currentQuestionIndex >= (questionsOverview.length > 0 ? questionsOverview.length - 1 : 2);

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col space-y-2.5 px-3 sm:px-6 py-2.5 text-[#F5E8DD]">
      {/* Top Bar: Title + Question Stepper + Mute + End Interview */}
      <div className="flex items-center justify-between p-3 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl shrink-0 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <BackButton label="Exit" fallbackRoute="/dashboard" />
          <div className="p-2 rounded-xl bg-[#2D1A10] border border-[#522E22] text-[#F0B87A]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-serif font-medium text-[#F5E8DD] leading-tight flex items-center gap-2">
              <span>Technical DSA Interview</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-[#2D1A10] border-[#522E22] text-[#F0B87A]">
                {selectedPersona.name} ({selectedPersona.difficultyTier})
              </span>
            </h1>
            <p className="text-[11px] text-[#A88879]">
              Target: <strong className="text-[#F5E8DD]">{targetCompany}</strong> • Speak aloud to validate your logic
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
                ? 'bg-[#2E100D] border-red-800 text-red-300'
                : 'bg-[#140705] border-[#3E1D19] text-[#A88879] hover:text-[#F5E8DD]'
            }`}
            title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice On'}</span>
          </button>

          <button
            type="button"
            onClick={handleFinishInterview}
            disabled={isFinishing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2E100D] border border-red-800 text-red-300 hover:bg-[#3D1410] text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
          >
            {isFinishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            <span>End Interview</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Switcher (< lg) */}
      <div className="flex lg:hidden items-center p-1 rounded-2xl bg-[#1A0C09] border border-[#3E1D19] gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMobileTab('panel')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
            mobileTab === 'panel'
              ? 'bg-[#331713] text-[var(--theme-accent,#FF9E79)] border border-[#52251D] shadow-sm'
              : 'text-[#A88879] hover:text-[#F5E8DD]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[var(--theme-accent,#FF9E79)] animate-pulse" />
          <span>AI Panel &amp; Voice</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
            mobileTab === 'editor'
              ? 'bg-[#331713] text-[var(--theme-accent,#FF9E79)] border border-[#52251D] shadow-sm'
              : 'text-[#A88879] hover:text-[#F5E8DD]'
          }`}
        >
          <span>Code Editor &amp; Tests</span>
          {isEditorUnlocked ? (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          ) : (
            <Lock className="w-3 h-3 text-[#A88879]" />
          )}
        </button>
      </div>

      {/* Desktop Split Resizable Workspace (>= lg) */}
      <Group orientation="horizontal" className="hidden lg:flex flex-1 min-h-[660px] rounded-2xl overflow-hidden">
        {/* Left Panel: AI Interviewer */}
        <Panel id="interviewer" defaultSize="38%" minSize="28%" maxSize="50%" className="flex flex-col gap-2.5 pr-1">
          {/* Top Half: Persona Avatar */}
          <div className="h-[46%] min-h-[260px] flex flex-col">
            <AIAvatar
              isSpeaking={isSpeaking}
              isListening={isListening}
              interviewerName={selectedPersona.name}
              personaKey={selectedPersona.key}
              subtitle={`${selectedPersona.role} (${selectedPersona.difficultyTier})`}
            />
          </div>

          {/* Bottom Half: Dialogue Transcript & Voice Controls */}
          <div className="h-[54%] min-h-[290px] flex flex-col gap-2 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl p-2.5 overflow-hidden shadow-sm backdrop-blur-md">
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
          <div className="w-1 h-14 rounded-full bg-[#3E1D19] group-hover:bg-[#F0B87A] group-hover:w-1.5 group-hover:h-20 transition-all shadow-xs" />
        </Separator>

        {/* Right Panel: Problem Statement + Monaco Code Editor */}
        <Panel id="workspace" defaultSize="62%" minSize="50%" maxSize="72%" className="flex flex-col space-y-2.5 pl-1">
          {/* Problem Prompt Card */}
          <div className="p-3.5 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl space-y-1.5 shrink-0 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    problem?.difficulty === 'EASY'
                      ? 'bg-[#152B1E] text-emerald-300 border border-[#255436]'
                      : 'bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]'
                  }`}
                >
                  {problem?.difficulty || 'DSA'}
                </span>
                <h3 className="text-xs sm:text-sm font-serif font-medium text-[#F5E8DD] tracking-tight">
                  Question {currentQuestionIndex + 1} of 3: {problem?.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#F0B87A]">
                <span>Time Target: {problem?.timeComplexityTarget || 'O(N)'}</span>
                {problem?.spaceComplexityTarget && <span>• Space: {problem.spaceComplexityTarget}</span>}
              </div>
            </div>
            <p className="text-xs text-[#A88879] leading-relaxed font-sans line-clamp-3">
              {problem?.prompt}
            </p>
          </div>

          {/* Monaco Editor Header & Controls Bar */}
          <div className="flex items-center justify-between p-2.5 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl shrink-0 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#A88879] font-medium">Language:</label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#140705] border border-[#3E1D19] text-[#F5E8DD] text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#F0B87A]"
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
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#A88879] hover:text-[#F5E8DD] hover:bg-[#24110E] rounded-full transition disabled:opacity-40"
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
                    ? 'bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold shadow-[0_0_15px_rgba(240,184,122,0.3)]'
                    : 'bg-[#140705] text-[#856658] cursor-not-allowed border border-[#3E1D19]'
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
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  title={isLastQuestion ? 'Submit final solution & generate report' : 'Submit solution and advance to next challenge'}
                >
                  {isAdvancing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  <span>{isLastQuestion ? 'Submit & Conclude' : 'Submit & Next'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Monaco Code Editor with Approach-First Lock Overlay */}
          <div className="flex-1 min-h-[240px] rounded-2xl overflow-hidden border border-[#3E1D19] relative shadow-sm">
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

      {/* Mobile Workspace (< lg): Full Width Tabbed Views */}
      <div className="flex lg:hidden flex-col gap-2.5 min-h-[550px] flex-1">
        {mobileTab === 'panel' ? (
          <div className="flex flex-col gap-2.5 flex-1">
            <div className="h-[260px] flex flex-col">
              <AIAvatar
                isSpeaking={isSpeaking}
                isListening={isListening}
                interviewerName={selectedPersona.name}
                personaKey={selectedPersona.key}
                subtitle={`${selectedPersona.role} (${selectedPersona.difficultyTier})`}
              />
            </div>

            <div className="flex-1 min-h-[290px] flex flex-col gap-2 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl p-2.5 overflow-hidden shadow-sm backdrop-blur-md">
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
          </div>
        ) : (
          <div className="flex flex-col space-y-2.5 flex-1">
            {/* Problem Prompt Card */}
            <div className="p-3 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl space-y-1.5 shrink-0 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      problem?.difficulty === 'EASY'
                        ? 'bg-[#152B1E] text-emerald-300 border border-[#255436]'
                        : 'bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]'
                    }`}
                  >
                    {problem?.difficulty || 'DSA'}
                  </span>
                  <h3 className="text-xs font-serif font-medium text-[#F5E8DD] tracking-tight">
                    Q{currentQuestionIndex + 1}: {problem?.title}
                  </h3>
                </div>
                <div className="text-[11px] font-mono text-[#F0B87A]">
                  Target: {problem?.timeComplexityTarget || 'O(N)'}
                </div>
              </div>
              <p className="text-xs text-[#A88879] leading-relaxed font-sans line-clamp-3">
                {problem?.prompt}
              </p>
            </div>

            {/* Monaco Editor Header & Controls Bar */}
            <div className="flex items-center justify-between p-2 bg-[#1A0C09]/90 border border-[#3E1D19] rounded-2xl shrink-0 shadow-sm backdrop-blur-md">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#140705] border border-[#3E1D19] text-[#F5E8DD] text-xs rounded-lg px-2 py-1 outline-none"
              >
                <option value="javascript">JS</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={isRunningCode || !isEditorUnlocked}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition ${
                    isEditorUnlocked
                      ? 'bg-gradient-to-r from-[#F0B87A] to-[#E2A664] text-[#140808] font-bold'
                      : 'bg-[#140705] text-[#856658] cursor-not-allowed border border-[#3E1D19]'
                  }`}
                >
                  {isRunningCode ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                  <span>{isEditorUnlocked ? 'Run' : 'Locked'}</span>
                </button>

                {isEditorUnlocked && (
                  <button
                    type="button"
                    onClick={handleAdvanceQuestion}
                    disabled={isAdvancing}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
                  >
                    {isAdvancing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                    <span>{isLastQuestion ? 'Submit' : 'Next'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Monaco Code Editor with Approach-First Lock Overlay */}
            <div className="h-[280px] rounded-2xl overflow-hidden border border-[#3E1D19] relative shadow-sm">
              <CodeEditor
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  readOnly: !isEditorUnlocked,
                }}
              />

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
              <div className="shrink-0 max-h-[170px] overflow-y-auto">
                <TestCasesDrawer
                  testCases={problem.visibleTestCases}
                  results={testResults}
                  isRunning={isRunningCode}
                  onRunTestCases={handleRunCode}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post-Interview Evaluation Report Modal */}
      {evaluationReport && <InterviewReportModal report={evaluationReport} />}
    </div>
  );
};
export default DSAInterviewPage;