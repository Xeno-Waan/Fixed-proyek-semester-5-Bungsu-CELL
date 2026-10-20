import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'warning' | 'danger' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, description, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, description, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-success shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning shrink-0" />;
      case 'danger':
        return <AlertCircle className="w-5 h-5 text-danger shrink-0" />;
      case 'info':
        return <Info className="w-5 h-5 text-deep-green shrink-0" />;
    }
  };

  const getToastClasses = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-[#BCE8C9] bg-surface';
      case 'warning':
        return 'border-[#FBE38E] bg-surface';
      case 'danger':
        return 'border-[#F8C8C0] bg-surface';
      case 'info':
        return 'border-border bg-surface';
    }
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-live="polite"
            className="fixed bottom-4 left-4 right-4 z-50 flex w-auto max-w-sm flex-col gap-2 pointer-events-none sm:left-auto sm:w-full"
          >
            {toasts.map((item) => (
              <div
                key={item.id}
                role="status"
                className={cn(
                  'pointer-events-auto flex items-start gap-3 rounded-card border p-4 shadow-card motion-safe:animate-toast-in motion-reduce:animate-none',
                  getToastClasses(item.type)
                )}
              >
                <div className="pt-0.5">{getToastIcon(item.type)}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-deep-green">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-text-muted mt-0.5 leading-relaxed">
                      {item.description}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(item.id)}
                  className="-mr-2 -mt-2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-control text-text-muted transition-colors hover:bg-page-bg hover:text-deep-green"
                  aria-label="Tutup notifikasi"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

// This hook intentionally shares the same module as its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
