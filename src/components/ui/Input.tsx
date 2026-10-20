import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isCurrency?: boolean;
  isSearch?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      isCurrency = false,
      isSearch = false,
      id: customId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    // If search mode is enabled, supply Search icon by default unless custom leftIcon is passed
    const renderedLeftIcon = isSearch && !leftIcon ? (
      <Search className="w-4 h-4 text-text-muted" aria-hidden="true" />
    ) : isCurrency ? (
      <span className="text-sm font-semibold text-text-muted select-none">Rp</span>
    ) : (
      leftIcon
    );

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold uppercase tracking-wider text-deep-green mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {renderedLeftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none">
              {renderedLeftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              'w-full bg-surface border rounded-control py-2 text-sm text-deep-green placeholder:text-text-muted/60 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-deep-green focus:border-transparent',
              'disabled:bg-page-bg disabled:text-text-muted disabled:cursor-not-allowed',
              error
                ? 'border-danger focus:ring-danger'
                : 'border-border hover:border-[#CBD6C7]',
              renderedLeftIcon ? (isCurrency ? 'pl-9 pr-3' : 'pl-9 pr-3') : 'px-3',
              rightIcon ? 'pr-9' : 'pr-3',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1 text-xs text-danger font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="mt-1 text-xs text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
