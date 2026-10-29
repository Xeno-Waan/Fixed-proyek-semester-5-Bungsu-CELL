// src/features/service/components/ServiceReceiptModal.tsx
import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { ServiceOrder } from '@/types';
import { formatRupiah } from '@/lib/currency';
import { Printer, ShieldCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface Props {
  order: ServiceOrder | null;
  onClose: () => void;
}

export const ServiceReceiptModal: React.FC<Props> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = () => {
    switch (order.status) {
      case 'selesai':
        return <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>Selesai</Badge>;
      case 'proses_perbaikan':
        return <Badge variant="warning" icon={<Clock className="w-3.5 h-3.5" />}>Proses Perbaikan</Badge>;
      case 'dibatalkan':
        return <Badge variant="danger" icon={<AlertCircle className="w-3.5 h-3.5" />}>Dibatalkan</Badge>;
      default:
        return <Badge variant="brand" icon={<Clock className="w-3.5 h-3.5" />}>Pengecekan</Badge>;
    }
  };

  const footer = (
    <div className="flex items-center justify-between w-full print:hidden">
      <span className="text-xs text-text-muted">Tekan Cetak untuk print thermal / PDF</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Tutup
        </Button>
        <Button variant="brand" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
          Cetak Nota
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog
      isOpen={!!order}
      onClose={onClose}
      title="Pratinjau Nota Servis"
      description={`Nomor Nota: ${order.invoiceNumber}`}
      maxWidth="md"
      footer={footer}
    >
      <div className="printable-receipt bg-surface text-deep-green border border-border rounded-control p-6 font-sans space-y-4">
        {/* Receipt Header */}
        <div className="text-center border-b border-border pb-4">
          <h2 className="text-xl font-bold tracking-tight text-deep-green">BUNGSU CELL</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Spesialis Servis Smartphone, Aksesoris & Agen PPOB
          </p>
          <p className="text-[11px] text-text-muted">
            Jl. Raya Perintis, Kios No. 04 · Telp/WA: 0812-3456-7890
          </p>
          <div className="mt-2 inline-block px-3 py-1 bg-brand-green/50 text-deep-green font-mono text-xs font-bold rounded-control border border-border">
            TANDA TERIMA SERVIS: {order.invoiceNumber}
          </div>
        </div>

        {/* Customer & Unit Info */}
        <div className="grid grid-cols-2 gap-3 text-xs border-b border-border pb-4">
          <div>
            <span className="text-text-muted block text-[11px]">Nama Pelanggan:</span>
            <span className="font-semibold text-deep-green text-sm">{order.customerName}</span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">No. Telepon / WhatsApp:</span>
            <span className="font-mono text-deep-green">{order.customerPhone}</span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">Perangkat:</span>
            <span className="font-semibold text-deep-green">{order.deviceBrand} {order.deviceType}</span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">Tanggal Masuk:</span>
            <span className="text-deep-green">{formatDate(order.receivedDate)}</span>
          </div>
          <div>
            <span className="text-text-muted block text-[11px]">Status Saat Ini:</span>
            <div className="mt-0.5">{getStatusBadge()}</div>
          </div>
          {order.completionDate && (
            <div>
              <span className="text-text-muted block text-[11px]">Tanggal Selesai:</span>
              <span className="text-deep-green">{formatDate(order.completionDate)}</span>
            </div>
          )}
        </div>

        {/* Complaints & Notes */}
        <div className="space-y-2 text-xs border-b border-border pb-4">
          <div>
            <span className="text-text-muted block text-[11px] font-medium">Keluhan / Kerusakan:</span>
            <p className="bg-page-bg p-2 rounded-control border border-border text-deep-green mt-1">
              {order.complaint || 'Tidak ada catatan keluhan khusus.'}
            </p>
          </div>
          {order.technicianNote && (
            <div>
              <span className="text-text-muted block text-[11px] font-medium">Catatan Teknisi:</span>
              <p className="bg-brand-green/20 p-2 rounded-control border border-border text-deep-green mt-1">
                {order.technicianNote}
              </p>
            </div>
          )}
        </div>

        {/* Cost Summary */}
        <div className="bg-page-bg p-3 rounded-control border border-border flex items-center justify-between">
          <span className="text-xs text-text-muted">
            {order.status === 'selesai' ? 'Total Biaya Servis:' : 'Estimasi Biaya Servis:'}
          </span>
          <span className="text-lg font-bold text-deep-green font-mono">
            {formatRupiah(order.finalCost ?? order.estimatedCost)}
          </span>
        </div>

        {/* Security Notice per PRD 4.3 */}
        <div className="bg-[#FFFDF3] border border-[#FFE7A3] p-3 rounded-control text-[11px] text-[#7A4E00] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#A66B00] shrink-0 mt-0.5" />
          <div>
            <strong className="block text-[#573700]">Batasan Keamanan Kunci Layar:</strong>
            Konter Bungsu Cell <u>TIDAK PERNAH</u> meminta atau menyimpan PIN/pola kunci layar perangkat Anda. Pelanggan dipersilakan membuka kunci perangkat sendiri saat pengujian unit.
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 pt-4 text-center text-xs text-text-muted">
          <div>
            <p>Pelanggan,</p>
            <div className="h-12"></div>
            <p className="font-semibold text-deep-green">({order.customerName})</p>
          </div>
          <div>
            <p>Petugas Bungsu Cell,</p>
            <div className="h-12"></div>
            <p className="font-semibold text-deep-green">(Petugas Konter)</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
