// src/features/service/ServicePage.tsx
import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { ShieldCheck, Search, PlusCircle } from 'lucide-react';
import { ServiceForm } from './components/ServiceForm';
import { ServiceList } from './components/ServiceList';
import { ServiceTracking } from './components/ServiceTracking';
import { ServiceStoreProvider, useServiceStore } from './hooks/useServiceStore';

type ServiceTab = 'management' | 'tracking';

const ServicePageContent: React.FC = () => {
  const { orders } = useServiceStore();
  const [activeTab, setActiveTab] = useState<ServiceTab>('management');

  const pendingCount = orders.filter(
    (o) => o.status === 'pengecekan' || o.status === 'proses_perbaikan'
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" dot>Modul Servis</Badge>
            <Badge variant="success" dot>Phase C</Badge>
            {pendingCount > 0 && (
              <Badge variant="warning">{pendingCount} Unit Dalam Proses</Badge>
            )}
          </div>
          <h2 className="text-2xl font-bold text-deep-green mt-1">Manajemen Servis Smartphone</h2>
          <p className="text-sm text-text-muted">
            Penerimaan unit perbaikan, nomor nota unik, histori status pengerjaan, tracking mandiri pelanggan, dan cetak nota.
          </p>
        </div>
      </div>

      {/* Security alert regarding screen locks (PRD 4.3 mandatory) */}
      <Alert variant="warning" title="Batasan Keamanan Kunci Layar (PRD 4.3)">
        <div className="flex items-start gap-2 mt-1">
          <ShieldCheck className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <span>
            Sesuai SOT resmi, PIN atau pola kunci layar pelanggan <strong>TIDAK PERNAH DISIMPAN</strong> di database, localStorage, maupun tampilan antarmuka. Pelanggan membuka perangkat sendiri saat pengujian pascaperbaikan.
          </span>
        </div>
      </Alert>

      {/* Tab Navigation */}
      <div className="flex border-b border-border gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('management')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'management'
              ? 'border-deep-green text-deep-green font-semibold'
              : 'border-transparent text-text-muted hover:text-deep-green'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Daftar & Penerimaan Servis
          <span className="text-[10px] font-bold bg-page-bg border border-border px-1.5 py-0.5 rounded-full text-deep-green">
            {orders.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tracking')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'tracking'
              ? 'border-deep-green text-deep-green font-semibold'
              : 'border-transparent text-text-muted hover:text-deep-green'
          }`}
        >
          <Search className="w-4 h-4" />
          Pelacakan Nota Pelanggan (Tracking)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'management' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:items-start">
          <ServiceForm />
          <ServiceList />
        </div>
      ) : (
        <ServiceTracking />
      )}
    </div>
  );
};

export const ServicePage: React.FC = () => {
  return (
    <ServiceStoreProvider>
      <ServicePageContent />
    </ServiceStoreProvider>
  );
};
