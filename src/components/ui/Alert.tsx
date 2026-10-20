import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  onDismiss,
  children,
  ...props
}) => {
  const configs = {
    success: {
      container: 'bg-[#EBF7EF] border-[#BCE8C9] text-deep-green',
      icon: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
      titleColor: 'text-success font-semibold',
    },
    warning: {
      container: 'bg-[#FFF8D6] border-[#FBE38E] text-[#613E00]',
      icon: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
      titleColor: 'text-[#855500] font-semibold',
    },
    danger: {
      container: 'bg-[#FDF0ED] border-[#F8C8C0] text-danger',
      icon: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
      titleColor: 'text-danger font-semibold',
    },
    info: {
      container: 'bg-[#EEF6F0] border-border text-deep-green',
      icon: <Info className="w-5 h-5 text-deep-green shrink-0" />,
      titleColor: 'text-deep-green font-semibold',
    },
  };

  const current = configs[variant];

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-card border transition-all text-sm',
        current.container,
        className
      )}
      {...props}
    >
      <div className="pt-0.5">{current.icon}</div>
      <div className="flex-1">
        {title && <div className={cn('text-sm mb-0.5', current.titleColor)}>{title}</div>}
        <div className="text-xs leading-relaxed opacity-95">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-control hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Tutup pemberitahuan"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
