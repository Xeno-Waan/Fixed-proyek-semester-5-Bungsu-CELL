import React from 'react';
import { useLocation } from 'react-router-dom';
import { navigationRoutes } from '../navigation';
import { useSimulation } from '../context/SimulationContext';
import { Menu, Bell, UserCircle2 } from 'lucide-react';
import { UserRole } from '@/types';
import { useToast } from '@/components/ui/Toast';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();
  const { currentUser, setCurrentRole, availableRoles } = useSimulation();
  const { toast } = useToast();

  const currentRoute = navigationRoutes.find(
    (r) => r.path === location.pathname || (r.path !== '/' && location.pathname.startsWith(r.path))
  );

  const title = currentRoute?.label || 'Bungsu Cell';

  return (
    <header className="h-16 bg-surface border-b border-border sticky top-0 z-10 px-4 sm:px-6 flex items-center justify-between shadow-subtle">
      {/* Left: Mobile Menu Trigger & Breadcrumbs */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-control text-deep-green hover:bg-page-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex min-w-0 flex-col">
          <div className="hidden items-center gap-1.5 text-xs text-text-muted sm:flex">
            <span>Bungsu Cell</span>
            <span>/</span>
            <span className="text-deep-green font-medium">{title}</span>
          </div>
          <h1 className="truncate text-base font-bold leading-tight tracking-tight text-deep-green sm:text-lg">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Notification & Simulation Role Switcher */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Simulation Role Selector */}
        <div className="flex items-center gap-2 bg-page-bg border border-border rounded-control px-2.5 py-1.5">
          <UserCircle2 className="w-4 h-4 text-deep-green shrink-0 hidden sm:block" />
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted hidden sm:block leading-none">
              Aktor Simulasi
            </span>
            <select
              value={currentUser.role}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-deep-green border-none focus:outline-none cursor-pointer p-0"
              aria-label="Pilih Aktor Simulasi"
            >
              {availableRoles.map((roleItem) => (
                <option key={roleItem.role} value={roleItem.role}>
                  {roleItem.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications mock */}
        <button
          type="button"
          onClick={() =>
            toast({
              type: 'info',
              title: 'Notifikasi fondasi',
              description: 'Belum ada notifikasi operasional pada Phase A.',
            })
          }
          className="relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-control text-deep-green transition-colors hover:bg-page-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green"
          aria-label="Pemberitahuan: 1 indikator contoh"
          title="Notifikasi Operasional"
        >
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-surface" />
        </button>
      </div>
    </header>
  );
};
