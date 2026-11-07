import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, User as UserIcon, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../../../components/common/BrandLogo';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const { register, isRegisterPending } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const details = err.response?.data?.error?.details;
      if (Array.isArray(details) && details.length > 0) {
        setErrorMsg(details.map((d: any) => d.message).join('. '));
      } else {
        setErrorMsg(
          err.response?.data?.error?.message ||
            'Registration failed. Ensure password meets all complexity rules.'
        );
      }
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 sm:my-16 px-6 sm:px-10 py-8 sm:py-10 rounded-3xl bg-[#1A0C09]/90 border border-[#3E1D19] shadow-[0_12px_60px_rgba(0,0,0,0.7)] backdrop-blur-md space-y-6 text-[#F5E8DD]">
      {/* Brand Emblem */}
      <div className="flex flex-col items-center justify-center pt-1 pb-1">
        <div className="relative">
          <div className="absolute -inset-3 bg-[var(--theme-accent,#FF9E79)]/15 rounded-full blur-xl pointer-events-none" />
          <BrandLogo size="lg" />
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-[#2A100E] border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4B8A8]">First Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#856658] absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#140705] border border-[#3E1D19] rounded-xl text-sm text-[#F5E8DD] placeholder-[#856658] focus:outline-none focus:border-[#F0B87A] transition"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4B8A8]">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full px-3.5 py-2.5 bg-[#140705] border border-[#3E1D19] rounded-xl text-sm text-[#F5E8DD] placeholder-[#856658] focus:outline-none focus:border-[#F0B87A] transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#D4B8A8]">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#856658] absolute left-3.5 top-3.5" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 chars, 1 uppercase, 1 symbol"
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#140705] border border-[#3E1D19] rounded-xl text-sm text-[#F5E8DD] placeholder-[#856658] focus:outline-none focus:border-[#F0B87A] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isRegisterPending}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold text-sm transition shadow-[0_0_20px_rgba(240,184,122,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {isRegisterPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#140808]" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-[#856658] pt-2">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-[#F0B87A] hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
};
export default RegisterPage;