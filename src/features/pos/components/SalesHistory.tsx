import React, { useState } from 'react';
import { Sale } from '@/types';
import { formatRupiah } from '@/lib/currency';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Receipt, Eye } from 'lucide-react';

interface SalesHistoryProps {
  sales: Sale[];
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [search, setSearch] = useState('');

  const filtered = sales.filter(
    (s) =>
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-deep-green" />
              <CardTitle>Riwayat Penjualan</CardTitle>
            </div>
            <Badge variant="neutral">{sales.length} transaksi</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <Input
            isSearch
            placeholder="Cari nomor invoice atau produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Cari riwayat transaksi"
          />

          {filtered.length === 0 ? (
            <EmptyState
              icon={<Receipt className="w-6 h-6" />}
              title="Belum Ada Riwayat Transaksi"
              description="Selesaikan transaksi pertama melalui keranjang kasir."
            />
          ) : (
            <div className="overflow-x-auto rounded-control border border-border">
              <table className="w-full text-sm text-left" role="table">
                <thead>
                  <tr className="bg-[#FAFCF9] border-b border-border text-xs font-semibold uppercase tracking-wider text-text-muted">
                    <th className="px-3 py-2.5">Invoice</th>
                    <th className="px-3 py-2.5">Waktu</th>
                    <th className="px-3 py-2.5">Item</th>
                    <th className="px-3 py-2.5 text-right">Total</th>
                    <th className="px-3 py-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.map((sale) => (
                    <tr key={sale.id} className="hover:bg-page-bg transition-colors">
                      <td className="px-3 py-2.5 font-mono text-xs text-deep-green">
                        {sale.invoiceNumber}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-text-muted whitespace-nowrap">
                        {formatDate(sale.date)}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-text-muted">
                        {sale.items.length} produk
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-deep-green whitespace-nowrap">
                        {formatRupiah(sale.totalAmount)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedSale(sale)}
                          className="inline-flex items-center gap-1 text-xs text-deep-green hover:underline"
                          aria-label={`Detail invoice ${sale.invoiceNumber}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sale Detail Dialog */}
      {selectedSale && (
        <Dialog
          isOpen={!!selectedSale}
          onClose={() => setSelectedSale(null)}
          title={`Invoice ${selectedSale.invoiceNumber}`}
          description={`Kasir: ${selectedSale.cashierName} • ${formatDate(selectedSale.date)}`}
          maxWidth="sm"
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedSale(null)}>
              Tutup
            </Button>
          }
        >
          <div className="space-y-3">
            <div className="rounded-control border border-border divide-y divide-border/60">
              {selectedSale.items.map((item) => (
                <div key={item.productId} className="flex justify-between px-3 py-2 text-sm">
                  <div>
                    <p className="font-medium text-deep-green">{item.productName}</p>
                    <p className="text-xs text-text-muted">
                      {formatRupiah(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-deep-green">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className="p-3 bg-page-bg rounded-control border border-border space-y-1.5 text-sm">
              <div className="flex justify-between font-bold text-deep-green">
                <span>Total</span>
                <span>{formatRupiah(selectedSale.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Bayar</span>
                <span>{formatRupiah(selectedSale.cashReceived)}</span>
              </div>
              <div className="flex justify-between font-semibold text-success">
                <span>Kembalian</span>
                <span>{formatRupiah(selectedSale.change)}</span>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};
