import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { navigationRoutes } from '../navigation';
import { cn } from '@/lib/utils';
import { X, Smartphone } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useSimulation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = () => {
    if (!drawerRef.current) {
      return [];
    }

    return Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((element) => element.tabIndex !== -1);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        drawerRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!drawerRef.current?.contains(activeElement)) {
        event.preventDefault();
        (event.shiftKey ? lastElement : firstElement).focus();
      } else if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    closeButtonRef.current?.focus();
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 md:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-navigation-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-deep-green/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="fixed inset-y-0 left-0 flex w-72 max-w-[calc(100vw-2rem)] flex-col justify-between overflow-y-auto bg-deep-green p-4 text-surface shadow-dropdown motion-safe:animate-drawer-in motion-reduce:animate-none"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#245239]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-control bg-brand-green flex items-center justify-center text-deep-green font-bold">
                <Smartphone className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
              <span id="mobile-navigation-title" className="font-bold text-base text-brand-green leading-tight">
                BUNGSU CELL
                </span>
                <span className="text-[11px] text-[#A6C5B2]">POS & SPK Mobile</span>
              </div>
            </div>
            <button
              type="button"
              ref={closeButtonRef}
              onClick={onClose}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-control text-[#A6C5B2] hover:bg-[#204933] hover:text-surface"
              aria-label="Tutup menu navigasi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="mt-4 space-y-1.5">
            {navigationRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-control text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-green text-deep-green font-semibold shadow-sm'
                        : 'text-[#D0E0D6] hover:bg-[#204933] hover:text-surface'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{route.label}</span>
                  </div>
                  {route.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40">
                      {route.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer profile */}
        <div className="pt-4 border-t border-[#245239]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-yellow text-deep-green font-bold text-xs flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-surface truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-brand-yellow font-medium uppercase tracking-wider">
                Simulasi: {currentUser.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
