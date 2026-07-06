import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <input
          ref={ref}
          className={`w-full rounded border border-teddy-border bg-white px-4 py-3 text-base outline-none transition-colors placeholder:text-neutral-400 focus:border-teddy-orange ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error ? <span className="text-xs text-red-600">{error}</span> : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
