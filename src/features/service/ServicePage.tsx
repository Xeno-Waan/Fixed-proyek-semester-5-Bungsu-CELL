import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Wrench, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const ServicePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" dot>Modul Servis</Badge>
            <Badge variant="warning" dot>Dijadwalkan Phase C</Badge>
          </div>
          <h2 className="text-2xl font-bold text-deep-green mt-1">Manajemen Servis Smartphone</h2>
          <p className="text-sm text-text-muted">
            Pencatatan penerimaan unit perbaikan, nomor nota unik, histori status pengerjaan, dan tracking publik.
          </p>
        </div>
      </div>

      <Alert variant="info" title="Ruang Lingkup Phase C">
        Manajemen Servis dijadwalkan pada <strong>Phase C</strong> sesuai <code>docs/IMPLEMENTATION_PLAN.md</code> setelah Phase A dan Phase B disetujui.
      </Alert>

      {/* Security alert regarding screen locks */}
      <Alert variant="warning" title="Batasan Keamanan Kunci Layar (PRD 4.3)">
        <div className="flex items-start gap-2 mt-1">
          <ShieldCheck className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <span>
            Sesuai SOT resmi, PIN atau pola kunci layar pelanggan <strong>TIDAK PERNAH DISIMPAN</strong> di database, localStorage, maupun tampilan antarmuka. Pelanggan membuka perangkat sendiri saat pengujian pascaperbaikan.
          </span>
        </div>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-deep-green">
            <Wrench className="w-5 h-5" />
            <CardTitle>Spesifikasi Fitur Servis (PRD 4.3)</CardTitle>
          </div>
          <CardDescription>
            Target implementasi yang akan dibangun pada Phase C:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-deep-green">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span><strong>Formulir Penerimaan Unit:</strong> Data pelanggan, merek/tipe ponsel, keluhan, estimasi biaya, dan tanggal masuk.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span><strong>Nomor Nota Unik:</strong> Generator kode nota unik lokal (misal: SRV-20261020-001).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span><strong>Tahapan Status:</strong> Pengecekan &rarr; Proses Perbaikan &rarr; Selesai / Dibatalkan dengan catatan teknisi.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              <span><strong>Preview & Cetak Nota:</strong> Desain nota cetak ramah printer browser dan tracking nota pelanggan.</span>
            </li>
          </ul>

          <div className="mt-6 p-4 rounded-control bg-page-bg border border-border flex items-center gap-3 text-xs text-text-muted">
            <Clock className="w-4 h-4 text-deep-green shrink-0" />
            <span>Menunggu persetujuan berurutan sebelum memulai Phase C.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
