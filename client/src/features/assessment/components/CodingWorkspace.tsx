import React, { useState } from 'react';
import { QuestionData, TestCaseResult } from '../api/assessmentApi';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { TestCasesDrawer } from './TestCasesDrawer';
import { RotateCcw, Code, ChevronRight } from 'lucide-react';

interface CodingWorkspaceProps {
  question: QuestionData;
  questionNumber: number;
  totalQuestions: number;
  code: string;
  language: string;
  onCodeChange: (newCode: string) => void;
  onLanguageChange: (newLang: string) => void;
  onResetCode: () => void;
  onRunCode: () => Promise<void>;
  isRunningCode: boolean;
  testCaseResults?: TestCaseResult[];
}

export const CodingWorkspace: React.FC<CodingWorkspaceProps> = ({
  question,
  questionNumber,
  totalQuestions,
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onResetCode,
  onRunCode,
  isRunningCode,
  testCaseResults,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'tests'>('prompt');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      {/* Left Column: Problem Prompt & Description */}
      <div className="lg:col-span-5 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[450px] lg:h-[calc(100vh-210px)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              Coding Challenge
            </span>
            <span className="text-xs text-slate-400">
              Q{questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {question.points} Points
          </span>
        </div>

        {/* Tab switch for small screens */}
        <div className="flex border-b border-slate-800 lg:hidden">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-2 text-xs font-medium ${
              activeTab === 'prompt' ? 'bg-slate-800 text-slate-200' : 'text-slate-400'
            }`}
          >
            Problem Description
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 py-2 text-xs font-medium ${
              activeTab === 'tests' ? 'bg-slate-800 text-slate-200' : 'text-slate-400'
            }`}
          >
            Test Cases ({question.visibleTestCases?.length || 0})
          </button>
        </div>

        {/* Prompt Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400 shrink-0" />
            {question.title}
          </h2>

          <div className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
            {question.prompt}
          </div>

          {/* Visible Test Case Previews */}
          {question.visibleTestCases && question.visibleTestCases.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                Example Test Cases
              </h4>
              <div className="space-y-2">
                {question.visibleTestCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-1"
                  >
                    <div className="text-slate-400 text-[11px] font-sans font-medium">
                      Example {idx + 1}: {tc.description}
                    </div>
                    <div>
                      <span className="text-slate-500">Input: </span>
                      <span className="text-slate-200">{tc.input}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Expected: </span>
                      <span className="text-emerald-400">{tc.expectedOutput}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Code Editor & Runner */}
      <div className="lg:col-span-7 flex flex-col space-y-3 h-[600px] lg:h-[calc(100vh-210px)]">
        {/* Editor Controls Bar */}
        <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium">Language:</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
            >
              <option value="javascript">JavaScript (ES2022)</option>
              <option value="python">Python 3</option>
              <option value="java">Java (OpenJDK 17)</option>
              <option value="cpp">C++ (GCC 11)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onResetCode}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
            title="Reset code to original starter template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 min-h-[260px] rounded-xl overflow-hidden border border-slate-800">
          <CodeEditor
            language={language}
            value={code}
            onChange={(val) => onCodeChange(val || '')}
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
        {question.visibleTestCases && question.visibleTestCases.length > 0 && (
          <div className="shrink-0 max-h-[220px] overflow-y-auto">
            <TestCasesDrawer
              testCases={question.visibleTestCases}
              results={testCaseResults}
              isRunning={isRunningCode}
              onRunTestCases={onRunCode}
            />
          </div>
        )}
      </div>
    </div>
  );
};
