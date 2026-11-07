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
    <div className="bg-[#1A0C09]/90 border border-[#3E1D19] rounded-3xl overflow-hidden flex flex-col shadow-sm text-[#F5E8DD]">
      {/* Top Header / Action Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#140705] border-b border-[#3E1D19]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#F0B87A]" />
          <span className="text-xs font-semibold text-[#F5E8DD]">Test Cases &amp; Output</span>
          {results && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                results.every((r) => r.passed)
                  ? 'bg-[#152B1E] text-emerald-300 border border-[#255436]'
                  : 'bg-[#2E100D] text-red-300 border border-red-800'
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
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] text-xs font-bold shadow-[0_0_15px_rgba(240,184,122,0.3)] transition disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#140808]" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-[#140808]" />
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs for each test case */}
      <div className="flex border-b border-[#3E1D19] px-4 pt-2 gap-2 bg-[#160907] overflow-x-auto">
        {testCases.map((tc, idx) => {
          const res = results?.find((r) => r.testCaseId === tc.id);
          const isSelected = activeTab === idx;

          return (
            <button
              key={tc.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${
                isSelected
                  ? 'border-[#F0B87A] text-[#F0B87A] bg-[#24110E]'
                  : 'border-transparent text-[#856658] hover:text-[#F5E8DD]'
              }`}
            >
              {res && (
                <span>
                  {res.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                </span>
              )}
              <span>Case {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Active test case content */}
      {activeTestCase && (
        <div className="p-4 space-y-3 bg-[#140705] text-xs font-mono">
          <div>
            <span className="text-[#856658] block mb-1">Input Arguments:</span>
            <pre className="p-2.5 rounded-xl bg-[#0D0403] border border-[#3E1D19] text-[#F5E8DD] overflow-x-auto">
              {activeTestCase.input}
            </pre>
          </div>

          <div>
            <span className="text-[#856658] block mb-1">Expected Output:</span>
            <pre className="p-2.5 rounded-xl bg-[#0D0403] border border-[#3E1D19] text-emerald-400 overflow-x-auto">
              {activeTestCase.expectedOutput}
            </pre>
          </div>

          {activeResult && (
            <div className="pt-2 border-t border-[#3E1D19] space-y-2">
              <div>
                <span className="text-[#856658] block mb-1">Actual Sandbox Output:</span>
                <pre
                  className={`p-2.5 rounded-xl border overflow-x-auto ${
                    activeResult.passed
                      ? 'bg-[#152B1E]/40 border-[#255436] text-emerald-300'
                      : 'bg-[#2E100D]/40 border-red-900 text-red-300'
                  }`}
                >
                  {activeResult.actualOutput || '(Empty output)'}
                </pre>
              </div>

              {activeResult.error && (
                <div>
                  <span className="text-red-400 block mb-1">Execution Error:</span>
                  <pre className="p-2.5 rounded-xl bg-[#2E100D] border border-red-800 text-red-300 overflow-x-auto">
                    {activeResult.error}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
