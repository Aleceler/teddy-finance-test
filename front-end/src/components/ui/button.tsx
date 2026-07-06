import { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-teddy-orange text-white hover:bg-[#d85a1f] disabled:bg-orange-300',
  outline:
    'border-2 border-teddy-orange bg-white text-teddy-orange hover:bg-orange-50 disabled:opacity-50',
  danger:
    'bg-teddy-orange text-white hover:bg-[#d85a1f] disabled:bg-orange-300',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-100',
};

export function Button({
  variant = 'primary',
  isLoading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded px-4 py-3 text-base font-bold transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}
