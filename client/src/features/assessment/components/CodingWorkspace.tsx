import React, { useState } from 'react';
import { QuestionData, TestCaseResult } from '../api/assessmentApi';
import { CodeEditor } from '../../../components/ui/CodeEditor';
import { TestCasesDrawer } from './TestCasesDrawer';
import { RotateCcw, Code } from 'lucide-react';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full text-[#F5E8DD]">
      {/* Left Column: Problem Prompt & Description */}
      <div className="lg:col-span-5 flex flex-col bg-[#1A0C09]/90 border border-[#3E1D19] rounded-3xl overflow-hidden shadow-sm h-[450px] lg:h-[calc(100vh-210px)] backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#140705] border-b border-[#3E1D19] shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-[#2D1A10] text-[#F0B87A] border border-[#522E22] text-xs font-semibold">
              Coding Challenge
            </span>
            <span className="text-xs text-[#A88879]">
              Q{questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#1A0C09] border border-[#3E1D19] text-[#F0B87A]">
            {question.points} Points
          </span>
        </div>

        {/* Tab switch for small screens */}
        <div className="flex border-b border-[#3E1D19] lg:hidden">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-2 text-xs font-semibold ${
              activeTab === 'prompt' ? 'bg-[#24110E] text-[#F0B87A]' : 'text-[#856658]'
            }`}
          >
            Problem Description
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 py-2 text-xs font-semibold ${
              activeTab === 'tests' ? 'bg-[#24110E] text-[#F0B87A]' : 'text-[#856658]'
            }`}
          >
            Visible Test Cases
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className={`${activeTab === 'tests' ? 'hidden lg:block' : ''} space-y-3`}>
            <h2 className="text-lg font-serif font-medium text-[#F5E8DD]">{question.title}</h2>
            <div className="p-4 rounded-2xl bg-[#140705] border border-[#3E1D19] text-xs text-[#F5E8DD] leading-relaxed whitespace-pre-wrap font-sans">
              {question.prompt}
            </div>
          </div>

          {/* Test cases drawer in left column on desktop */}
          <div className={`${activeTab === 'prompt' ? 'hidden lg:block' : ''} pt-2`}>
            {question.visibleTestCases && question.visibleTestCases.length > 0 ? (
              <TestCasesDrawer
                testCases={question.visibleTestCases}
                results={testCaseResults}
                isRunning={isRunningCode}
                onRunTestCases={onRunCode}
              />
            ) : (
              <div className="text-xs text-[#856658] italic p-4 text-center">
                No sample test cases provided for this question.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Monaco Code Editor */}
      <div className="lg:col-span-7 flex flex-col bg-[#1A0C09]/90 border border-[#3E1D19] rounded-3xl overflow-hidden shadow-sm h-[500px] lg:h-[calc(100vh-210px)] backdrop-blur-md">
        {/* Editor Controls Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#140705] border-b border-[#3E1D19] shrink-0">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#F0B87A]" />
            <span className="text-xs font-semibold text-[#F5E8DD]">Code Solution</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-[#140705] border border-[#3E1D19] rounded-xl px-2.5 py-1 text-xs text-[#F5E8DD] font-medium focus:outline-none focus:border-[#F0B87A]"
            >
              <option value="javascript">JavaScript (Node)</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python 3</option>
            </select>

            <button
              type="button"
              onClick={onResetCode}
              className="p-1.5 text-[#856658] hover:text-[#F0B87A] hover:bg-[#24110E] rounded-lg transition"
              title="Reset code template"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Monaco Editor Container */}
        <div className="flex-1 w-full relative">
          <CodeEditor
            value={code}
            onChange={(val) => onCodeChange(val || '')}
            language={language}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};
export default CodingWorkspace;