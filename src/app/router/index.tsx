import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { PosPage } from '@/features/pos/PosPage';
import { InventoryPage } from '@/features/inventory/InventoryPage';
import { ServicePage } from '@/features/service/ServicePage';
import { FinancePage } from '@/features/finance/FinancePage';
import { SpkPage } from '@/features/smartphone-spk/SpkPage';
import { DesignSystemPage } from '@/features/design-system/DesignSystemPage';
import { NotFoundPage } from './NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'pos',
        element: <PosPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'service',
        element: <ServicePage />,
      },
      {
        path: 'finance',
        element: <FinancePage />,
      },
      {
        path: 'smartphone-spk',
        element: <SpkPage />,
      },
      {
        path: 'design-system',
        element: <DesignSystemPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
