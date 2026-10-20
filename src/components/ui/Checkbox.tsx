import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id: customId, checked, ...props }, ref) => {
    const generatedId = useId();
    const id = customId || generatedId;

    return (
      <div className="flex items-start gap-2.5">
        <div className="relative flex items-center pt-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            className={cn(
              'peer h-4 w-4 shrink-0 rounded border border-border appearance-none bg-surface transition-all',
              'checked:bg-deep-green checked:border-deep-green',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green focus-visible:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          <Check
            className="w-3 h-3 text-surface absolute top-1 left-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity stroke-[3]"
            aria-hidden="true"
          />
        </div>
        {(label || description) && (
          <label htmlFor={id} className="text-sm select-none cursor-pointer">
            {label && <div className="font-medium text-deep-green">{label}</div>}
            {description && <div className="text-xs text-text-muted mt-0.5">{description}</div>}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
