import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  fallbackRoute?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  fallbackRoute = '/dashboard',
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackRoute);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 hover:border-crimson-500/50 transition-all duration-150 shadow-sm group shrink-0 ${className}`}
      title="Return to previous screen"
    >
      <ArrowLeft className="w-3.5 h-3.5 text-crimson-400 group-hover:-translate-x-0.5 transition-transform duration-150" />
      <span>{label}</span>
    </button>
  );
};
export default BackButton;
