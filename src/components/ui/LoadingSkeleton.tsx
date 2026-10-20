import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded bg-[#E4EBE1] motion-reduce:animate-none', className)}
      aria-hidden="true"
      {...props}
    />
  );
};

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label, className, ...props }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex items-center justify-center gap-2 text-deep-green', className)}
      {...props}
    >
      <Loader2 className={cn('animate-spin motion-reduce:animate-none', sizes[size])} aria-hidden="true" />
      <span className={label ? 'text-xs font-medium text-text-muted' : 'sr-only'}>
        {label || 'Memuat'}
      </span>
    </div>
  );
};
