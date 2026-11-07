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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      {/* Left Column: Problem Prompt & Description */}
      <div className="lg:col-span-5 flex flex-col bg-white border border-[#F2DDD2] rounded-3xl overflow-hidden shadow-sm h-[450px] lg:h-[calc(100vh-210px)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#FFFAF7] border-b border-[#F2DDD2] shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC] text-xs font-semibold">
              Coding Challenge
            </span>
            <span className="text-xs text-[#6B544A]">
              Q{questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-[#F2DDD2] text-[#0A0706]">
            {question.points} Points
          </span>
        </div>

        {/* Tab switch for small screens */}
        <div className="flex border-b border-[#F2DDD2] lg:hidden">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex-1 py-2 text-xs font-semibold ${
              activeTab === 'prompt' ? 'bg-[#FFFAF7] text-[#0A0706]' : 'text-[#8C7268]'
            }`}
          >
            Problem Description
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 py-2 text-xs font-semibold ${
              activeTab === 'tests' ? 'bg-[#FFFAF7] text-[#0A0706]' : 'text-[#8C7268]'
            }`}
          >
            Visible Test Cases
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className={`${activeTab === 'tests' ? 'hidden lg:block' : ''} space-y-3`}>
            <h2 className="text-lg font-serif font-medium text-[#0A0706]">{question.title}</h2>
            <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-xs text-[#0A0706] leading-relaxed whitespace-pre-wrap font-sans">
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
              <div className="text-xs text-[#8C7268] italic p-4 text-center">
                No sample test cases provided for this question.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Monaco Code Editor */}
      <div className="lg:col-span-7 flex flex-col bg-white border border-[#F2DDD2] rounded-3xl overflow-hidden shadow-sm h-[500px] lg:h-[calc(100vh-210px)]">
        {/* Editor Controls Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#FFFAF7] border-b border-[#F2DDD2] shrink-0">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#FF7A48]" />
            <span className="text-xs font-semibold text-[#0A0706]">Code Solution</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-white border border-[#F2DDD2] rounded-xl px-2.5 py-1 text-xs text-[#0A0706] font-medium focus:outline-none focus:border-[#FF7A48]"
            >
              <option value="javascript">JavaScript (Node)</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python 3</option>
            </select>

            <button
              type="button"
              onClick={onResetCode}
              className="p-1.5 text-[#8C7268] hover:text-[#A83E14] hover:bg-[#FFEBE1] rounded-lg transition"
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
