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
    <header className="border-b border-[#F2DDD2] bg-[#FFFAF7]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <BrandLogo size="md" />
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-[#6B544A]">
          <Link
            to="/dashboard"
            className="hover:text-[#0A0706] flex items-center gap-1.5 transition"
          >
            <LayoutDashboard className="w-4 h-4 text-[#8C7268]" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/leaderboard"
            className="hover:text-[#0A0706] flex items-center gap-1.5 transition"
          >
            <Award className="w-4 h-4 text-[#8C7268]" />
            <span>Leaderboard</span>
          </Link>

          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="text-[#FF7A48] hover:text-[#E05928] flex items-center gap-1.5 font-semibold transition"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-[#F2DDD2]">
              <span className="text-xs text-[#0A0706] flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#F2DDD2] shadow-sm">
                <UserIcon className="w-3.5 h-3.5 text-[#FF7A48]" />
                <span className="font-semibold">{user.firstName} {user.lastName}</span>
                <span className="text-[10px] uppercase font-bold text-[#A83E14] bg-[#FFEBE1] px-1.5 py-0.5 rounded">
                  {user.role}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-[#8C7268] hover:text-[#0A0706] p-1.5 rounded-lg hover:bg-[#F2DDD2]/40 transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-2">
              <Link
                to="/auth/login"
                className="text-sm text-[#0A0706] hover:text-[#FF7A48] font-medium px-2 py-1.5 transition"
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-white font-medium text-xs transition shadow-sm"
              >
                Get Started
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
        <div className="min-h-screen flex flex-col bg-[#FFFAF7] text-[#0A0706]">
          <ColdStartBanner />
          <HeaderNav />
          <main className="flex-1">
            <AppRoutes />
          </main>
          <footer className="border-t border-[#F2DDD2] py-8 text-center text-xs text-[#8C7268] bg-[#FFFAF7]">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" />
                <span className="text-[#6B544A]">&mdash; AI Placement & Interview Preparation</span>
              </div>
              <div className="flex items-center gap-4 text-[#8C7268]">
                <span>Dual-DB (PostgreSQL &bull; MongoDB)</span>
                <span>&bull;</span>
                <Link to="/leaderboard" className="hover:text-[#0A0706] transition">Leaderboard</Link>
                <span>&bull;</span>
                <Link to="/oa" className="hover:text-[#0A0706] transition">Assessment</Link>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
