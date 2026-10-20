import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-control';

    const variants = {
      primary:
        'bg-deep-green text-surface hover:bg-opacity-90 focus-visible:ring-deep-green shadow-sm',
      secondary:
        'bg-[#E8F0E5] text-deep-green hover:bg-[#DCE7D9] focus-visible:ring-deep-green',
      outline:
        'border border-border bg-surface text-deep-green hover:bg-page-bg focus-visible:ring-deep-green shadow-sm',
      ghost:
        'text-deep-green hover:bg-[#E8F0E5] focus-visible:ring-deep-green',
      destructive:
        'bg-danger text-surface hover:bg-opacity-90 focus-visible:ring-danger shadow-sm',
      brand:
        'bg-brand-green text-deep-green font-semibold hover:bg-opacity-80 focus-visible:ring-deep-green shadow-sm',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-11 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
