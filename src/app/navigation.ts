import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Wrench,
  Wallet,
  Smartphone,
  Palette,
} from 'lucide-react';
import React from 'react';

export interface NavRoute {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

export const navigationRoutes: NavRoute[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    description: 'Ringkasan operasional & statistik',
  },
  {
    id: 'pos',
    label: 'Kasir & Penjualan (POS)',
    path: '/pos',
    icon: ShoppingCart,
    description: 'Pencatatan transaksi & keranjang',
  },
  {
    id: 'inventory',
    label: 'Manajemen Inventaris',
    path: '/inventory',
    icon: Boxes,
    description: 'Katalog barang & peringatan stok',
  },
  {
    id: 'service',
    label: 'Service Center',
    path: '/service',
    icon: Wrench,
    description: 'Penerimaan unit & tracking nota',
  },
  {
    id: 'finance',
    label: 'Keuangan & Layanan PPOB',
    path: '/finance',
    icon: Wallet,
    description: 'Pemisahan kas & transaksi HP bekas',
  },
  {
    id: 'smartphone-spk',
    label: 'SPK Rekomendasi Smartphone (SAW)',
    path: '/smartphone-spk',
    icon: Smartphone,
    description: 'Rekomendasi pemilihan smartphone SAW',
  },
  {
    id: 'design-system',
    label: 'Design System & UI',
    path: '/design-system',
    icon: Palette,
    badge: 'Phase A',
    description: 'Preview token desain & komponen UI',
  },
];
