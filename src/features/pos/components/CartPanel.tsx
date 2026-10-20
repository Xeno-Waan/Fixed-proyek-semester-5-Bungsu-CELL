import React, { useState } from 'react';
import { CartItem } from '@/types';
import { formatRupiah, parseRupiah } from '@/lib/currency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Dialog } from '@/components/ui/Dialog';
import { ShoppingCart, Trash2, CheckCircle2 } from 'lucide-react';

interface CartPanelProps {
  cart: CartItem[];
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (cashReceived: number) => void;
  cashierName: string;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  onRemoveItem,
  onClearCart,
  onCheckout,
  cashierName,
}) => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [cashInput, setCashInput] = useState('');
  const [cashError, setCashError] = useState('');

  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cashReceived = parseRupiah(cashInput);
  const change = cashReceived - totalAmount;
  const canCheckout = cart.length > 0 && cashReceived >= totalAmount;

  const handleOpenPayment = () => {
    setCashInput(String(totalAmount));
    setCashError('');
    setIsPaymentOpen(true);
  };

  const handleConfirmPayment = () => {
    if (cashReceived < totalAmount) {
      setCashError('Uang yang diterima kurang dari total pembayaran.');
      return;
    }
    onCheckout(cashReceived);
    setIsPaymentOpen(false);
    setCashInput('');
    setCashError('');
  };

  return (
    <>
      <div className="flex flex-col h-full bg-surface border border-border rounded-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/80 bg-[#FAFCF9]">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-deep-green" />
            <h2 className="text-base font-bold text-deep-green">Keranjang</h2>
          </div>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs text-danger hover:text-opacity-80 font-medium transition-colors"
              aria-label="Kosongkan keranjang"
            >
              Kosongkan
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          {cart.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={<ShoppingCart className="w-6 h-6" />}
                title="Keranjang Kosong"
                description="Pilih produk dari katalog untuk memulai transaksi."
              />
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-start gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-deep-green leading-snug line-clamp-2">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {formatRupiah(item.product.price)} × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-deep-green">
                    {formatRupiah(item.subtotal)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1 rounded text-text-muted hover:text-danger transition-colors"
                    aria-label={`Hapus ${item.product.name} dari keranjang`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Total & Checkout */}
        <div className="p-4 border-t border-border bg-[#FAFCF9] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">
              {cart.reduce((s, i) => s + i.quantity, 0)} item
            </span>
            <div className="text-right">
              <p className="text-xs text-text-muted">Total Pembayaran</p>
              <p className="text-2xl font-extrabold text-deep-green tracking-tight">
                {formatRupiah(totalAmount)}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            className="w-full"
            disabled={cart.length === 0}
            onClick={handleOpenPayment}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Proses Pembayaran
          </Button>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Proses Pembayaran"
        description={`Kasir: ${cashierName}`}
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsPaymentOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!canCheckout}
              onClick={handleConfirmPayment}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Selesaikan Transaksi
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="p-3 rounded-control bg-page-bg border border-border space-y-1.5">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-xs text-deep-green">
                <span className="truncate flex-1 pr-2">
                  {item.product.name} ×{item.quantity}
                </span>
                <span className="font-semibold shrink-0">{formatRupiah(item.subtotal)}</span>
              </div>
            ))}
            <div className="border-t border-border/70 pt-1.5 flex justify-between text-sm font-bold text-deep-green">
              <span>Total</span>
              <span>{formatRupiah(totalAmount)}</span>
            </div>
          </div>

          {/* Cash input */}
          <Input
            label="Uang yang Diterima (Rp)"
            isCurrency
            type="number"
            value={cashInput}
            onChange={(e) => {
              setCashInput(e.target.value);
              setCashError('');
            }}
            error={cashError}
            helperText="Isi nominal uang tunai dari pelanggan."
          />

          {/* Change */}
          {cashReceived >= totalAmount && (
            <Alert variant="success" title="Kembalian">
              <span className="text-lg font-extrabold text-success">
                {formatRupiah(change)}
              </span>
            </Alert>
          )}
          {cashReceived > 0 && cashReceived < totalAmount && (
            <Alert variant="danger" title="Kurang Bayar">
              Masih kurang <strong>{formatRupiah(totalAmount - cashReceived)}</strong>
            </Alert>
          )}
        </div>
      </Dialog>
    </>
  );
};
