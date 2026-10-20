import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'warning' | 'success' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center font-medium rounded-full transition-colors select-none';

  const variants = {
    brand: 'bg-[#EBF7DF] text-deep-green border border-[#D0EBC1]',
    warning: 'bg-[#FFF8D6] text-[#855500] border border-[#FBE38E]',
    success: 'bg-[#EBF7EF] text-success border border-[#BCE8C9]',
    danger: 'bg-[#FDF0ED] text-danger border border-[#F8C8C0]',
    neutral: 'bg-[#EEF3ED] text-[#536357] border border-border',
    outline: 'bg-transparent text-deep-green border border-border',
  };

  const dotColors = {
    brand: 'bg-deep-green',
    warning: 'bg-warning',
    success: 'bg-success',
    danger: 'bg-danger',
    neutral: 'bg-text-muted',
    outline: 'bg-deep-green',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
