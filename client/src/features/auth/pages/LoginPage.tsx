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
    <div className="max-w-md mx-auto my-14 p-8 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>
        <h1 className="text-2xl font-serif font-normal text-[#0A0706] tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-[#6B544A]">
          Sign in to your HireReady AI interview cockpit
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#FFF4EC] border border-[#F2DDD2] text-xs text-[#A83E14] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FF7A48]" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0A0706]">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8C7268] absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl text-sm text-[#0A0706] placeholder-[#8C7268] focus:outline-none focus:border-[#FF7A48] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0A0706]">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#8C7268] absolute left-3.5 top-3.5" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl text-sm text-[#0A0706] placeholder-[#8C7268] focus:outline-none focus:border-[#FF7A48] focus:bg-white transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoginPending}
          className="w-full py-3 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {isLoginPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#FF7A48]" />
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

      <div className="pt-2 text-center text-xs text-[#6B544A] border-t border-[#F2DDD2]/60">
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" className="text-[#FF7A48] hover:underline font-semibold">
          Create an account
        </Link>
      </div>
    </div>
  );
};
export default LoginPage;
