import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  gradient?: boolean;
}

export function Card({ children, className, onClick, hoverable, gradient: _gradient }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-4 shadow-[0px_2px_6px_rgba(0,0,0,0.16)]',
        hoverable && 'hover:shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-all cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
