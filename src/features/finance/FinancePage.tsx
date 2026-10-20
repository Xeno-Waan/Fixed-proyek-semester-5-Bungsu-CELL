// src/features/finance/FinancePage.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Wallet } from 'lucide-react';
import { FinanceDashboard } from '@/features/finance/components/FinanceDashboard';
import { CashEntryForm } from '@/features/finance/components/CashEntryForm';
import { UsedPhoneForm } from '@/features/finance/components/UsedPhoneForm';

/**
 * Finance module page – displays the finance dashboard and entry forms.
 * Aligns with Phase D scope and UI‑GUIDELINE styling.
 */
export const FinancePage: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-deep-green" />
            <h2 className="text-2xl font-bold text-deep-green">Akuntansi PPOB & HP Bekas</h2>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Pemisahan kas konter & operasional PPOB, pencatatan pembelian serta profit HP bekas.
          </p>
        </div>
      </div>

      {/* Dashboard */}
      <FinanceDashboard />

      {/* Forms for quick data entry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entri Kas</CardTitle>
          </CardHeader>
          <CardContent>
            <CashEntryForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tambah HP Bekas</CardTitle>
          </CardHeader>
          <CardContent>
            <UsedPhoneForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
