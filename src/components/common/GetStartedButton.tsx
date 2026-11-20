import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronsRight } from 'lucide-react';

interface GetStartedButtonProps {
  className?: string;
  size?: 'default' | 'large' | 'compact';
  fullWidthMobile?: boolean;
}

export const GetStartedButton: React.FC<GetStartedButtonProps> = ({
  className = '',
  size = 'default',
  fullWidthMobile = true,
}) => {
  const { navigateTo } = useApp();

  const sizeClasses = {
    compact: 'px-5 py-2.5 text-sm sm:text-base gap-2 rounded-xl',
    default: 'px-7 sm:px-8 py-3.5 sm:py-4 text-base sm:text-lg gap-2.5 rounded-2xl',
    large: 'px-8 sm:px-10 py-4 sm:py-4.5 text-lg sm:text-xl gap-3 rounded-2xl',
  };

  return (
    <button
      id="btn-get-started-cta"
      type="button"
      onClick={() => navigateTo('student-registration')}
      className={`
        inline-flex items-center justify-center font-extrabold text-white
        bg-gradient-to-r from-[#FF5722] via-[#F4511E] to-[#E64A19]
        hover:from-[#F4511E] hover:via-[#E64A19] hover:to-[#D84315]
        shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/35
        hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
        transition-all duration-200 cursor-pointer select-none group
        ${fullWidthMobile ? 'w-full sm:w-auto' : ''}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span className="tracking-tight">Get Started</span>
      <span className="flex items-center text-white/90 group-hover:text-white group-hover:translate-x-1 transition-transform duration-200 font-bold text-xl sm:text-2xl leading-none">
        »
      </span>
    </button>
  );
};
