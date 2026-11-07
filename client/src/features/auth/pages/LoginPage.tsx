import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../../components/common/BrandLogo';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isLoginPending } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error?.message || 'Invalid email or password. Please try again.'
      );
    }
  };

  return (
    <div className="max-w-md mx-auto my-14 p-8 sm:p-10 rounded-3xl bg-[#1A0C09]/90 border border-[#3E1D19] shadow-[0_10px_50px_rgba(0,0,0,0.7)] backdrop-blur-md space-y-6 text-[#F5E8DD]">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#F5E8DD] tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-[#A88879]">
          Sign in to your HireReady AI interview cockpit
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-[#2A100E] border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#D4B8A8]">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#856658] absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#140705] border border-[#3E1D19] rounded-xl text-sm text-[#F5E8DD] placeholder-[#856658] focus:outline-none focus:border-[#F0B87A] transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#D4B8A8]">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#856658] absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#140705] border border-[#3E1D19] rounded-xl text-sm text-[#F5E8DD] placeholder-[#856658] focus:outline-none focus:border-[#F0B87A] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoginPending}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold text-sm transition shadow-[0_0_20px_rgba(240,184,122,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {isLoginPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#140808]" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-[#856658] pt-2">
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" className="text-[#F0B87A] hover:underline font-semibold">
          Create one now
        </Link>
      </div>
    </div>
  );
};
export default LoginPage;