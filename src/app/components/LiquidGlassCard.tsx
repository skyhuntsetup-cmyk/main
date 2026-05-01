import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface LiquidGlassCardProps {
  children: ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  hoverable?: boolean;
  pulseIndicator?: boolean;
  onClick?: () => void;
}

const sizeStyles = {
  small: 'p-4',
  medium: 'p-5',
  large: 'p-6 md:p-8',
};

export function LiquidGlassCard({
  children,
  className,
  size = 'medium',
  hoverable = false,
  pulseIndicator = false,
  onClick,
}: LiquidGlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl bg-white/15 backdrop-blur-[60px] border-[1.5px] border-white/60',
        'shadow-[0_8px_32px_rgba(0,71,171,0.12)]',
        hoverable && 'transition-all duration-300 cursor-pointer hover:bg-white/25 hover:shadow-[0_12px_40px_rgba(0,71,171,0.2)] hover:scale-[1.02]',
        sizeStyles[size],
        className
      )}
      onClick={onClick}
    >
      {pulseIndicator && (
        <div className="absolute top-3 right-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
          </span>
        </div>
      )}
      {children}
    </div>
  );
}
