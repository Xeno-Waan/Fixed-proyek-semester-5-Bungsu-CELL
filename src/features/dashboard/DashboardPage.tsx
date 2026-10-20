import React, { useMemo } from 'react';
import { useProductStore } from '@/features/pos/hooks/useProductStore';
import { useSaleStore } from '@/features/pos/hooks/useSaleStore';
import { formatRupiah } from '@/lib/currency';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { SimpleBarChart } from '@/components/ui/SimpleBarChart';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  ShoppingCart,
  Boxes,
  Wrench,
  TrendingUp,
  AlertTriangle,
  BarChart2,
  Receipt,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { SaleItem } from '@/types';

function formatShortRupiah(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}jt`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}rb`;
  return String(v);
}

/** Get last N days as YYYY-MM-DD strings */
function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (n - 1 - i));
    return d.toISOString().slice(0, 10);
  });
}

export const DashboardPage: React.FC = () => {
  const { products, lowStockProducts } = useProductStore();
  const { sales, todaySales, todayRevenue } = useSaleStore();

  const totalProductCount = products.length;

  // Revenue per day for last 7 days
  const revenueTrend = useMemo(() => {
    const days = lastNDays(7);
    return days.map((day) => {
      const daySales = sales.filter((s) => s.date.startsWith(day));
      return {
        label: day.slice(5), // MM-DD
        value: daySales.reduce((sum, s) => sum + s.totalAmount, 0),
      };
    });
  }, [sales]);

  // Top selling products (by quantity)
  const topProducts = useMemo<Array<{ name: string; qty: number; revenue: number }>>(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    sales.forEach((sale) => {
      sale.items.forEach((item: SaleItem) => {
        if (!map[item.productId]) {
          map[item.productId] = { name: item.productName, qty: 0, revenue: 0 };
        }
        map[item.productId].qty += item.quantity;
        map[item.productId].revenue += item.subtotal;
      });
    });
    return Object.values(map)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [sales]);

  const topProductChartData = topProducts.map((p) => ({
    label: p.name.split(' ').slice(0, 2).join(' '),
    value: p.qty,
  }));

  // Category sales breakdown
  const categorySales = useMemo<Array<{ label: string; value: number }>>(() => {
    const map: Record<string, number> = {};
    sales.forEach((s) =>
      s.items.forEach((i: SaleItem) => {
        map[i.category] = (map[i.category] ?? 0) + i.subtotal;
      })
    );
    return Object.entries(map)
      .map(([k, v]) => ({ label: k, value: v }))
      .sort((a, b) => b.value - a.value);
  }, [sales]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-card bg-deep-green text-surface flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[#A6C5B2] text-xs font-semibold uppercase tracking-wider">
            Bungsu Cell · Dashboard Operasional
          </p>
          <h2 className="text-2xl font-bold mt-1">Selamat datang kembali</h2>
          <p className="text-sm text-[#D0E0D6] mt-0.5">
            Ringkasan aktivitas konter hari ini — data diperbarui secara langsung.
          </p>
        </div>
        <Link to="/pos">
          <Button variant="brand" rightIcon={<ShoppingCart className="w-4 h-4" />}>
            Buka Kasir
          </Button>
        </Link>
      </div>

      {/* Low stock alerts */}
      {lowStockProducts.length > 0 && (
        <Alert variant="warning" title={`${lowStockProducts.length} Produk Stok Menipis`}>
          {lowStockProducts.map((p) => `${p.name} (sisa ${p.stock})`).join(' · ')}
          {' '}—{' '}
          <Link to="/inventory" className="underline font-medium">
            Kelola Inventaris
          </Link>
        </Alert>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Penjualan Hari Ini"
          value={formatRupiah(todayRevenue)}
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle={`${todaySales.length} transaksi`}
        />
        <StatCard
          title="Total Transaksi"
          value={`${sales.length} invoice`}
          icon={<Receipt className="w-5 h-5" />}
          subtitle="Seluruh periode data"
        />
        <StatCard
          title="Produk Terdaftar"
          value={`${totalProductCount} produk`}
          icon={<Boxes className="w-5 h-5" />}
          trend={
            lowStockProducts.length > 0
              ? { value: `${lowStockProducts.length} menipis`, isPositive: false }
              : { value: 'Semua stok aman', isPositive: true }
          }
        />
        <StatCard
          title="Modul Aktif"
          value="4 Modul"
          icon={<Wrench className="w-5 h-5" />}
          subtitle="POS · Stok · Servis · Keuangan"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-deep-green" />
              <CardTitle>Tren Pendapatan (7 Hari)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <EmptyState
                title="Belum Ada Data Penjualan"
                description="Selesaikan transaksi di Kasir POS untuk melihat grafik tren."
              />
            ) : (
              <SimpleBarChart
                data={revenueTrend}
                height={140}
                color="#183D2A"
                formatValue={formatShortRupiah}
              />
            )}
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-deep-green" />
              <CardTitle>Produk Terlaris (Qty)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <EmptyState
                title="Belum Ada Data Produk Terjual"
                description="Data akan muncul setelah transaksi pertama berhasil."
              />
            ) : (
              <>
                <SimpleBarChart
                  data={topProductChartData}
                  height={120}
                  color="#287A45"
                  formatValue={(v) => String(v)}
                />
                <div className="mt-3 space-y-1.5">
                  {topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-page-bg border border-border flex items-center justify-center text-[10px] font-bold text-deep-green">
                          {i + 1}
                        </span>
                        <span className="text-deep-green font-medium line-clamp-1 max-w-[140px]">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-text-muted font-mono">
                        {p.qty}× · {formatRupiah(p.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category breakdown */}
      {categorySales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <SimpleBarChart
              data={categorySales.map((c) => ({ label: c.label, value: c.value }))}
              height={120}
              color="#A66B00"
              formatValue={formatShortRupiah}
            />
          </CardContent>
        </Card>
      )}

      {/* Low stock detail table */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <CardTitle>Detail Produk Stok Menipis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-border bg-[#FAFCF9] text-xs font-semibold uppercase tracking-wider text-text-muted">
                  <th className="px-4 py-2.5 text-left">Produk</th>
                  <th className="px-4 py-2.5 text-center">Stok Saat Ini</th>
                  <th className="px-4 py-2.5 text-center">Min. Stok</th>
                  <th className="px-4 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {lowStockProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-page-bg transition-colors">
                    <td className="px-4 py-2.5 font-medium text-deep-green">{p.name}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-warning">
                      {p.stock} {p.unit}
                    </td>
                    <td className="px-4 py-2.5 text-center text-text-muted">
                      {p.minStock} {p.unit}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge variant={p.stock === 0 ? 'danger' : 'warning'} size="sm" dot>
                        {p.stock === 0 ? 'Habis' : 'Menipis'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
