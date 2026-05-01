import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'success';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white shadow-[0_4px_16px_rgba(0,71,171,0.35)] hover:shadow-[0_6px_24px_rgba(0,71,171,0.5)] hover:brightness-110',
  glass:
    'bg-white/20 backdrop-blur-xl text-[#001F3F] font-semibold border-[1.5px] border-white/60 hover:bg-white/30 hover:shadow-[0_4px_16px_rgba(0,71,171,0.15)]',
  success:
    'bg-gradient-to-r from-[#00A854] to-[#00D9A8] text-white shadow-[0_4px_16px_rgba(0,168,84,0.35)] hover:shadow-[0_6px_24px_rgba(0,168,84,0.5)] hover:brightness-110',
};

const sizeStyles = {
  small: 'h-8 px-3 text-sm gap-1.5',
  medium: 'h-10 px-4 text-sm gap-2',
  large: 'h-12 px-5 text-base gap-2.5',
};

export function PremiumButton({
  variant = 'primary',
  size = 'medium',
  className,
  children,
  disabled,
  ...props
}: PremiumButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200',
        'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
