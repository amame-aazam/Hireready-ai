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
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Top Header / Action Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Test Cases & Output</span>
          {results && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                results.every((r) => r.passed)
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
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
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Code</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-slate-950/50 border-b border-slate-800/80 overflow-x-auto">
        {testCases.map((tc, idx) => {
          const res = results?.find((r) => r.testCaseId === tc.id);
          const isSelected = activeTab === idx;

          return (
            <button
              key={tc.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-xs font-medium border-b-2 transition ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 text-slate-200'
                  : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-900/40'
              }`}
            >
              {res && (
                res.passed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <XCircle className="w-3 h-3 text-rose-400" />
                )
              )}
              <span>Case {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Test Case Content */}
      {activeTestCase && (
        <div className="p-4 space-y-3 text-xs font-mono">
          {activeTestCase.description && (
            <p className="text-slate-400 text-xs font-sans pb-1">{activeTestCase.description}</p>
          )}

          <div>
            <span className="text-slate-500 block mb-1 uppercase text-[10px] tracking-wider font-sans">
              Input:
            </span>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-300 overflow-x-auto">
              {activeTestCase.input}
            </div>
          </div>

          <div>
            <span className="text-slate-500 block mb-1 uppercase text-[10px] tracking-wider font-sans">
              Expected Output:
            </span>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 overflow-x-auto">
              {activeTestCase.expectedOutput}
            </div>
          </div>

          {activeResult && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-500 uppercase text-[10px] tracking-wider font-sans">
                  Actual Output:
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  {activeResult.executionTimeMs}ms • {(activeResult.memoryKb / 1024).toFixed(1)}MB
                </span>
              </div>
              <div
                className={`p-2.5 rounded border overflow-x-auto ${
                  activeResult.passed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                }`}
              >
                {activeResult.actualOutput}
              </div>

              {activeResult.stderr && (
                <div className="mt-2 p-2 rounded bg-rose-950/30 border border-rose-800 text-rose-400 text-[11px]">
                  {activeResult.stderr}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
