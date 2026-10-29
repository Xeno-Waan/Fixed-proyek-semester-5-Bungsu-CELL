// src/features/service/components/ServiceDetail.tsx
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ServiceOrder, ServiceStatus } from '@/types';
import { useServiceStore } from '@/features/service/hooks/useServiceStore';
import { formatRupiah } from '@/lib/currency';
import {
  Printer,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { ServiceReceiptModal } from './ServiceReceiptModal';
import { ServiceWhatsAppModal } from './ServiceWhatsAppModal';
import { useToast } from '@/components/ui/Toast';

interface Props {
  order: ServiceOrder;
  onClose: () => void;
}

export const ServiceDetail: React.FC<Props> = ({ order, onClose }) => {
  const { updateStatus } = useServiceStore();
  const { toast } = useToast();

  const [techNote, setTechNote] = useState(order.technicianNote || '');
  const [finalCost, setFinalCost] = useState(String(order.finalCost ?? order.estimatedCost));
  const [showReceipt, setShowReceipt] = useState(false);
  const [showWa, setShowWa] = useState(false);

  const handleStatusChange = (newStatus: ServiceStatus, defaultNote: string) => {
    const cost = parseFloat(finalCost) || order.estimatedCost;
    const note = techNote.trim() || defaultNote;
    updateStatus(order.id, newStatus, note, 'Rahmat (Teknisi)', cost);
    toast({
      type: 'success',
      title: 'Status Diperbarui',
      description: `Status nota ${order.invoiceNumber} diubah ke ${newStatus.replace('_', ' ')}.`,
    });
    onClose();
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => setShowReceipt(true)}
        >
          Cetak Nota
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<MessageSquare className="w-4 h-4" />}
          onClick={() => setShowWa(true)}
        >
          Kirim WA (Simulasi)
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        {order.status === 'pengecekan' && (
          <Button
            variant="brand"
            size="sm"
            onClick={() => handleStatusChange('proses_perbaikan', 'Pengecekan selesai, memulai perbaikan sparepart')}
          >
            Mulai Perbaikan
          </Button>
        )}
        {order.status === 'proses_perbaikan' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleStatusChange('selesai', 'Perbaikan rampung dan unit telah lolos uji coba teknisi')}
          >
            Tandai Selesai
          </Button>
        )}
        {(order.status === 'pengecekan' || order.status === 'proses_perbaikan') && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleStatusChange('dibatalkan', 'Servis dibatalkan atas kesepakatan pelanggan/part tidak tersedia')}
          >
            Batalkan
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onClose}>
          Tutup
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Dialog
        isOpen={true}
        onClose={onClose}
        title={`Detail Servis: ${order.invoiceNumber}`}
        description={`${order.customerName} (${order.customerPhone})`}
        maxWidth="lg"
        footer={footer}
      >
        <div className="space-y-4 text-xs font-sans">
          {/* Header Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-page-bg rounded-control border border-border">
            <div>
              <span className="text-text-muted block text-[11px]">Perangkat:</span>
              <span className="font-semibold text-deep-green text-sm">{order.deviceBrand} {order.deviceType}</span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Status Saat Ini:</span>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Estimasi Biaya:</span>
              <span className="font-bold text-deep-green font-mono">{formatRupiah(order.estimatedCost)}</span>
            </div>
            <div>
              <span className="text-text-muted block text-[11px]">Tanggal Masuk:</span>
              <span className="text-deep-green">{formatDate(order.receivedDate)}</span>
            </div>
          </div>

          {/* Keluhan & Keamanan */}
          <div className="p-3 bg-surface rounded-control border border-border space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-deep-green">
              <Wrench className="w-4 h-4" />
              <span>Keluhan Pelanggan:</span>
            </div>
            <p className="text-text-primary pl-5">
              {order.complaint || 'Tidak ada keterangan keluhan.'}
            </p>
          </div>

          {/* Security alert reminder */}
          <div className="p-2.5 bg-[#FFFDF3] border border-[#FFE7A3] rounded-control text-[11px] text-[#7A4E00] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A66B00] shrink-0" />
            <span>
              <strong>Patuhi SOT:</strong> Kunci layar pelanggan tidak pernah disimpan. Uji fungsi unit bersama pelanggan saat pengambilan.
            </span>
          </div>

          {/* Technician Action Form */}
          <div className="p-3 bg-page-bg rounded-control border border-border space-y-3">
            <div className="font-semibold text-deep-green">Pembaruan Catatan & Biaya Akhir:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-text-muted block mb-1">
                  Catatan Pengerjaan Teknisi:
                </label>
                <textarea
                  rows={2}
                  value={techNote}
                  onChange={(e) => setTechNote(e.target.value)}
                  placeholder="Misal: Modul LCD diganti, fleksibel dibersihkan..."
                  className="w-full text-xs p-2 rounded-control border border-border bg-surface text-text-primary focus:border-deep-green outline-none"
                />
              </div>
              <div>
                <Input
                  label="Biaya Akhir / Realisasi (IDR):"
                  type="number"
                  value={finalCost}
                  onChange={(e) => setFinalCost(e.target.value)}
                  placeholder="Isi jika ada penyesuaian biaya"
                />
                <span className="text-[10px] text-text-muted block mt-1">
                  Biaya yang akan ditagihkan saat status Selesai.
                </span>
              </div>
            </div>
          </div>

          {/* Chronological Status History */}
          <div className="p-3 bg-surface rounded-control border border-border space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-deep-green">
              <Calendar className="w-4 h-4 text-deep-green" />
              <span>Riwayat Perubahan Status (Kronologis):</span>
            </div>
            <div className="space-y-2 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border pl-6 pt-1">
              {order.statusHistory.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-deep-green ring-4 ring-page-bg" />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-deep-green capitalize">
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{formatDate(item.timestamp)}</span>
                  </div>
                  <p className="text-text-muted text-[11px] mt-0.5">{item.note}</p>
                  <span className="text-[10px] text-text-muted/80 block mt-0.5">Oleh: {item.updatedBy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dialog>

      {/* Sub Modals */}
      <ServiceReceiptModal
        order={showReceipt ? order : null}
        onClose={() => setShowReceipt(false)}
      />
      <ServiceWhatsAppModal
        order={showWa ? order : null}
        onClose={() => setShowWa(false)}
      />
    </>
  );
};
