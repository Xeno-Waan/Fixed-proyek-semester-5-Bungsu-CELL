import { useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Sale, CartItem } from '@/types';

/**
 * Sales history state management.
 * Reference: docs/IMPLEMENTATION_PLAN.md Kontrak Domain POS
 */

let invoiceCounter = 1;

function generateInvoiceNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const seq = String(invoiceCounter++).padStart(3, '0');
  return `INV-${date}-${seq}`;
}

export function useSaleStore() {
  const [sales, setSales, resetSales] = useLocalStorage<Sale[]>('bungsu_sales', []);

  const recordSale = useCallback(
    (cart: CartItem[], cashReceived: number, cashierName: string): Sale => {
      const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const change = cashReceived - totalAmount;

      const newSale: Sale = {
        id: `sale-${Date.now()}`,
        invoiceNumber: generateInvoiceNumber(),
        date: new Date().toISOString(),
        items: cart.map((ci) => ({
          productId: ci.product.id,
          productName: ci.product.name,
          category: ci.product.category,
          unitPrice: ci.product.price,
          quantity: ci.quantity,
          subtotal: ci.subtotal,
        })),
        totalAmount,
        cashReceived,
        change,
        cashierName,
      };

      setSales((prev) => [newSale, ...prev]);
      return newSale;
    },
    [setSales]
  );

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  const todaySales = sales.filter((s) => {
    const saleDate = new Date(s.date).toDateString();
    return saleDate === new Date().toDateString();
  });

  const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);

  return {
    sales,
    recordSale,
    resetSales,
    totalRevenue,
    todaySales,
    todayRevenue,
  };
}
