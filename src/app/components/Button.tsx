import { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#1F77D2] text-white hover:bg-[#1a67b8] active:bg-[#155a9e]',
    success: 'bg-[#00A854] text-white hover:bg-[#008f47] active:bg-[#00763a]',
    danger: 'bg-[#E74C3C] text-white hover:bg-[#c0392b] active:bg-[#a93226]',
    outlined: 'border-2 border-[#1F77D2] text-[#1F77D2] bg-transparent hover:bg-[#1F77D2]/10',
    text: 'text-[#1F77D2] bg-transparent hover:underline'
  };

  const sizes = {
    small: 'h-8 px-2 text-sm',
    medium: 'h-10 px-3',
    large: 'h-12 px-4 w-full'
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
