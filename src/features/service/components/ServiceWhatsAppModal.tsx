// src/features/service/components/ServiceWhatsAppModal.tsx
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { ServiceOrder } from '@/types';
import { formatRupiah } from '@/lib/currency';
import { MessageSquare, Copy, Check, ExternalLink, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface Props {
  order: ServiceOrder | null;
  onClose: () => void;
}

export const ServiceWhatsAppModal: React.FC<Props> = ({ order, onClose }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  // Clean phone number for wa.me format (Indonesian 08... -> 628...)
  const formatPhone = (phone: string): string => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean;
  };

  const getStatusText = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'pengecekan':
        return 'Sedang dalam tahap pengecekan awal';
      case 'proses_perbaikan':
        return 'Sedang dalam proses perbaikan suku cadang/mesin';
      case 'selesai':
        return 'Sudah SELESAI dan siap diambil di konter Bungsu Cell';
      case 'dibatalkan':
        return 'Dibatalkan (unit dapat diambil kembali di konter)';
      default:
        return status;
    }
  };

  const messageText = `Halo Kak ${order.customerName},

Kami dari *Bungsu Cell* ingin mengabarkan status servis smartphone Anda:

📋 *No. Nota:* ${order.invoiceNumber}
📱 *Perangkat:* ${order.deviceBrand} ${order.deviceType}
🛠️ *Keluhan:* ${order.complaint || '-'}
⚡ *Status Terkini:* ${getStatusText(order.status)}
💰 *${order.status === 'selesai' ? 'Total Biaya' : 'Estimasi Biaya'}:* ${formatRupiah(order.finalCost ?? order.estimatedCost)}
${order.technicianNote ? `📝 *Catatan Teknisi:* ${order.technicianNote}\n` : ''}
Anda dapat memantau status servis secara mandiri kapan saja melalui website Bungsu Cell dengan memasukkan nomor nota di atas.

Terima kasih atas kepercayaannya! 🙏
*Bungsu Cell* - Spesialis Servis & Aksesoris HP`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      toast({
        type: 'success',
        title: 'Teks Disalin',
        description: 'Format pesan WhatsApp berhasil disalin ke clipboard.',
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast({
        type: 'danger',
        title: 'Gagal Menyalin',
        description: 'Silakan salin teks pesan secara manual.',
      });
    }
  };

  const cleanPhone = formatPhone(order.customerPhone);
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;

  const footer = (
    <div className="flex items-center justify-between w-full">
      <span className="text-xs text-text-muted">Simulasi pengiriman WhatsApp (SOT)</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Tutup
        </Button>
        <Button
          variant="outline"
          size="sm"
          leftIcon={copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          onClick={handleCopy}
        >
          {copied ? 'Tersalin' : 'Salin Pesan'}
        </Button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <Button
            variant="brand"
            size="sm"
            leftIcon={<ExternalLink className="w-4 h-4" />}
          >
            Buka WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );

  return (
    <Dialog
      isOpen={!!order}
      onClose={onClose}
      title="Simulasi Pesan WhatsApp Pelanggan"
      description={`Kirim notifikasi update servis ke ${order.customerName} (${order.customerPhone})`}
      maxWidth="md"
      footer={footer}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-brand-green/20 rounded-control border border-border">
          <div className="w-9 h-9 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-deep-green flex items-center gap-1.5">
              <span>{order.customerName}</span>
              <span className="font-normal text-text-muted">({order.customerPhone})</span>
            </div>
            <p className="text-text-muted mt-0.5">
              Template teks otomatis dirancang sesuai standar komunikasi layanan pelanggan Bungsu Cell.
            </p>
          </div>
        </div>

        {/* Simulated Chat Bubble */}
        <div className="p-4 bg-[#EFEAE2] rounded-control border border-[#D5CDBD] text-xs font-sans">
          <div className="bg-surface rounded-lg p-3 max-w-[95%] shadow-sm border border-[#E0D9CE] text-[#111B21] space-y-2 whitespace-pre-wrap leading-relaxed">
            {messageText}
          </div>
          <div className="mt-2 text-[11px] text-[#667781] text-right flex items-center justify-end gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Format pesan terverifikasi</span>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
