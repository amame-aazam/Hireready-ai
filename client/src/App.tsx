import React from 'react';
import { BrowserRouter, Link, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppRoutes } from './routes';
import { ColdStartBanner } from './components/common/ColdStartBanner';
import { useAuth } from './features/auth/hooks/useAuth';
import { Sparkles, LayoutDashboard, Award, LogOut, User as UserIcon } from 'lucide-react';

const HeaderNav: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-white tracking-tight">
          <span className="p-1 rounded bg-indigo-600 text-white">
            <Sparkles className="w-4 h-4" />
          </span>
          HireReady <span className="text-indigo-400">AI</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link to="/dashboard" className="hover:text-white flex items-center gap-1.5 transition">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/leaderboard" className="hover:text-white flex items-center gap-1.5 transition">
            <Award className="w-4 h-4" /> Leaderboard
          </Link>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                {user.firstName} {user.lastName} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="text-xs text-slate-300 hover:text-white font-medium px-2.5 py-1.5 transition"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
          <ColdStartBanner />
          <HeaderNav />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
            HireReady AI &mdash; Dual-DB Architecture (PostgreSQL + MongoDB Atlas) &bull; Free-Tier Optimized
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
