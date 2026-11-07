import React, { useState, useEffect } from 'react';
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
  ShieldAlert,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const HeaderNav: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navLinks = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Home' },
        { path: '/interview/dsa', label: 'Interview' },
        { path: '/leaderboard', label: 'Leaderboard' },
        { path: '/oa', label: 'Assessment' },
        { path: '/resume', label: 'Resume' },
      ]
    : [
        { path: '/#how-it-works', label: 'How it works' },
        { path: '/#panel', label: 'Why it feels real' },
        { path: '/#pipeline', label: 'Placement Pipeline' },
      ];

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 pt-3 pb-2 pointer-events-none">
      <div className="max-w-6xl mx-auto h-16 px-3 sm:px-6 rounded-full bg-[#180A08]/90 border border-[#3E1D19] backdrop-blur-md shadow-2xl flex items-center justify-between pointer-events-auto relative">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition shrink-0">
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Center Navigation Links */}
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

        {/* Right Actions: Theme Switcher, Auth & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Switcher Button (Palette Icon) */}
          <ThemeSwitcher />

          {/* User profile / Auth button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#3E1D19]">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#F5E8DD] bg-[#24110E] px-3 sm:px-3.5 py-1.5 rounded-full border border-[#3E1D19] hover:border-[#52251E] transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-[var(--theme-accent,#FF9E79)]" />
                <span className="max-w-[70px] sm:max-w-[100px] truncate">{user.firstName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full text-[#A88879] hover:text-[var(--theme-accent,#FF9E79)] hover:bg-[#24110E] transition hidden sm:inline-flex"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="px-3.5 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[var(--theme-accent,#FF9E79)] to-[var(--theme-accent-dark,#E87A50)] hover:from-[var(--theme-accent-hover,#FFAE8F)] hover:to-[var(--theme-accent,#FF9E79)] text-[#140808] font-bold text-xs sm:text-sm transition shadow-sm shrink-0"
            >
              Sign in
            </Link>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-[#24110E] border border-[#3E1D19] flex items-center justify-center text-[#A88879] hover:text-[#F5E8DD] transition shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[var(--theme-accent,#FF9E79)]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto rounded-3xl bg-[#160806]/98 border border-[#3E1D19] backdrop-blur-2xl shadow-2xl p-3 sm:p-4 pointer-events-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-base transition ${
                    isActive
                      ? 'bg-[#331713] text-[#F5E8DD] font-semibold border border-[#52251D]'
                      : 'text-[#A88879] hover:text-[#F5E8DD] hover:bg-[#24110E]'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#856658]" />
                </Link>
              );
            })}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-base font-semibold text-[var(--theme-accent,#FF9E79)] bg-[#331713]/60 border border-[#52251D] hover:bg-[#331713] transition"
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Console</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--theme-accent,#FF9E79)]" />
              </Link>
            )}

            {/* Mobile Actions in Drawer */}
            {isAuthenticated && (
              <div className="pt-3 mt-2 border-t border-[#3E1D19] flex items-center justify-end text-xs text-[#A88879]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#24110E] hover:text-red-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[var(--theme-bg-canvas,#0C0403)] text-[#F5E8DD] relative overflow-x-hidden max-w-full">
            {/* Background Engineering Perspective Grid & Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute inset-0 bg-engineering-grid pointer-events-none opacity-90" />
              <div
                className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[350px] sm:h-[550px] rounded-full pointer-events-none blur-3xl opacity-50"
                style={{ background: 'var(--theme-glow-radial)' }}
              />
            </div>

            {/* Main Application Content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <ColdStartBanner />
              <HeaderNav />
              <main className="flex-1 w-full max-w-full overflow-x-hidden">
                <AppRoutes />
              </main>
              <footer className="border-t border-[#3E1D19]/80 py-8 text-center text-sm text-[#A88879] bg-[var(--theme-bg-canvas,#0C0403)]/90 mt-12 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <BrandLogo size="sm" />
                    <span className="text-[#856658] text-xs sm:text-sm">
                      &mdash; AI Placement &amp; Interview Cockpit
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#856658] text-xs sm:text-sm">
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
