import React, { useState } from 'react';
import { Product, ProductCategory } from '@/types';
import { useProductStore } from '@/features/pos/hooks/useProductStore';
import { useToast } from '@/components/ui/Toast';
import { formatRupiah } from '@/lib/currency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Dialog } from '@/components/ui/Dialog';
import { AlertTriangle, Plus, RefreshCcw, PackageOpen, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmDialog } from '@/components/ui/Dialog';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  aksesoris: 'Aksesoris',
  casing: 'Casing',
  charger: 'Charger',
  tempered_glass: 'Tempered Glass',
  kartu_perdana: 'Kartu Perdana',
  voucher_fisik: 'Voucher',
};

interface StockAdjustModalProps {
  product: Product | null;
  onClose: () => void;
  onConfirm: (qty: number, note: string) => void;
}

const StockAdjustModal: React.FC<StockAdjustModalProps> = ({ product, onClose, onConfirm }) => {
  const [qty, setQty] = useState('1');
  const [note, setNote] = useState('Penambahan stok manual');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const n = parseInt(qty, 10);
    if (!n || n <= 0) {
      setError('Jumlah harus lebih dari 0.');
      return;
    }
    onConfirm(n, note || 'Penambahan stok');
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog
      isOpen={!!product}
      onClose={onClose}
      title="Tambah Stok Masuk"
      description={product.name}
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Batal</Button>
          <Button variant="primary" size="sm" onClick={handleConfirm} leftIcon={<ArrowUp className="w-4 h-4" />}>
            Tambah Stok
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="p-3 rounded-control bg-page-bg border border-border text-sm">
          <p className="text-text-muted">Stok saat ini</p>
          <p className="text-xl font-bold text-deep-green">{product.stock} {product.unit}</p>
        </div>
        <Input
          label="Jumlah Penambahan"
          type="number"
          min="1"
          value={qty}
          onChange={(e) => { setQty(e.target.value); setError(''); }}
          error={error}
        />
        <Input
          label="Keterangan"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Misal: Restock dari supplier"
        />
      </div>
    </Dialog>
  );
};

export const InventoryPage: React.FC = () => {
  const { toast } = useToast();
  const { products, lowStockProducts, addStock, resetAll } = useProductStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'ok'>('all');
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const filtered = products.filter((p) => {
    const matchSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
    const matchStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? p.stock <= p.minStock
        : p.stock > p.minStock;
    return matchSearch && matchCat && matchStock;
  });

  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    ...Array.from(new Set(products.map((p) => p.category))).map((cat) => ({
      value: cat,
      label: CATEGORY_LABELS[cat],
    })),
  ];

  const handleAddStock = (qty: number, note: string) => {
    if (!adjustProduct) return;
    addStock(adjustProduct.id, qty, note);
    toast({
      type: 'success',
      title: 'Stok Ditambahkan',
      description: `+${qty} ${adjustProduct.unit} untuk ${adjustProduct.name}.`,
    });
  };

  const handleReset = () => {
    resetAll();
    setIsResetOpen(false);
    toast({ type: 'info', title: 'Stok Direset', description: 'Semua stok kembali ke data awal.' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand" dot>Inventaris</Badge>
            {lowStockProducts.length > 0 && (
              <Badge variant="warning" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                {lowStockProducts.length} stok menipis
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-bold text-deep-green mt-1">Manajemen Stok</h2>
          <p className="text-sm text-text-muted">{products.length} produk terdaftar</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCcw className="w-4 h-4" />}
          onClick={() => setIsResetOpen(true)}
        >
          Reset Stok
        </Button>
      </div>

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <Alert variant="warning" title="Peringatan: Produk Stok Menipis">
          Segera lakukan restok pada:{' '}
          <strong>{lowStockProducts.map((p) => `${p.name} (sisa ${p.stock})`).join(' • ')}</strong>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1">
          <Input
            isSearch
            placeholder="Cari kode atau nama produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari produk di inventaris"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter kategori"
          />
        </div>
        <div className="w-full sm:w-40">
          <Select
            options={[
              { value: 'all', label: 'Semua Status' },
              { value: 'low', label: 'Stok Menipis' },
              { value: 'ok', label: 'Stok Aman' },
            ]}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'ok')}
            aria-label="Filter status stok"
          />
        </div>
      </div>

      {/* Inventory Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<PackageOpen className="w-6 h-6" />}
          title="Produk Tidak Ditemukan"
          description="Coba ubah kata kunci atau filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-card border border-border bg-surface">
          <table className="w-full text-sm text-left" role="table" aria-label="Tabel inventaris produk">
            <thead>
              <tr className="bg-[#FAFCF9] border-b border-border">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Kode
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Nama Produk
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Kategori
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">
                  Harga Jual
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted text-center">
                  Stok
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted text-center">
                  Min. Stok
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted text-center">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((product) => {
                const isLow = product.stock <= product.minStock;
                const isOut = product.stock === 0;
                return (
                  <tr
                    key={product.id}
                    className={cn(
                      'hover:bg-page-bg transition-colors',
                      isOut ? 'bg-[#FDF5F4]' : isLow ? 'bg-[#FFFBEE]' : ''
                    )}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">
                      {product.code}
                    </td>
                    <td className="px-4 py-3 font-medium text-deep-green max-w-[200px]">
                      <p className="line-clamp-2">{product.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral" size="sm">
                        {CATEGORY_LABELS[product.category]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-deep-green whitespace-nowrap">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'text-base font-extrabold',
                          isOut ? 'text-danger' : isLow ? 'text-warning' : 'text-success'
                        )}
                      >
                        {product.stock}
                      </span>
                      <span className="text-xs text-text-muted ml-1">{product.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-text-muted">
                      {product.minStock} {product.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={isOut ? 'danger' : isLow ? 'warning' : 'success'}
                        size="sm"
                        dot
                      >
                        {isOut ? 'Habis' : isLow ? 'Menipis' : 'Aman'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                        onClick={() => setAdjustProduct(product)}
                      >
                        Stok Masuk
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Adjust Modal */}
      <StockAdjustModal
        product={adjustProduct}
        onClose={() => setAdjustProduct(null)}
        onConfirm={handleAddStock}
      />

      {/* Reset Confirm */}
      <ConfirmDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Seluruh Data Stok?"
        message="Stok semua produk akan dikembalikan ke nilai awal dummy. Riwayat perubahan stok juga akan dihapus. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Reset Stok"
        cancelText="Batal"
        isDestructive
      />
    </div>
  );
};
