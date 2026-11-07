import React, { useState } from 'react';
import { VisibleTestCase, TestCaseResult } from '../api/assessmentApi';
import { CheckCircle2, XCircle, Terminal, Play, Loader2 } from 'lucide-react';

interface TestCasesDrawerProps {
  testCases: VisibleTestCase[];
  results?: TestCaseResult[];
  isRunning: boolean;
  onRunTestCases: () => void;
}

export const TestCasesDrawer: React.FC<TestCasesDrawerProps> = ({
  testCases,
  results,
  isRunning,
  onRunTestCases,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const activeTestCase = testCases[activeTab];
  const activeResult = results?.find((r) => r.testCaseId === activeTestCase?.id);

  return (
    <div className="bg-white border border-[#F2DDD2] rounded-3xl overflow-hidden flex flex-col shadow-sm">
      {/* Top Header / Action Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#FFFAF7] border-b border-[#F2DDD2]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#8C7268]" />
          <span className="text-xs font-semibold text-[#0A0706]">Test Cases &amp; Output</span>
          {results && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                results.every((r) => r.passed)
                  ? 'bg-[#E6F4EA] text-[#1F7A3A] border border-[#B7E1CD]'
                  : 'bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]'
              }`}
            >
              {results.filter((r) => r.passed).length}/{results.length} Passed
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onRunTestCases}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF7A48]" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-[#FF7A48]" />
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 pt-2.5 bg-[#FFFAF7] border-b border-[#F2DDD2] overflow-x-auto">
        {testCases.map((tc, idx) => {
          const res = results?.find((r) => r.testCaseId === tc.id);
          const isSelected = activeTab === idx;

          return (
            <button
              key={tc.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-t-xl text-xs font-semibold transition border-t border-x ${
                isSelected
                  ? 'bg-white border-[#F2DDD2] text-[#0A0706]'
                  : 'bg-transparent border-transparent text-[#8C7268] hover:text-[#0A0706]'
              }`}
            >
              {res ? (
                res.passed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3A]" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-[#9B1C1C]" />
                )
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-[#8C7268]" />
              )}
              <span>Case {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {activeTestCase && (
        <div className="p-4 space-y-3 text-xs bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C7268] block">Input</span>
              <pre className="mt-1 p-2.5 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl font-mono text-xs text-[#0A0706] overflow-x-auto">
                {activeTestCase.input}
              </pre>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C7268] block">Expected Output</span>
              <pre className="mt-1 p-2.5 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl font-mono text-xs text-[#0A0706] overflow-x-auto">
                {activeTestCase.expectedOutput}
              </pre>
            </div>
          </div>

          {activeResult && (
            <div className="pt-2 border-t border-[#F2DDD2]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8C7268]">Actual Output</span>
                <span
                  className={`text-[10px] font-bold ${
                    activeResult.passed ? 'text-[#1F7A3A]' : 'text-[#9B1C1C]'
                  }`}
                >
                  {activeResult.passed ? 'PASSED' : 'FAILED'} ({activeResult.executionTimeMs}ms)
                </span>
              </div>
              <pre
                className={`mt-1 p-2.5 rounded-xl font-mono text-xs overflow-x-auto border ${
                  activeResult.passed
                    ? 'bg-[#E6F4EA]/40 border-[#B7E1CD] text-[#1F7A3A]'
                    : 'bg-[#FDE8E8]/40 border-[#F8B4B4] text-[#9B1C1C]'
                }`}
              >
                {activeResult.actualOutput || activeResult.stderr || '(no output)'}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default TestCasesDrawer;
