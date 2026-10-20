import React, { useState, useCallback } from 'react';
import { CartItem, Product } from '@/types';
import { useProductStore } from './hooks/useProductStore';
import { useSaleStore } from './hooks/useSaleStore';
import { useSimulation } from '@/app/context/SimulationContext';
import { useToast } from '@/components/ui/Toast';
import { ProductCatalog } from './components/ProductCatalog';
import { CartPanel } from './components/CartPanel';
import { SalesHistory } from './components/SalesHistory';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/Dialog';
import { ShoppingCart, History, RefreshCcw, AlertTriangle } from 'lucide-react';

type ActiveTab = 'pos' | 'history';

export const PosPage: React.FC = () => {
  const { currentUser } = useSimulation();
  const { toast } = useToast();
  const { products, deductStock, lowStockProducts, resetAll: resetProducts } = useProductStore();
  const { sales, recordSale, resetSales, todaySales, todayRevenue } = useSaleStore();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('pos');
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleAddToCart = useCallback(
    (product: Product) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          if (existing.quantity >= product.stock) {
            toast({
              type: 'warning',
              title: 'Stok Tidak Mencukupi',
              description: `Stok ${product.name} tersisa ${product.stock}.`,
            });
            return prev;
          }
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * product.price }
              : i
          );
        }
        return [...prev, { product, quantity: 1, subtotal: product.price }];
      });
    },
    [toast]
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, delta: number) => {
      const product = products.find((p) => p.id === productId);
      setCart((prev) => {
        return prev
          .map((item) => {
            if (item.product.id !== productId) return item;
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (product && newQty > product.stock) {
              toast({
                type: 'warning',
                title: 'Stok Tidak Mencukupi',
                description: `Maks. stok tersedia: ${product.stock}.`,
              });
              return item;
            }
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.product.price,
            };
          })
          .filter(Boolean) as CartItem[];
      });
    },
    [products, toast]
  );

  const handleRemoveItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleCheckout = useCallback(
    (cashReceived: number) => {
      const items = cart.map((ci) => ({
        productId: ci.product.id,
        quantity: ci.quantity,
      }));

      const success = deductStock(items);

      if (!success) {
        toast({
          type: 'danger',
          title: 'Transaksi Gagal',
          description: 'Stok tidak mencukupi — stok tidak diubah.',
          duration: 5000,
        });
        return;
      }

      const sale = recordSale(cart, cashReceived, currentUser.name);
      setCart([]);

      toast({
        type: 'success',
        title: 'Transaksi Berhasil',
        description: `Invoice ${sale.invoiceNumber} telah tersimpan.`,
      });
    },
    [cart, deductStock, recordSale, currentUser.name, toast]
  );

  const handleReset = useCallback(() => {
    resetProducts();
    resetSales();
    setCart([]);
    setIsResetOpen(false);
    toast({ type: 'info', title: 'Data Direset', description: 'Data kembali ke kondisi awal.' });
  }, [resetProducts, resetSales, toast]);

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="brand" dot>Kasir Aktif</Badge>
            {lowStockProducts.length > 0 && (
              <Badge variant="warning" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
                {lowStockProducts.length} produk stok menipis
              </Badge>
            )}
          </div>
          <h2 className="text-2xl font-bold text-deep-green mt-1">Kasir (POS)</h2>
          <p className="text-sm text-text-muted">
            {todaySales.length} transaksi hari ini &nbsp;·&nbsp; Pendapatan {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(todayRevenue)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCcw className="w-4 h-4" />}
            onClick={() => setIsResetOpen(true)}
          >
            Reset Data
          </Button>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <Alert variant="warning" title="Peringatan Stok Menipis">
          {lowStockProducts.map((p) => p.name).join(', ')} — segera lakukan restok.
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-border gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('pos')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pos'
              ? 'border-deep-green text-deep-green'
              : 'border-transparent text-text-muted hover:text-deep-green'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Transaksi Baru
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors relative ${
            activeTab === 'history'
              ? 'border-deep-green text-deep-green'
              : 'border-transparent text-text-muted hover:text-deep-green'
          }`}
        >
          <History className="w-4 h-4" />
          Riwayat
          {sales.length > 0 && (
            <span className="text-[10px] font-bold bg-deep-green text-surface px-1.5 py-0.5 rounded-full">
              {sales.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content */}
      {activeTab === 'pos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 min-h-[600px]">
          {/* Product Catalog */}
          <div className="lg:max-h-[700px] lg:overflow-y-auto">
            <ProductCatalog
              products={products}
              cart={cart}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
          {/* Cart Panel */}
          <div className="lg:max-h-[700px]">
            <CartPanel
              cart={cart}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onCheckout={handleCheckout}
              cashierName={currentUser.name}
            />
          </div>
        </div>
      ) : (
        <SalesHistory sales={sales} />
      )}

      {/* Reset Confirm Dialog */}
      <ConfirmDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Seluruh Data POS?"
        message="Semua riwayat penjualan dan perubahan stok akan dihapus. Data kembali ke kondisi dummy awal. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Reset Data"
        cancelText="Batal"
        isDestructive
      />
    </div>
  );
};
