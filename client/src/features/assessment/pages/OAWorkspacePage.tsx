import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  assessmentApi,
  QuestionData,
  AttemptAnswers,
  TestCaseResult,
  FinalSubmissionResult,
} from '../api/assessmentApi';
import { CountdownTimer } from '../components/CountdownTimer';
import { AutosaveIndicator } from '../components/AutosaveIndicator';
import { QuestionPalette } from '../components/QuestionPalette';
import { McqQuestionView } from '../components/McqQuestionView';
import { CodingWorkspace } from '../components/CodingWorkspace';
import { SubmissionResultModal } from '../components/SubmissionResultModal';
import { useTimer } from '../hooks/useTimer';
import { useAutosave } from '../hooks/useAutosave';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertTriangle,
  Menu,
  X,
} from 'lucide-react';

export const OAWorkspacePage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Assessment & Questions state
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [assessmentTitle, setAssessmentTitle] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Candidate answers state
  const [answers, setAnswers] = useState<AttemptAnswers>({ mcq: {}, code: {} });

  // Code runner state per question
  const [codeTestResults, setCodeTestResults] = useState<Record<string, TestCaseResult[]>>({});
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);

  // Time & Submission state
  const [initialSeconds, setInitialSeconds] = useState<number>(2700); // 45m default
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [finalResult, setFinalResult] = useState<FinalSubmissionResult | null>(null);
  const [showPaletteMobile, setShowPaletteMobile] = useState<boolean>(false);

  // Handle final submission (idempotent)
  const handleSubmit = useCallback(
    async (isAutoSubmit: boolean = false) => {
      if (!attemptId || isSubmitting) return;

      if (!isAutoSubmit) {
        const confirmed = window.confirm(
          'Are you sure you want to finish and submit your assessment? You cannot modify answers after submitting.'
        );
        if (!confirmed) return;
      }

      try {
        setIsSubmitting(true);
        // Force sync current answers first
        await assessmentApi.autosave(attemptId, answers);
        const result = await assessmentApi.submit(attemptId);
        setFinalResult(result);
      } catch (err: any) {
        console.error('Submission failed:', err);
        setError(err.response?.data?.message || 'Failed to submit assessment. Please retry.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [attemptId, answers, isSubmitting]
  );

  // Timer hook
  const { formattedTime, isWarning, isDanger, isExpired } = useTimer({
    initialSeconds,
    onExpire: () => {
      handleSubmit(true);
    },
    isPaused: !!finalResult || isLoading,
  });

  // Autosave hook
  const { isSaving, lastSavedAt, saveError, saveNow } = useAutosave({
    attemptId: attemptId || '',
    answers,
    isEnabled: !finalResult && !isLoading && !isExpired,
    intervalMs: 10000,
  });

  // Load attempt data on mount
  useEffect(() => {
    if (!attemptId) {
      navigate('/oa');
      return;
    }

    const initWorkspace = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Resume attempt
        const data = await assessmentApi.startOrResume(attemptId);

        setAssessmentTitle(data.assessment.title);
        setQuestions(data.assessment.questions);
        setInitialSeconds(data.attempt.remainingSeconds);

        // Populate existing answers
        const loadedAnswers: AttemptAnswers = {
          mcq: data.attempt.answers?.mcq || {},
          code: data.attempt.answers?.code || {},
        };

        // Initialize code starter templates if question doesn't have an answer yet
        data.assessment.questions.forEach((q) => {
          if (q.type === 'CODING' && !loadedAnswers.code[q.id]) {
            const starter = q.starterCode?.javascript || '// Write solution here\n';
            loadedAnswers.code[q.id] = { code: starter, language: 'javascript' };
          }
        });

        setAnswers(loadedAnswers);

        // If attempt was already SUBMITTED, fetch final result
        if (data.attempt.status === 'SUBMITTED') {
          const submitRes = await assessmentApi.submit(attemptId);
          setFinalResult(submitRes);
        }
      } catch (err: any) {
        console.error('Failed to initialize assessment workspace:', err);
        setError(err.response?.data?.message || 'Failed to load assessment. Attempt may be invalid.');
      } finally {
        setIsLoading(false);
      }
    };

    initWorkspace();
  }, [attemptId, navigate]);

  const currentQuestion = questions[currentIndex];

  // MCQ answer change handler
  const handleMcqSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      mcq: {
        ...prev.mcq,
        [currentQuestion.id]: optionIndex,
      },
    }));
  };

  const handleMcqClear = () => {
    if (!currentQuestion) return;
    setAnswers((prev) => {
      const updatedMcq = { ...prev.mcq };
      delete updatedMcq[currentQuestion.id];
      return { ...prev, mcq: updatedMcq };
    });
  };

  // Coding answer change handler
  const handleCodeChange = (newCode: string) => {
    if (!currentQuestion) return;
    const currentLang = answers.code[currentQuestion.id]?.language || 'javascript';
    setAnswers((prev) => ({
      ...prev,
      code: {
        ...prev.code,
        [currentQuestion.id]: {
          code: newCode,
          language: currentLang,
        },
      },
    }));
  };

  const handleLanguageChange = (newLang: string) => {
    if (!currentQuestion) return;
    const starter =
      currentQuestion.starterCode?.[newLang] ||
      (newLang === 'python' ? '# Write solution here\n' : '// Write solution here\n');

    setAnswers((prev) => ({
      ...prev,
      code: {
        ...prev.code,
        [currentQuestion.id]: {
          code: starter,
          language: newLang,
        },
      },
    }));
  };

  const handleResetCode = () => {
    if (!currentQuestion) return;
    const currentLang = answers.code[currentQuestion.id]?.language || 'javascript';
    const starter =
      currentQuestion.starterCode?.[currentLang] ||
      (currentLang === 'python' ? '# Write solution here\n' : '// Write solution here\n');

    setAnswers((prev) => ({
      ...prev,
      code: {
        ...prev.code,
        [currentQuestion.id]: {
          code: starter,
          language: currentLang,
        },
      },
    }));
  };

  // Run visible test cases
  const handleRunCode = async () => {
    if (!currentQuestion || !attemptId) return;
    const codeEntry = answers.code[currentQuestion.id];
    if (!codeEntry) return;

    try {
      setIsRunningCode(true);
      const res = await assessmentApi.runCode(
        attemptId,
        currentQuestion.id,
        codeEntry.code,
        codeEntry.language
      );
      setCodeTestResults((prev) => ({
        ...prev,
        [currentQuestion.id]: res.results,
      }));
    } catch (err: any) {
      console.error('Failed to run test cases:', err);
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleSelectQuestion = async (index: number) => {
    // Quick autosave when switching questions
    saveNow();
    setCurrentIndex(index);
    setShowPaletteMobile(false);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-400 text-sm">Preparing secure assessment environment...</p>
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-100">Unable to load assessment</h2>
        <p className="text-xs text-slate-400">{error || 'Session could not be recovered.'}</p>
        <button
          onClick={() => navigate('/oa')}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
        >
          Return to Assessments
        </button>
      </div>
    );
  }

  const currentCodeData = answers.code[currentQuestion.id] || {
    code: currentQuestion.starterCode?.javascript || '',
    language: 'javascript',
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex flex-col space-y-3 px-3 sm:px-6 py-3">
      {/* Top Bar: Title + Timer + Autosave + Submit */}
      <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPaletteMobile(!showPaletteMobile)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 lg:hidden hover:bg-slate-700"
          >
            {showPaletteMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
              {assessmentTitle}
            </h1>
            <p className="text-[11px] text-slate-400">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:block">
            <AutosaveIndicator
              isSaving={isSaving}
              lastSavedAt={lastSavedAt}
              saveError={saveError}
            />
          </div>

          <CountdownTimer
            formattedTime={formattedTime}
            isWarning={isWarning}
            isDanger={isDanger}
          />

          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Submit Assessment</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[580px]">
        {/* Desktop Left Sidebar: Question Palette */}
        <div className="hidden lg:block lg:col-span-3">
          <QuestionPalette
            questions={questions}
            currentIndex={currentIndex}
            answers={answers}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>

        {/* Mobile Palette Overlay */}
        {showPaletteMobile && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 p-4 pt-20">
            <QuestionPalette
              questions={questions}
              currentIndex={currentIndex}
              answers={answers}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
        )}

        {/* Question View: MCQ or Coding */}
        <div className="lg:col-span-9 flex flex-col justify-between space-y-3">
          <div className="flex-1">
            {currentQuestion.type === 'MCQ' ? (
              <McqQuestionView
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                selectedOption={answers.mcq[currentQuestion.id]}
                onSelectOption={handleMcqSelect}
                onClearOption={handleMcqClear}
              />
            ) : (
              <CodingWorkspace
                question={currentQuestion}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                code={currentCodeData.code}
                language={currentCodeData.language}
                onCodeChange={handleCodeChange}
                onLanguageChange={handleLanguageChange}
                onResetCode={handleResetCode}
                onRunCode={handleRunCode}
                isRunningCode={isRunningCode}
                testCaseResults={codeTestResults[currentQuestion.id]}
              />
            )}
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => handleSelectQuestion(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              {currentIndex + 1} / {questions.length}
            </span>

            <button
              type="button"
              onClick={() =>
                handleSelectQuestion(Math.min(questions.length - 1, currentIndex + 1))
              }
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Final Submission Result Modal */}
      {finalResult && <SubmissionResultModal result={finalResult} />}
    </div>
  );
};
