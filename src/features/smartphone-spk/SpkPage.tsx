import React, { useState, useMemo } from 'react';
import { RefreshCcw, Smartphone as SmartphoneIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Checkbox';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { initialSmartphones, sawCriteria } from '@/data/smartphones';
import { formatRupiah } from '@/lib/currency';
import { calculateSAWWithDiagnostics, SAWCalculationResult } from '@/lib/saw';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { CriteriaCode, Smartphone } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { PreferenceForm } from './SpkForm';
import { SpkResults } from './SpkResults';
import { SmartphoneModal } from './components/SmartphoneModal';

const criteriaAttributes = sawCriteria.reduce<Record<CriteriaCode, 'cost' | 'benefit'>>(
  (attributes, criterion) => ({ ...attributes, [criterion.code]: criterion.attribute }),
  {} as Record<CriteriaCode, 'cost' | 'benefit'>
);

const conditionLabel = (condition: Smartphone['condition']) => condition.replace('_', ' ');

export const SpkPage: React.FC = () => {
  const { toast } = useToast();
  const [smartphones, setSmartphones, resetSmartphones] = useLocalStorage<Smartphone[]>(
    'bungsu-cell-smartphones',
    initialSmartphones
  );
  const [calculation, setCalculation] = useState<SAWCalculationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneToEdit, setPhoneToEdit] = useState<Smartphone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSmartphones = useMemo(() => {
    if (!searchQuery.trim()) return smartphones;
    const q = searchQuery.toLowerCase();
    return smartphones.filter(
      (p) => p.model.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }, [smartphones, searchQuery]);

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
    toast({
      type: 'info',
      title: 'Katalog Direset',
      description: 'Katalog alternatif smartphone telah dipulihkan ke data awal.',
    });
  };

  const handleAddClick = () => {
    setPhoneToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (phone: Smartphone) => {
    setPhoneToEdit(phone);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, model: string) => {
    if (window.confirm(`Hapus ${model} dari katalog alternatif?`)) {
      setSmartphones((current) => current.filter((p) => p.id !== id));
      setCalculation(null);
      toast({
        type: 'info',
        title: 'Smartphone Dihapus',
        description: `${model} telah dihapus dari katalog.`,
      });
    }
  };

  const handleSavePhone = (savedPhone: Smartphone) => {
    setSmartphones((current) => {
      const exists = current.some((p) => p.id === savedPhone.id);
      if (exists) {
        return current.map((p) => (p.id === savedPhone.id ? savedPhone : p));
      }
      return [savedPhone, ...current];
    });
    setCalculation(null);
    toast({
      type: 'success',
      title: phoneToEdit ? 'Smartphone Diperbarui' : 'Smartphone Ditambahkan',
      description: `${savedPhone.brand} ${savedPhone.model} berhasil disimpan ke katalog.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" dot>Modul SPK SAW</Badge>
            <Badge variant="success" dot>Manajemen Smartphone Aktif</Badge>
          </div>
          <h2 className="mt-1 text-2xl font-bold text-deep-green">Manajemen & Rekomendasi Smartphone</h2>
          <p className="text-sm text-text-muted">Kelola alternatif smartphone, tentukan bobot kriteria, dan hitung perangkingan SAW.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<RefreshCcw className="h-4 w-4" />} onClick={handleReset}>
            Reset katalog
          </Button>
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleAddClick}>
            Tambah Smartphone
          </Button>
        </div>
      </div>

      <Alert variant="info" title="Panduan Manajemen & Perhitungan">
        Harga (C1) adalah cost; enam kriteria lainnya benefit. Gunakan tombol <strong>Tambah Smartphone</strong> atau ikon edit untuk mengelola data katalog secara real-time.
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <SmartphoneIcon className="h-5 w-5 text-deep-green" />
                <CardTitle>Katalog Manajemen Alternatif Smartphone</CardTitle>
              </div>
              <CardDescription>
                Tersimpan di browser lokal. Klik edit/hapus untuk mengelola unit, atau centang checkbox untuk mengikutsertakan dalam seleksi SAW.
              </CardDescription>
            </div>
            <div className="w-full sm:w-64">
              <Input
                isSearch
                placeholder="Cari merk / seri HP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-page-bg">
                <TableHead>Alternatif</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead>RAM / ROM</TableHead>
                <TableHead>Baterai</TableHead>
                <TableHead>Rating C4/C5/C7</TableHead>
                <TableHead>Status SAW</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSmartphones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-text-muted">
                    Tidak ada smartphone yang cocok dengan pencarian "{searchQuery}".
                  </TableCell>
                </TableRow>
              ) : (
                filteredSmartphones.map((phone) => (
                  <TableRow key={phone.id}>
                    <TableCell>
                      <div className="font-medium text-deep-green">{phone.model}</div>
                      <div className="text-xs text-text-muted">{phone.brand} &bull; {formatRupiah(phone.price)}</div>
                    </TableCell>
                    <TableCell className="capitalize text-xs text-text-muted">{conditionLabel(phone.condition)}</TableCell>
                    <TableCell>{phone.specs.ram} GB / {phone.specs.storage} GB</TableCell>
                    <TableCell>{phone.specs.battery} mAh</TableCell>
                    <TableCell className="font-mono text-xs">
                      {phone.criteria.cameraQualityRating} / {phone.criteria.cameraDesignRating} / {phone.criteria.conditionRating}
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={phone.isActive}
                        onChange={() => toggleAlternative(phone.id)}
                        label={phone.isActive ? 'Aktif' : 'Nonaktif'}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(phone)}
                          title="Edit Smartphone"
                          aria-label={`Edit ${phone.model}`}
                        >
                          <Pencil className="w-3.5 h-3.5 text-deep-green" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(phone.id, phone.model)}
                          title="Hapus Smartphone"
                          aria-label={`Hapus ${phone.model}`}
                          className="hover:text-danger hover:bg-danger/10"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-danger" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:items-start">
        <PreferenceForm onSubmit={handleCalculate} />
        <Card>
          <CardHeader><CardTitle>Skala Penilaian Kriteria SAW</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-text-muted">
            <p><strong className="text-deep-green">C1 Harga (Cost):</strong> Nilai lebih murah memperoleh skor normalisasi lebih tinggi.</p>
            <p><strong className="text-deep-green">C2 RAM & C3 ROM (Benefit):</strong> Kapasitas lebih besar (GB) memperoleh skor lebih tinggi.</p>
            <p><strong className="text-deep-green">C4 Kualitas Kamera (Benefit):</strong> Skala 1 (terendah) hingga 5 (tertinggi).</p>
            <p><strong className="text-deep-green">C5 Desain Modul Kamera (Benefit):</strong> Skala 1 (paling menonjol) hingga 5 (paling compact/subtle).</p>
            <p><strong className="text-deep-green">C6 Kapasitas Baterai (Benefit):</strong> Kapasitas mAh lebih besar memperoleh skor lebih tinggi.</p>
            <p><strong className="text-deep-green">C7 Kondisi Unit (Benefit):</strong> Baru = 5, Bekas Mulus = 4, Bekas Minus Ringan = 3.</p>
            <p className="border-t border-border pt-3 text-xs">Tie-break deterministik: bila skor akhir sama, alternatif diurutkan berdasarkan harga C1 yang lebih terjangkau.</p>
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

      {/* Modal Manajemen Smartphone */}
      <SmartphoneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePhone}
        phoneToEdit={phoneToEdit}
      />
    </div>
  );
};
