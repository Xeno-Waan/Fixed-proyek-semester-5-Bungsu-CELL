import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Product, StockMovement } from '@/types';
import { initialProducts } from '@/data/products';

/**
 * Product & stock state management with localStorage persistence.
 * Business rules enforced:
 *  - Stock only decremented after a successful transaction
 *  - Low-stock warning when stock <= minStock
 *  - Stock cannot go below 0
 * Reference: docs/IMPLEMENTATION_PLAN.md Kontrak Domain POS & Inventaris
 */
export function useProductStore() {
  const [products, setProducts, resetProducts] = useLocalStorage<Product[]>(
    'bungsu_products',
    initialProducts
  );
  const [movements, setMovements, resetMovements] = useLocalStorage<StockMovement[]>(
    'bungsu_stock_movements',
    []
  );

  /** Deduct stock for multiple items. Returns false if ANY item has insufficient stock.
   *  Entire deduction is atomic — no partial updates on failure. */
  const deductStock = useCallback(
    (items: Array<{ productId: string; quantity: number }>): boolean => {
      // Validate all items first before mutating
      for (const { productId, quantity } of items) {
        const product = products.find((p) => p.id === productId);
        if (!product) return false;
        if (quantity <= 0) return false;
        if (product.stock < quantity) return false;
      }

      const timestamp = new Date().toISOString();
      const newMovements: StockMovement[] = [];

      setProducts((prev) =>
        prev.map((product) => {
          const item = items.find((i) => i.productId === product.id);
          if (!item) return product;
          const newStock = product.stock - item.quantity;
          newMovements.push({
            id: `mov-${Date.now()}-${product.id}`,
            productId: product.id,
            type: 'out',
            quantity: item.quantity,
            previousStock: product.stock,
            currentStock: newStock,
            note: 'Penjualan POS',
            timestamp,
          });
          return { ...product, stock: newStock };
        })
      );

      setMovements((prev) => [...prev, ...newMovements]);
      return true;
    },
    [products, setProducts, setMovements]
  );

  /** Add stock (e.g. restocking) */
  const addStock = useCallback(
    (productId: string, quantity: number, note = 'Penambahan stok') => {
      if (quantity <= 0) return;
      const timestamp = new Date().toISOString();
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          const newStock = p.stock + quantity;
          setMovements((prevMov) => [
            ...prevMov,
            {
              id: `mov-${Date.now()}-${p.id}`,
              productId: p.id,
              type: 'in',
              quantity,
              previousStock: p.stock,
              currentStock: newStock,
              note,
              timestamp,
            },
          ]);
          return { ...p, stock: newStock };
        })
      );
    },
    [setProducts, setMovements]
  );

  /** Products with stock at or below minimum */
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);

  /** Reset all product data to initial dummy data */
  const resetAll = useCallback(() => {
    resetProducts();
    resetMovements();
  }, [resetProducts, resetMovements]);

  return {
    products,
    movements,
    deductStock,
    addStock,
    lowStockProducts,
    resetAll,
  };
}
