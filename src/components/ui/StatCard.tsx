import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: string | number;
    label?: string;
    isPositive?: boolean;
  };
  badgeText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  className,
  title,
  value,
  icon,
  subtitle,
  trend,
  badgeText,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-card p-5 shadow-subtle hover:shadow-card transition-shadow',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-control bg-page-bg text-deep-green border border-border/80 shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold text-deep-green tracking-tight">
          {value}
        </div>
        {badgeText && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-green/40 text-deep-green border border-brand-green">
            {badgeText}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center text-xs text-text-muted gap-2">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded',
                trend.isPositive !== false
                  ? 'text-success bg-[#EBF7EF]'
                  : 'text-danger bg-[#FDF0ED]'
              )}
            >
              {trend.isPositive !== false ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {trend?.label && <span>{trend.label}</span>}
          {!trend && subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
