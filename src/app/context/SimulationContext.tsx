import React, { createContext, useContext, useState } from 'react';
import { UserRole, CurrentUser } from '@/types';

interface SimulationContextType {
  currentUser: CurrentUser;
  setCurrentRole: (role: UserRole) => void;
  availableRoles: { role: UserRole; label: string; description: string }[];
}

const defaultRoles: { role: UserRole; label: string; description: string }[] = [
  { role: 'admin', label: 'Admin / Pemilik', description: 'Akses penuh ke seluruh modul & laporan' },
  { role: 'kasir', label: 'Kasir', description: 'Transaksi kasir, stok & preferensi pelanggan' },
  { role: 'teknisi', label: 'Teknisi', description: 'Daftar servis & pembaruan status pengerjaan' },
  { role: 'pelanggan', label: 'Pelanggan', description: 'Tracking servis nota & SPK smartphone' },
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRole] = useState<UserRole>('admin');

  const currentUser: CurrentUser = {
    id: `usr-${currentRole}`,
    name:
      currentRole === 'admin'
        ? 'Budi (Admin)'
        : currentRole === 'kasir'
        ? 'Siti (Kasir)'
        : currentRole === 'teknisi'
        ? 'Rahmat (Teknisi)'
        : 'Pelanggan Konter',
    role: currentRole,
  };

  const setCurrentRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  return (
    <SimulationContext.Provider
      value={{
        currentUser,
        setCurrentRole,
        availableRoles: defaultRoles,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

// This hook intentionally shares the same module as its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
