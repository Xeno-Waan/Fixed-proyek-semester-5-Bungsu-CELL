import React, { useMemo, useState } from 'react';
import { Product, CartItem, ProductCategory } from '@/types';
import { formatRupiah } from '@/lib/currency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Plus, Minus, ShoppingCart, AlertTriangle, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCatalogProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  aksesoris: 'Aksesoris',
  casing: 'Casing',
  charger: 'Charger',
  tempered_glass: 'Tempered Glass',
  kartu_perdana: 'Kartu Perdana',
  voucher_fisik: 'Voucher',
};

const ALL_CATEGORIES = 'all';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  cart,
  onAddToCart,
  onUpdateQuantity,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === ALL_CATEGORIES || p.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, activeCategory]);

  const getCartQty = (productId: string) =>
    cart.find((i) => i.product.id === productId)?.quantity ?? 0;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search & Filter */}
      <div className="space-y-2">
        <Input
          isSearch
          placeholder="Cari nama atau kode produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Cari produk di katalog"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveCategory(ALL_CATEGORIES)}
            className={cn(
              'text-xs px-3 py-1 rounded-full border font-medium transition-colors',
              activeCategory === ALL_CATEGORIES
                ? 'bg-deep-green text-surface border-deep-green'
                : 'border-border text-text-muted hover:border-deep-green hover:text-deep-green'
            )}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'text-xs px-3 py-1 rounded-full border font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-deep-green text-surface border-deep-green'
                  : 'border-border text-text-muted hover:border-deep-green hover:text-deep-green'
              )}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="w-6 h-6" />}
          title="Produk Tidak Ditemukan"
          description="Coba ubah kata kunci atau filter kategori."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1">
          {filtered.map((product) => {
            const qty = getCartQty(product.id);
            const isLowStock = product.stock <= product.minStock;
            const isOutOfStock = product.stock === 0;

            return (
              <div
                key={product.id}
                className={cn(
                  'relative border rounded-card p-3.5 bg-surface transition-all',
                  isOutOfStock
                    ? 'opacity-60 border-border'
                    : 'hover:border-[#B5D4A8] hover:shadow-subtle cursor-pointer border-border',
                  qty > 0 && !isOutOfStock && 'border-deep-green/30 ring-1 ring-deep-green/15'
                )}
              >
                {isLowStock && !isOutOfStock && (
                  <div className="absolute top-2 right-2">
                    <AlertTriangle className="w-4 h-4 text-warning" aria-label="Stok menipis" />
                  </div>
                )}

                <div className="space-y-0.5 mb-2.5">
                  <p className="text-xs text-text-muted font-mono">{product.code}</p>
                  <p className="text-sm font-semibold text-deep-green leading-snug line-clamp-2">
                    {product.name}
                  </p>
                  <Badge
                    variant={isOutOfStock ? 'danger' : isLowStock ? 'warning' : 'neutral'}
                    size="sm"
                    dot
                  >
                    {isOutOfStock
                      ? 'Stok habis'
                      : isLowStock
                      ? `Sisa ${product.stock} ${product.unit}`
                      : `Stok: ${product.stock} ${product.unit}`}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-deep-green">
                    {formatRupiah(product.price)}
                  </span>

                  {qty === 0 ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={isOutOfStock}
                      onClick={() => onAddToCart(product)}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Tambah
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="w-7 h-7 rounded-control border border-border bg-page-bg flex items-center justify-center text-deep-green hover:bg-[#E8F0E5] transition-colors"
                        aria-label={`Kurangi ${product.name}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-deep-green w-6 text-center">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        disabled={qty >= product.stock}
                        className="w-7 h-7 rounded-control border border-border bg-page-bg flex items-center justify-center text-deep-green hover:bg-[#E8F0E5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label={`Tambah ${product.name}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart summary badge - mobile */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-2 bg-deep-green text-surface px-4 py-2.5 rounded-full shadow-dropdown text-sm font-semibold">
            <ShoppingCart className="w-4 h-4" />
            {cart.reduce((s, i) => s + i.quantity, 0)} item di keranjang
          </div>
        </div>
      )}
    </div>
  );
};
