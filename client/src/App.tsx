import React from 'react';
import { BrowserRouter, Link, useLocation, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppRoutes } from './routes';
import { ColdStartBanner } from './components/common/ColdStartBanner';
import { useAuth } from './features/auth/hooks/useAuth';
import { BrandLogo } from './components/common/BrandLogo';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSwitcher } from './components/common/ThemeSwitcher';
import {
  HelpCircle,
  Bell,
  Shield,
  ShieldAlert,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

const HeaderNav: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navLinks = [
    { path: isAuthenticated ? '/dashboard' : '/', label: 'Home' },
    { path: '/interview/dsa', label: 'Interview' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/oa', label: 'Assessment' },
    { path: '/resume', label: 'Resume' },
  ];

  return (
    <header className="sticky top-0 z-50 px-4 pt-3 pb-2 pointer-events-none">
      <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 rounded-full bg-[#180A08]/90 border border-[#3E1D19] backdrop-blur-md shadow-2xl flex items-center justify-between pointer-events-auto">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <BrandLogo size="md" />
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-1.5 rounded-full text-sm transition ${
                  isActive
                    ? 'bg-[#331713] text-[#F5E8DD] border border-[#52251D] shadow-inner font-semibold'
                    : 'text-[#A88879] hover:text-[#F5E8DD] hover:bg-[#24110E]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={`px-3.5 py-1.5 rounded-full text-sm transition flex items-center gap-1.5 ${
                location.pathname.startsWith('/admin')
                  ? 'bg-[#331713] text-[var(--theme-accent,#FF9E79)] border border-[#52251D] font-semibold'
                  : 'text-[var(--theme-accent,#FF9E79)] hover:bg-[#24110E]'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Right Actions from reference */}
        <div className="flex items-center gap-2.5">
          {/* Help button */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-1 text-sm text-[#A88879] hover:text-[#F5E8DD] transition p-1.5"
            title="Help & FAQ"
          >
            <HelpCircle className="w-4 h-4 text-[#A88879]" />
            <span className="hidden lg:inline">Help</span>
          </button>

          {/* Bell with counter */}
          <div className="relative">
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-[#24110E] border border-[#3E1D19] flex items-center justify-center text-[#A88879] hover:text-[#F5E8DD] transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--theme-accent,#FF9E79)] text-[#140808] font-bold text-[10px] flex items-center justify-center">
              1
            </span>
          </div>

          {/* 1 free interview chip from reference */}
          <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--theme-accent-bg,#2D140C)] border border-[var(--theme-accent-border,#5E2717)] text-xs text-[var(--theme-accent,#FF9E79)] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--theme-accent,#FF9E79)] animate-pulse" />
            <span>1 free interview</span>
            <Shield className="w-4 h-4 ml-0.5 fill-[var(--theme-accent,#FF9E79)]/30 text-[var(--theme-accent,#FF9E79)]" />
          </div>

          {/* Theme Switcher Button (Palette Icon from Reference Screenshot) */}
          <ThemeSwitcher />

          {/* User profile / Auth button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#3E1D19]">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#F5E8DD] bg-[#24110E] px-3.5 py-1.5 rounded-full border border-[#3E1D19] hover:border-[#52251E] transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-[var(--theme-accent,#FF9E79)]" />
                <span className="max-w-[100px] truncate">{user.firstName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full text-[#A88879] hover:text-[var(--theme-accent,#FF9E79)] hover:bg-[#24110E] transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[var(--theme-accent,#FF9E79)] to-[var(--theme-accent-dark,#E87A50)] hover:from-[var(--theme-accent-hover,#FFAE8F)] hover:to-[var(--theme-accent,#FF9E79)] text-[#140808] font-bold text-sm transition shadow-sm"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[var(--theme-bg-canvas,#0C0403)] text-[#F5E8DD] relative">
            {/* Background Engineering Perspective Grid & Ambient Glow (Matching Reference Screenshot) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              {/* Perspective Graph Grid */}
              <div className="absolute inset-0 bg-engineering-grid pointer-events-none opacity-90" />
              {/* Top Hero Ambient Radial Glow */}
              <div
                className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] rounded-full pointer-events-none blur-3xl opacity-50"
                style={{ background: 'var(--theme-glow-radial)' }}
              />
            </div>

            {/* Main Application Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <ColdStartBanner />
              <HeaderNav />
              <main className="flex-1">
                <AppRoutes />
              </main>
              <footer className="border-t border-[#3E1D19]/80 py-8 text-center text-sm text-[#A88879] bg-[var(--theme-bg-canvas,#0C0403)]/90 mt-12 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <BrandLogo size="sm" />
                    <span className="text-[#856658]">&mdash; AI Placement &amp; Interview Cockpit</span>
                  </div>
                  <div className="flex items-center gap-4 text-[#856658] text-xs sm:text-sm">
                    <span>Dual-DB (PostgreSQL &bull; MongoDB)</span>
                    <span>&bull;</span>
                    <Link to="/leaderboard" className="hover:text-[#F5E8DD] transition">Leaderboard</Link>
                    <span>&bull;</span>
                    <Link to="/interview/dsa" className="hover:text-[#F5E8DD] transition">AI Panel</Link>
                    <span>&bull;</span>
                    <Link to="/oa" className="hover:text-[#F5E8DD] transition">OA Sandbox</Link>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
