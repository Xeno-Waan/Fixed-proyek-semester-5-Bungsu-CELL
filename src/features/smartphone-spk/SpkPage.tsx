import React, { useState } from 'react';
import { RefreshCcw, Smartphone as SmartphoneIcon } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { initialSmartphones, sawCriteria } from '@/data/smartphones';
import { formatRupiah } from '@/lib/currency';
import { calculateSAWWithDiagnostics, SAWCalculationResult } from '@/lib/saw';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CriteriaCode, Smartphone } from '@/types';
import { PreferenceForm } from './SpkForm';
import { SpkResults } from './SpkResults';

const criteriaAttributes = sawCriteria.reduce<Record<CriteriaCode, 'cost' | 'benefit'>>(
  (attributes, criterion) => ({ ...attributes, [criterion.code]: criterion.attribute }),
  {} as Record<CriteriaCode, 'cost' | 'benefit'>
);

const conditionLabel = (condition: Smartphone['condition']) => condition.replace('_', ' ');

export const SpkPage: React.FC = () => {
  const [smartphones, setSmartphones, resetSmartphones] = useLocalStorage<Smartphone[]>(
    'bungsu-cell-smartphones',
    initialSmartphones
  );
  const [calculation, setCalculation] = useState<SAWCalculationResult | null>(null);

  const handleCalculate = (weights: Record<CriteriaCode, number>) => {
    setCalculation(calculateSAWWithDiagnostics(smartphones, { weights, attributes: criteriaAttributes }));
  };

  const toggleAlternative = (id: string) => {
    setSmartphones((current) => current.map((phone) => (
      phone.id === id ? { ...phone, isActive: !phone.isActive } : phone
    )));
    setCalculation(null);
  };

  const handleReset = () => {
    resetSmartphones();
    setCalculation(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" dot>Modul SPK SAW</Badge>
            <Badge variant="success" dot>Phase E</Badge>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-deep-green">Rekomendasi Smartphone</h2>
          <p className="text-sm text-text-muted">Atur prioritas pelanggan, lalu bandingkan alternatif aktif secara transparan.</p>
        </div>
        <Button variant="outline" leftIcon={<RefreshCcw className="h-4 w-4" />} onClick={handleReset}>
          Reset katalog
        </Button>
      </div>

      <Alert variant="info" title="Cara perhitungan">
        Harga (C1) adalah cost; enam kriteria lainnya benefit. C4, C5, dan C7 memakai skala 1–5. Bobot akan dinormalisasi otomatis selama totalnya positif.
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SmartphoneIcon className="h-5 w-5 text-deep-green" />
            <CardTitle>Katalog alternatif</CardTitle>
          </div>
          <CardDescription>Hanya alternatif aktif dengan data kriteria valid yang ikut dalam rekomendasi. Status aktif tersimpan secara lokal di browser ini.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-page-bg">
                <TableHead>Alternatif</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>RAM / ROM</TableHead>
                <TableHead>Baterai</TableHead>
                <TableHead>Rating C4/C5/C7</TableHead>
                <TableHead>Aktif</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {smartphones.map((phone) => (
                <TableRow key={phone.id}>
                  <TableCell>
                    <div className="font-medium text-deep-green">{phone.model}</div>
                    <div className="text-xs text-text-muted">{formatRupiah(phone.price)}</div>
                  </TableCell>
                  <TableCell className="capitalize text-xs text-text-muted">{conditionLabel(phone.condition)}</TableCell>
                  <TableCell>{phone.specs.ram} GB / {phone.specs.storage} GB</TableCell>
                  <TableCell>{phone.specs.battery} mAh</TableCell>
                  <TableCell className="font-mono text-xs">{phone.criteria.cameraQualityRating} / {phone.criteria.cameraDesignRating} / {phone.criteria.conditionRating}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={phone.isActive}
                      onChange={() => toggleAlternative(phone.id)}
                      label={phone.isActive ? 'Aktif' : 'Nonaktif'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:items-start">
        <PreferenceForm onSubmit={handleCalculate} />
        <Card>
          <CardHeader><CardTitle>Skala penilaian</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-text-muted">
            <p><strong className="text-deep-green">C4 Kamera:</strong> 1 terendah hingga 5 kualitas foto tertinggi.</p>
            <p><strong className="text-deep-green">C5 Desain kamera:</strong> 1 paling menonjol hingga 5 paling compact, tipis, dan subtle.</p>
            <p><strong className="text-deep-green">C7 Kondisi:</strong> baru = 5, bekas mulus = 4, bekas minus ringan = 3.</p>
            <p className="border-t border-border pt-3 text-xs">Tie-break: bila skor sama, ID alternatif diurutkan secara alfabetis agar hasil selalu deterministik.</p>
          </CardContent>
        </Card>
      </div>

      {calculation && (
        <section className="space-y-4" aria-live="polite">
          {calculation.error && <Alert variant="danger" title="Perhitungan tidak dapat dilakukan">{calculation.error}</Alert>}
          {calculation.excluded.length > 0 && (
            <Alert variant="warning" title="Alternatif dikeluarkan dari perhitungan">
              {calculation.excluded.map((item) => `${item.model}: ${item.reason}`).join(' ')}
            </Alert>
          )}
          {!calculation.error && <SpkResults results={calculation.results} />}
        </section>
      )}
    </div>
  );
};
