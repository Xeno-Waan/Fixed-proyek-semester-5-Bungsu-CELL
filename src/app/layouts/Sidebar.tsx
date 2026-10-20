import React from 'react';
import { NavLink } from 'react-router-dom';
import { navigationRoutes } from '../navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const { currentUser } = useSimulation();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-deep-green text-surface transition-all duration-300 ease-in-out border-r border-[#245239] shrink-0 z-20 select-none',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      aria-label="Sidebar Navigasi"
    >
      {/* Brand Logo & Title */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#245239]/70">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-control bg-brand-green flex items-center justify-center text-deep-green font-bold shrink-0 shadow-sm">
            <Smartphone className="w-5 h-5 stroke-[2.5]" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base tracking-tight text-brand-green truncate leading-tight">
                BUNGSU CELL
              </span>
              <span className="text-[11px] text-[#A6C5B2] truncate">
                POS & SPK Smartphone
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-control text-[#A6C5B2] transition-colors hover:bg-[#235038] hover:text-surface"
          aria-label={isCollapsed ? 'Perlebar Sidebar' : 'Persempit Sidebar'}
          title={isCollapsed ? 'Perlebar Sidebar' : 'Persempit Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navigationRoutes.map((route) => {
          const Icon = route.icon;
          return (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-control text-sm font-medium transition-all group relative',
                  isActive
                    ? 'bg-brand-green text-deep-green font-semibold shadow-sm'
                    : 'text-[#D0E0D6] hover:bg-[#204933] hover:text-surface'
                )
              }
              aria-label={route.label}
              title={isCollapsed ? route.label : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-deep-green' : 'text-[#A6C5B2] group-hover:text-surface'
                    )}
                  />
                  {!isCollapsed && (
                    <span className="truncate flex-1">{route.label}</span>
                  )}
                  {!isCollapsed && route.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider',
                        isActive
                          ? 'bg-deep-green text-surface'
                          : 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40'
                      )}
                    >
                      {route.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile & Role Simulation */}
      <div className="p-3 border-t border-[#245239]/70 bg-[#143323]">
        <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : 'px-2')}>
          <div className="w-8 h-8 rounded-full bg-brand-yellow text-deep-green font-bold text-xs flex items-center justify-center shrink-0">
            {currentUser.name.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-surface truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-brand-yellow font-medium uppercase tracking-wider">
                Simulasi: {currentUser.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
