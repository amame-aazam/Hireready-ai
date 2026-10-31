import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { CodeEditor } from '../components/ui/CodeEditor';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { ResumePage } from '../features/resume/pages/ResumePage';
import {
  FileText,
  Terminal,
  Mic,
  Award,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" /> Next-Gen AI Interview Prep Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
          HireReady AI
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
          Master your technical and behavioral interviews with real-time turn-based AI voice dialogue, automated ATS scoring, and timed coding assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: 'AI Resume & ATS Checker',
            desc: 'Instant keyword analysis and actionable scoring tailored for target roles.',
            path: '/resume',
            icon: FileText,
            color: 'text-blue-400',
          },
          {
            title: 'Online Assessment (OA)',
            desc: 'MCQ questions combined with browser-based Monaco coding challenges.',
            path: '/oa',
            icon: Terminal,
            color: 'text-emerald-400',
          },
          {
            title: 'AI DSA Technical Round',
            desc: 'Voice-based algorithm and system design interviews powered by DeepSeek.',
            path: '/interview/dsa',
            icon: Mic,
            color: 'text-indigo-400',
          },
          {
            title: 'AI HR Behavioral Round',
            desc: 'Situational and leadership STAR-method evaluation with speech feedback.',
            path: '/interview/hr',
            icon: Mic,
            color: 'text-amber-400',
          },
          {
            title: 'Leaderboard & Analytics',
            desc: 'Track percentiles, domain benchmarks, and detailed rubric reports.',
            path: '/leaderboard',
            icon: Award,
            color: 'text-rose-400',
          },
          {
            title: 'Admin Console',
            desc: 'Review candidate attempt pipelines, questions pool, and rubric thresholds.',
            path: '/admin',
            icon: ShieldAlert,
            color: 'text-purple-400',
          },
        ].map((feat) => {
          const Icon = feat.icon;
          return (
            <Link
              key={feat.path}
              to={feat.path}
              className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 hover:border-indigo-500/50 hover:bg-slate-800 transition duration-150 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className={`p-2.5 rounded-lg bg-slate-900/60 w-fit ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-200 group-hover:text-white flex items-center justify-between">
                  {feat.title}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" /> Monaco Editor Integration Verification
        </h3>
        <div className="h-48">
          <CodeEditor
            language="typescript"
            value={`// Monaco Editor verification\nfunction calculateScore(mcqScore: number, codingScore: number): number {\n  return Math.round((mcqScore * 0.4) + (codingScore * 0.6));\n}\n\nconsole.log('OA Score:', calculateScore(90, 85));`}
          />
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage: React.FC<{ title: string; category: string }> = ({ title, category }) => (
  <div className="max-w-2xl mx-auto px-6 py-16 text-center space-y-4">
    <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400">{category}</div>
    <h2 className="text-2xl font-bold text-white">{title}</h2>
    <p className="text-sm text-slate-400">
      This module is scheduled for implementation in Phase 3. Architecture contracts, databases, and adapters are initialized.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
    >
      &larr; Back to Platform Home
    </Link>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Student Dashboard" category="Overview" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute>
            <ResumePage />
          </ProtectedRoute>
        }
      />
      <Route path="/oa" element={<PlaceholderPage title="Online Assessment (MCQ + Code)" category="Round 1 Screening" />} />
      <Route path="/interview/dsa" element={<PlaceholderPage title="AI DSA Technical Interview" category="Round 2 Interview" />} />
      <Route path="/interview/hr" element={<PlaceholderPage title="AI HR Behavioral Interview" category="Round 3 Interview" />} />
      <Route path="/leaderboard" element={<PlaceholderPage title="Scoring & Leaderboard" category="Analytics" />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PlaceholderPage title="Admin Console" category="Administration" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<PlaceholderPage title="Page Not Found" category="404" />} />
    </Routes>
  );
};
