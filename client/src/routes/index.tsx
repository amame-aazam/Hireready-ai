import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { ResumePage } from '../features/resume/pages/ResumePage';
import { OALandingPage } from '../features/assessment/pages/OALandingPage';
import { OAWorkspacePage } from '../features/assessment/pages/OAWorkspacePage';
import { DSAInterviewPage } from '../features/interview/pages/DSAInterviewPage';
import { HRInterviewPage } from '../features/interview/pages/HRInterviewPage';
import { ResumeDefensePage } from '../features/interview/pages/ResumeDefensePage';
import { StudentDashboardPage } from '../features/dashboard/pages/StudentDashboardPage';
import { LeaderboardPage } from '../features/leaderboard/pages/LeaderboardPage';
import { AdminPage } from '../features/admin/pages/AdminPage';
import { LandingPage } from '../pages/LandingPage';

const PlaceholderPage: React.FC<{ title: string; category: string }> = ({ title, category }) => (
  <div className="max-w-2xl mx-auto px-6 py-20 text-center space-y-4">
    <div className="text-xs font-semibold uppercase tracking-wider text-[#A83E14] bg-[#FFEBE1] px-3 py-1 rounded-full w-fit mx-auto border border-[#FFD0BC]">
      {category}
    </div>
    <h2 className="text-2xl font-serif text-[#0A0706]">{title}</h2>
    <p className="text-sm text-[#6B544A]">
      The requested page could not be located or is under maintenance.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-1.5 text-xs text-[#FF7A48] hover:underline font-semibold"
    >
      &larr; Back to HireReady Home
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
            <StudentDashboardPage />
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
      <Route
        path="/oa"
        element={
          <ProtectedRoute>
            <OALandingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/oa/:attemptId"
        element={
          <ProtectedRoute>
            <OAWorkspacePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/dsa"
        element={
          <ProtectedRoute>
            <DSAInterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/dsa/:sessionId"
        element={
          <ProtectedRoute>
            <DSAInterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/hr"
        element={
          <ProtectedRoute>
            <HRInterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/hr/:sessionId"
        element={
          <ProtectedRoute>
            <HRInterviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/resume-defense"
        element={
          <ProtectedRoute>
            <ResumeDefensePage />
          </ProtectedRoute>
        }
      />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<PlaceholderPage title="Page Not Found" category="404" />} />
    </Routes>
  );
};
