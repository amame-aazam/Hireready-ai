import React from 'react';
import { BrowserRouter, Link, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppRoutes } from './routes';
import { ColdStartBanner } from './components/common/ColdStartBanner';
import { useAuth } from './features/auth/hooks/useAuth';
import { BrandLogo } from './components/common/BrandLogo';
import { LayoutDashboard, Award, ShieldAlert, LogOut, User as UserIcon } from 'lucide-react';

const HeaderNav: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-95 transition">
          <BrandLogo size="md" />
        </Link>

        <nav className="flex items-center gap-4 text-xs font-semibold text-slate-300">
          <Link to="/dashboard" className="hover:text-white flex items-center gap-1.5 transition">
            <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
          </Link>
          <Link to="/leaderboard" className="hover:text-white flex items-center gap-1.5 transition">
            <Award className="w-4 h-4 text-slate-400" /> Leaderboard
          </Link>

          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link to="/admin" className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 font-bold transition">
              <ShieldAlert className="w-4 h-4" /> Admin Console
            </Link>
          )}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
                <UserIcon className="w-3.5 h-3.5 text-crimson-400" />
                <span>{user.firstName} {user.lastName}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                  {user.role}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-crimson-400 flex items-center gap-1 transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth/login"
                className="text-xs text-slate-300 hover:text-white font-medium px-3 py-1.5 transition"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-3.5 py-1.5 rounded-xl bg-crimson-600 hover:bg-crimson-500 text-white font-bold text-xs transition shadow-crimson-sm hover:shadow-crimson-glow"
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
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
          <ColdStartBanner />
          <HeaderNav />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-slate-950">
            HireReady AI &mdash; Premium Intelligent Recruitment Architecture &bull; Dual-DB (Neon Postgres + MongoDB Atlas)
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
