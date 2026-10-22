import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { ShieldCheck } from 'lucide-react';
import { ServiceForm } from './components/ServiceForm';
import { ServiceList } from './components/ServiceList';

export const ServicePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" dot>Modul Servis</Badge>
            <Badge variant="success" dot>Aktif</Badge>
          </div>
          <h2 className="text-2xl font-bold text-deep-green mt-1">Manajemen Servis Smartphone</h2>
          <p className="text-sm text-text-muted">
            Pencatatan penerimaan unit perbaikan, nomor nota unik, histori status pengerjaan, dan tracking publik.
          </p>
        </div>
      </div>

      {/* Security alert regarding screen locks */}
      <Alert variant="warning" title="Batasan Keamanan Kunci Layar (PRD 4.3)">
        <div className="flex items-start gap-2 mt-1">
          <ShieldCheck className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <span>
            Sesuai SOT resmi, PIN atau pola kunci layar pelanggan <strong>TIDAK PERNAH DISIMPAN</strong> di database, localStorage, maupun tampilan antarmuka. Pelanggan membuka perangkat sendiri saat pengujian pascaperbaikan.
          </span>
        </div>
      </Alert>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:items-start">
        <ServiceForm />
        <ServiceList />
      </div>
    </div>
  );
};
