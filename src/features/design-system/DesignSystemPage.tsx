import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Alert } from '@/components/ui/Alert';
import { Dialog, ConfirmDialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton, Spinner } from '@/components/ui/LoadingSkeleton';
import { Check, Heart, Sparkles } from 'lucide-react';
import { formatRupiah } from '@/lib/currency';

export const DesignSystemPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [inputText, setInputText] = useState('Bungsu Cell');
  const [inputNumber, setInputNumber] = useState('250000');
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const showButtonFeedback = (label: string) => {
    toast({
      type: 'info',
      title: `Tombol ${label} dijalankan`,
      description: 'Ini adalah aksi contoh pada Phase A; tidak ada data operasional yang diubah.',
    });
  };

  const colors = [
    { name: 'brand-green', hex: '#DDF4C9', text: 'text-deep-green', desc: 'Highlight identitas' },
    { name: 'brand-yellow', hex: '#FFF0A8', text: 'text-deep-green', desc: 'Aksen dan perhatian' },
    { name: 'deep-green', hex: '#183D2A', text: 'text-surface', desc: 'Teks utama & sidebar' },
    { name: 'page-bg', hex: '#F4F7F2', text: 'text-deep-green', desc: 'Latar halaman' },
    { name: 'surface', hex: '#FFFFFF', text: 'text-deep-green', desc: 'Kartu & panel' },
    { name: 'text-muted', hex: '#647566', text: 'text-surface', desc: 'Teks sekunder' },
    { name: 'success', hex: '#287A45', text: 'text-surface', desc: 'Keberhasilan' },
    { name: 'warning', hex: '#A66B00', text: 'text-surface', desc: 'Peringatan' },
    { name: 'danger', hex: '#B42318', text: 'text-surface', desc: 'Kesalahan & aksi berisiko' },
    { name: 'border', hex: '#E1E8DE', text: 'text-deep-green', desc: 'Garis pembatas' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="brand">UI Tokens & Components</Badge>
          <Badge variant="neutral">Phase A Exit Gate</Badge>
        </div>
        <h2 className="text-2xl font-bold text-deep-green mt-1">Design System Bungsu Cell</h2>
        <p className="text-sm text-text-muted mt-0.5">
          Verifikasi implementasi visual design tokens, tipografi, kontrol form, dan komponen dialog sesuai panduan UI-GUIDELINE.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>1. Palet Warna (UI-GUIDELINE Tokens)</CardTitle>
          <CardDescription>
            Seluruh token warna terdaftar dalam konfigurasi Tailwind dan variabel CSS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {colors.map((c) => (
              <div
                key={c.name}
                className="border border-border rounded-card overflow-hidden shadow-subtle"
              >
                <div
                  className="h-16 flex items-end p-2"
                  style={{ backgroundColor: c.hex }}
                >
                  <span className={`text-xs font-mono font-bold ${c.text}`}>
                    {c.hex}
                  </span>
                </div>
                <div className="p-2.5 bg-surface text-xs">
                  <div className="font-semibold text-deep-green">{c.name}</div>
                  <div className="mt-0.5 text-xs text-text-muted">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>2. Variasi Tombol (Button Variants & Sizes)</CardTitle>
          <CardDescription>
            Dukungan variant primary, secondary, outline, ghost, destructive, brand, beserta state loading dan ikon.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick={() => showButtonFeedback('primary')}>Primary</Button>
            <Button variant="brand" onClick={() => showButtonFeedback('brand')}>Brand</Button>
            <Button variant="secondary" onClick={() => showButtonFeedback('secondary')}>Secondary</Button>
            <Button variant="outline" onClick={() => showButtonFeedback('outline')}>Outline</Button>
            <Button variant="ghost" onClick={() => showButtonFeedback('ghost')}>Ghost</Button>
            <Button variant="destructive" onClick={() => showButtonFeedback('destructive')}>Destructive</Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="primary" size="sm" onClick={() => showButtonFeedback('small')}>Small (sm)</Button>
            <Button variant="primary" size="md" onClick={() => showButtonFeedback('medium')}>Medium (md)</Button>
            <Button variant="primary" size="lg" onClick={() => showButtonFeedback('large')}>Large (lg)</Button>
            <Button variant="primary" isLoading>Menyimpan</Button>
            <Button
              variant="outline"
              leftIcon={<Heart className="w-4 h-4 text-danger" aria-hidden="true" />}
              aria-pressed={isFavorite}
              onClick={() => setIsFavorite((currentValue) => !currentValue)}
            >
              {isFavorite ? 'Difavoritkan' : 'Favorit'}
            </Button>
            <Button
              variant="brand"
              rightIcon={<Sparkles className="w-4 h-4" aria-hidden="true" />}
              onClick={() => showButtonFeedback('aksi utama')}
            >
              Aksi Utama
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Inputs & Forms */}
      <Card>
        <CardHeader>
          <CardTitle>3. Kontrol Form & Validasi</CardTitle>
          <CardDescription>
            Input teks, search, currency Rupiah, select dropdown, dan checkbox dengan label & accessibility.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Input
              label="Nama Lengkap"
              placeholder="Masukkan nama pelanggan..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              helperText="Contoh label dan teks bantu untuk formulir."
            />

            <Input
              label="Harga Produk (Rupiah)"
              isCurrency
              type="number"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              helperText={`Format Rupiah: ${formatRupiah(Number(inputNumber))}`}
            />

            <Input
              label="Pencarian Cepat"
              isSearch
              placeholder="Cari aksesoris atau nota..."
            />

            <Input
              label="Input Error State"
              defaultValue="08123456"
              error="Format nomor HP tidak valid (minimal 10 digit)."
            />

            <Select
              label="Kategori Barang"
              options={[
                { value: 'aksesoris', label: 'Aksesoris & Casing' },
                { value: 'charger', label: 'Charger & Kabel' },
                { value: 'tempered_glass', label: 'Tempered Glass' },
                { value: 'kartu_perdana', label: 'Kartu Perdana / Kuota' },
              ]}
              helperText="Pilih klasifikasi kategori inventaris."
            />

            <div className="space-y-3 pt-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-deep-green mb-1.5">
                Pilihan Checklist
              </span>
              <Checkbox
                label="Simulasi Berjalan Normal"
                description="Nilai contoh ini hanya berlaku pada halaman Design System."
                checked={checkboxChecked}
                onChange={(e) => setCheckboxChecked(e.target.checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Badges & Stat Cards */}
      <Card>
        <CardHeader>
          <CardTitle>4. Status Badges & Kartu Statistik</CardTitle>
          <CardDescription>
            Badge status servis, stok, dan finansial yang tidak hanya mengandalkan warna semata.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="brand" dot>Brand Badge</Badge>
            <Badge variant="success" dot icon={<Check className="w-3.5 h-3.5" />}>Selesai / Aktif</Badge>
            <Badge variant="warning" dot>Pengecekan / Menipis</Badge>
            <Badge variant="danger" dot>Dibatalkan / Habis</Badge>
            <Badge variant="neutral">Netral / Draft</Badge>
            <Badge variant="outline">Garis Tepi</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Nilai Rupiah (contoh)"
              value={formatRupiah(2850000)}
              trend={{ value: '+8.4%', label: 'minggu ini', isPositive: true }}
            />
            <StatCard
              title="Subjudul kartu (contoh)"
              value={formatRupiah(15000000)}
              subtitle="Teks sekunder untuk informasi tambahan"
            />
            <StatCard
              title="Status kartu (contoh)"
              value="142 Item"
              trend={{ value: 'Status positif', isPositive: true }}
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Alerts & Toasts */}
      <Card>
        <CardHeader>
          <CardTitle>5. Feedback & Pemberitahuan (Alert & Toast)</CardTitle>
          <CardDescription>
            Umpan balik inline dan notifikasi toast mengambang saat aksi berhasil atau gagal.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert variant="success" title="Contoh status sukses">
              Pesan sukses ditampilkan tanpa mengubah transaksi atau stok pada Phase A.
            </Alert>
            <Alert variant="warning" title="Contoh status peringatan">
              Gunakan variasi ini untuk informasi yang membutuhkan perhatian pengguna.
            </Alert>
            <Alert variant="danger" title="Contoh status gagal">
              Gunakan variasi ini untuk tindakan yang gagal atau berisiko.
            </Alert>
            <Alert variant="info" title="Keamanan Kunci Layar">
              PIN atau pola kunci layar pelanggan tidak pernah disimpan di sistem.
            </Alert>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({
                  type: 'success',
                  title: 'Contoh sukses',
                  description: 'Feedback berhasil ditampilkan tanpa menyimpan data operasional.',
                })
              }
            >
              Trigger Toast Sukses
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({
                  type: 'warning',
                  title: 'Contoh peringatan',
                  description: 'Feedback peringatan ditampilkan untuk demonstrasi komponen.',
                })
              }
            >
              Trigger Toast Peringatan
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast({
                  type: 'danger',
                  title: 'Contoh kesalahan',
                  description: 'Feedback gagal ditampilkan untuk demonstrasi komponen.',
                })
              }
            >
              Trigger Toast Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 6. Dialogs & Modals */}
      <Card>
        <CardHeader>
          <CardTitle>6. Modal & Dialog Konfirmasi</CardTitle>
          <CardDescription>
            Dialog dengan overlay backdrop, navigasi keyboard Escape, dan tombol konfirmasi yang jelas.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => setIsDialogOpen(true)}>
            Buka Contoh Modal Dialog
          </Button>

          <Button variant="destructive" onClick={() => setIsConfirmOpen(true)}>
            Buka Dialog Konfirmasi Destruktif
          </Button>
        </CardContent>
      </Card>

      {/* 7. Empty State & Loading */}
      <Card>
        <CardHeader>
          <CardTitle>7. Empty State & Loading State</CardTitle>
          <CardDescription>
            Status saat data masih kosong dan indikator animasi skeleton saat loading.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <EmptyState
            title="Contoh empty state"
            description="Komponen ini digunakan saat suatu daftar belum memiliki data untuk ditampilkan."
            actionLabel="Buka Kasir POS"
            onAction={() => navigate('/pos')}
          />

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Skeleton Loading
            </h4>
            <div className="p-4 border border-border rounded-card bg-surface space-y-2.5">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center gap-6 pt-2">
              <Spinner size="sm" label="Memuat data..." />
              <Spinner size="md" label="Memproses data contoh..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standard Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Contoh modal dialog"
        description="Contoh dialog dengan backdrop, fokus keyboard, dan konten yang dapat digulir."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
              Tutup
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsDialogOpen(false);
                toast({
                  type: 'success',
                  title: 'Feedback ditampilkan',
                  description: 'Tidak ada data operasional yang disimpan dari halaman contoh.',
                });
              }}
            >
              Tampilkan Feedback
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-deep-green">
          <div className="p-3 bg-page-bg rounded-control border border-border">
            <span className="font-semibold">Konten contoh:</span> dialog dapat memuat informasi atau kontrol formulir.
          </div>
          <p className="text-xs text-text-muted">
            Tekan <kbd className="rounded border border-border bg-[#EEF3ED] px-1.5 py-0.5 font-mono text-xs">ESC</kbd> pada keyboard atau klik di luar kotak untuk menutup dialog ini.
          </p>
        </div>
      </Dialog>

      {/* Confirm Destructive Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          toast({
            type: 'danger',
            title: 'Aksi contoh dikonfirmasi',
            description: 'Tidak ada data operasional yang diubah pada Phase A.',
          });
        }}
        title="Konfirmasi aksi contoh"
        message="Konfirmasi ini hanya mendemonstrasikan pola tindakan berisiko. Tidak ada data yang akan dihapus pada Phase A."
        confirmText="Konfirmasi"
        cancelText="Batal"
        isDestructive
      />
    </div>
  );
};
