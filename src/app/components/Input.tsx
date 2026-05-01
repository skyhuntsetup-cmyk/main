import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[#222222] mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'h-12 w-full rounded-lg border px-4 text-sm',
            'border-[#E8E8E8] focus:border-[#1F77D2] focus:outline-none focus:shadow-[0px_1px_3px_rgba(0,0,0,0.12)]',
            'placeholder:text-[#999999]',
            'disabled:bg-[#F5F5F5] disabled:opacity-50',
            error && 'border-[#E74C3C]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-[#E74C3C]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[#999999]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
