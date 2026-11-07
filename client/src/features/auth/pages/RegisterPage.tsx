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
    <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-6">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <BrandLogo size="md" />
        </div>
        <h1 className="text-2xl font-serif font-normal text-[#0A0706] tracking-tight">
          Create an account
        </h1>
        <p className="text-xs text-[#6B544A]">
          Start your personalized AI placement preparation journey
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#FFF4EC] border border-[#F2DDD2] text-xs text-[#A83E14] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#FF7A48]" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0A0706]">First Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-[#8C7268] absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl text-sm text-[#0A0706] placeholder-[#8C7268] focus:outline-none focus:border-[#FF7A48] focus:bg-white transition"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0A0706]">Last Name</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full px-3.5 py-2.5 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl text-sm text-[#0A0706] placeholder-[#8C7268] focus:outline-none focus:border-[#FF7A48] focus:bg-white transition"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0A0706]">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#8C7268] absolute left-3.5 top-3.5" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Min 8 characters with numbers"
              className="w-full pl-10 pr-3.5 py-2.5 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl text-sm text-[#0A0706] placeholder-[#8C7268] focus:outline-none focus:border-[#FF7A48] focus:bg-white transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isRegisterPending}
          className="w-full py-3 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-white font-medium text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {isRegisterPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#FF7A48]" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-[#6B544A] border-t border-[#F2DDD2]/60">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-[#FF7A48] hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </div>
  );
};
export default RegisterPage;
