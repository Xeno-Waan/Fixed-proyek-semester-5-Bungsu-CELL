import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Smartphone, CheckCircle2, Clock } from 'lucide-react';

export const SpkPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" dot>Modul SPK SAW</Badge>
            <Badge variant="warning" dot>Dijadwalkan Phase E</Badge>
          </div>
          <h2 className="text-2xl font-bold text-deep-green mt-1">SPK Pemilihan Smartphone (Metode SAW)</h2>
          <p className="text-sm text-text-muted">
            Sistem Pendukung Keputusan pemilihan smartphone baru & bekas menggunakan Simple Additive Weighting.
          </p>
        </div>
      </div>

      <Alert variant="info" title="Ruang Lingkup Phase E">
        Implementasi algoritma SAW, manajemen bobot kriteria, normalisasi matriks, dan visualisasi ranking Top 3 akan dibangun secara teruji pada <strong>Phase E</strong> sesuai <code>docs/IMPLEMENTATION_PLAN.md</code>.
      </Alert>

      {/* Criteria Table Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-deep-green">
            <Smartphone className="w-5 h-5" />
            <CardTitle>Spesifikasi Kriteria SAW (PRD Bagian 5)</CardTitle>
          </div>
          <CardDescription>
            7 kriteria resmi yang telah disetujui dalam SOT:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-[#FAFCF9] text-deep-green">
                  <th className="py-2.5 px-3 font-semibold">Kode</th>
                  <th className="py-2.5 px-3 font-semibold">Nama Kriteria</th>
                  <th className="py-2.5 px-3 font-semibold">Sifat (Atribut)</th>
                  <th className="py-2.5 px-3 font-semibold">Skala / Satuan</th>
                  <th className="py-2.5 px-3 font-semibold">Prinsip Penilaian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-deep-green">
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">C1</td>
                  <td className="py-2 px-3 font-medium">Harga</td>
                  <td className="py-2 px-3"><Badge variant="danger" size="sm">Cost</Badge></td>
                  <td className="py-2 px-3 font-mono">Rupiah</td>
                  <td className="py-2 px-3 text-text-muted">Harga lebih rendah memperoleh nilai normalisasi lebih tinggi.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">C2</td>
                  <td className="py-2 px-3 font-medium">RAM</td>
                  <td className="py-2 px-3"><Badge variant="success" size="sm">Benefit</Badge></td>
                  <td className="py-2 px-3 font-mono">GB</td>
                  <td className="py-2 px-3 text-text-muted">Kapasitas RAM lebih besar memperoleh nilai lebih tinggi.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">C3</td>
                  <td className="py-2 px-3 font-medium">Penyimpanan Internal</td>
                  <td className="py-2 px-3"><Badge variant="success" size="sm">Benefit</Badge></td>
                  <td className="py-2 px-3 font-mono">GB</td>
                  <td className="py-2 px-3 text-text-muted">Kapasitas penyimpanan lebih besar memperoleh nilai lebih tinggi.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">C4</td>
                  <td className="py-2 px-3 font-medium">Kualitas Kamera</td>
                  <td className="py-2 px-3"><Badge variant="success" size="sm">Benefit</Badge></td>
                  <td className="py-2 px-3 font-mono">Skala 1–5</td>
                  <td className="py-2 px-3 text-text-muted">Rating foto lebih tinggi memperoleh nilai lebih tinggi.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">C5</td>
                  <td className="py-2 px-3 font-medium">Desain Modul Kamera</td>
                  <td className="py-2 px-3"><Badge variant="success" size="sm">Benefit</Badge></td>
                  <td className="py-2 px-3 font-mono">Skala 1–5</td>
                  <td className="py-2 px-3 text-text-muted">Desain lebih compact, tipis, dan subtle memperoleh nilai lebih tinggi.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">C6</td>
                  <td className="py-2 px-3 font-medium">Kapasitas Baterai</td>
                  <td className="py-2 px-3"><Badge variant="success" size="sm">Benefit</Badge></td>
                  <td className="py-2 px-3 font-mono">mAh</td>
                  <td className="py-2 px-3 text-text-muted">Kapasitas baterai lebih besar memperoleh nilai lebih tinggi.</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono font-bold">C7</td>
                  <td className="py-2 px-3 font-medium">Kondisi Unit</td>
                  <td className="py-2 px-3"><Badge variant="success" size="sm">Benefit</Badge></td>
                  <td className="py-2 px-3 font-mono">Skala 1–5</td>
                  <td className="py-2 px-3 text-text-muted">Baru (5) &gt; Bekas mulus (4) &gt; Bekas minus ringan (3).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 space-y-2 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>Rumus normalisasi Cost: <code>r_ij = min(x_j) / x_ij</code></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>Rumus normalisasi Benefit: <code>r_ij = x_ij / max(x_j)</code></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
              <span>Nilai preferensi akhir: <code>V_i = Σ(w_j × r_ij)</code></span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-control bg-page-bg border border-border flex items-center gap-3 text-xs text-text-muted">
            <Clock className="w-4 h-4 text-deep-green shrink-0" />
            <span>Implementasi lengkap SAW, form preferensi, dan perhitungan deterministik dimulai pada Phase E.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
