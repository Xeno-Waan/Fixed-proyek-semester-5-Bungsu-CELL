// src/features/service/components/ServiceTracking.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { useServiceStore } from '@/features/service/hooks/useServiceStore';
import { ServiceOrder } from '@/types';
import { formatRupiah } from '@/lib/currency';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Wrench,
  Copy,
  Check,
} from 'lucide-react';
import { ServiceReceiptModal } from './ServiceReceiptModal';
import { ServiceWhatsAppModal } from './ServiceWhatsAppModal';
import { useToast } from '@/components/ui/Toast';

export const ServiceTracking: React.FC = () => {
  const { orders, getOrderByInvoice } = useServiceStore();
  const { toast } = useToast();

  const [query, setQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<ServiceOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);

  // Modals
  const [receiptOrder, setReceiptOrder] = useState<ServiceOrder | null>(null);
  const [waOrder, setWaOrder] = useState<ServiceOrder | null>(null);

  const handleSearch = (invoiceNo?: string) => {
    const term = invoiceNo !== undefined ? invoiceNo : query;
    const found = getOrderByInvoice(term);
    setSearchedOrder(found || null);
    setHasSearched(true);
    if (invoiceNo !== undefined) {
      setQuery(invoiceNo);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleCopyInvoice = (invoiceNo: string) => {
    navigator.clipboard.writeText(invoiceNo);
    setCopiedInvoice(true);
    toast({
      type: 'success',
      title: 'Disalin',
      description: `Nomor nota ${invoiceNo} berhasil disalin.`,
    });
    setTimeout(() => setCopiedInvoice(false), 2000);
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

  const getStatusBadge = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'selesai':
        return <Badge variant="success" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>Selesai Siap Diambil</Badge>;
      case 'proses_perbaikan':
        return <Badge variant="warning" icon={<Clock className="w-3.5 h-3.5" />}>Dalam Perbaikan</Badge>;
      case 'dibatalkan':
        return <Badge variant="danger" icon={<AlertCircle className="w-3.5 h-3.5" />}>Dibatalkan</Badge>;
      default:
        return <Badge variant="brand" icon={<Clock className="w-3.5 h-3.5" />}>Tahap Pengecekan</Badge>;
    }
  };

  // Stepper helper
  const getStepStatus = (stepIndex: number, currentStatus: ServiceOrder['status']) => {
    if (currentStatus === 'dibatalkan') return 'cancelled';
    const statusMap: Record<ServiceOrder['status'], number> = {
      pengecekan: 0,
      proses_perbaikan: 1,
      selesai: 2,
      dibatalkan: -1,
    };
    const current = statusMap[currentStatus] ?? 0;
    if (current > stepIndex) return 'completed';
    if (current === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Search Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-deep-green" />
            <CardTitle>Pelacakan Servis Pelanggan (Tracking Nota)</CardTitle>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Masukkan nomor nota servis Anda untuk memeriksa status pengerjaan, estimasi biaya, dan catatan teknisi secara transparan.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <Input
                isSearch
                placeholder="Contoh: SRV-20261020-001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Nomor nota servis"
              />
            </div>
            <Button
              variant="brand"
              onClick={() => handleSearch()}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Lacak Nota
            </Button>
          </div>

          {/* Quick suggestions from existing demo orders */}
          {orders.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
              <span className="text-text-muted font-medium">Contoh nota tersedia:</span>
              {orders.slice(0, 4).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => handleSearch(o.invoiceNumber)}
                  className="px-2.5 py-1 rounded-full bg-page-bg hover:bg-brand-green border border-border text-deep-green transition-colors font-mono text-[11px]"
                >
                  {o.invoiceNumber} ({o.deviceBrand})
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Section */}
      {searchedOrder ? (
        <div className="space-y-6">
          {/* Main Status & Stepper Banner */}
          <Card className="border-deep-green/30 bg-surface shadow-sm">
            <CardContent className="p-6 space-y-6">
              {/* Header result */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Nomor Nota:</span>
                    <span className="font-mono font-bold text-deep-green text-base">
                      {searchedOrder.invoiceNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyInvoice(searchedOrder.invoiceNumber)}
                      className="p-1 text-text-muted hover:text-deep-green rounded hover:bg-page-bg transition-colors"
                      title="Salin Nomor Nota"
                    >
                      {copiedInvoice ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-deep-green mt-1">
                    {searchedOrder.deviceBrand} {searchedOrder.deviceType}
                  </h3>
                  <p className="text-xs text-text-muted">
                    Atas nama: <strong className="text-deep-green">{searchedOrder.customerName}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {getStatusBadge(searchedOrder.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Printer className="w-4 h-4" />}
                    onClick={() => setReceiptOrder(searchedOrder)}
                  >
                    Cetak Nota
                  </Button>
                  <Button
                    variant="brand"
                    size="sm"
                    leftIcon={<MessageSquare className="w-4 h-4" />}
                    onClick={() => setWaOrder(searchedOrder)}
                  >
                    Simulasi WhatsApp
                  </Button>
                </div>
              </div>

              {/* Progress Stepper (Mobile & Desktop friendly) */}
              <div className="py-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                  Tahapan Pengerjaan
                </div>
                {searchedOrder.status === 'dibatalkan' ? (
                  <Alert variant="danger" title="Status: Dibatalkan">
                    Order perbaikan perangkat ini telah dibatalkan. Silakan ambil unit di konter Bungsu Cell.
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Step 1 */}
                    {(() => {
                      const state = getStepStatus(0, searchedOrder.status);
                      return (
                        <div
                          className={`p-3 rounded-control border flex items-center gap-3 ${
                            state === 'completed'
                              ? 'bg-page-bg border-success/40 text-success'
                              : state === 'current'
                              ? 'bg-brand-green border-deep-green text-deep-green font-semibold'
                              : 'bg-page-bg/50 border-border text-text-muted'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              state === 'completed'
                                ? 'bg-success text-white'
                                : state === 'current'
                                ? 'bg-deep-green text-white'
                                : 'bg-border text-text-muted'
                            }`}
                          >
                            1
                          </div>
                          <div className="text-xs">
                            <p className="font-semibold">Pengecekan Awal</p>
                            <p className="text-[11px] opacity-80">Penerimaan & identifikasi keluhan</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Step 2 */}
                    {(() => {
                      const state = getStepStatus(1, searchedOrder.status);
                      return (
                        <div
                          className={`p-3 rounded-control border flex items-center gap-3 ${
                            state === 'completed'
                              ? 'bg-page-bg border-success/40 text-success'
                              : state === 'current'
                              ? 'bg-[#FFFBEA] border-warning text-warning font-semibold'
                              : 'bg-page-bg/50 border-border text-text-muted'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              state === 'completed'
                                ? 'bg-success text-white'
                                : state === 'current'
                                ? 'bg-warning text-white'
                                : 'bg-border text-text-muted'
                            }`}
                          >
                            2
                          </div>
                          <div className="text-xs">
                            <p className="font-semibold">Proses Perbaikan</p>
                            <p className="text-[11px] opacity-80">Pergantian part & penyolderan mesin</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Step 3 */}
                    {(() => {
                      const state = getStepStatus(2, searchedOrder.status);
                      return (
                        <div
                          className={`p-3 rounded-control border flex items-center gap-3 ${
                            state === 'completed' || state === 'current'
                              ? 'bg-page-bg border-success text-success font-semibold'
                              : 'bg-page-bg/50 border-border text-text-muted'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              state === 'completed' || state === 'current'
                                ? 'bg-success text-white'
                                : 'bg-border text-text-muted'
                            }`}
                          >
                            3
                          </div>
                          <div className="text-xs">
                            <p className="font-semibold">Selesai & Siap Diambil</p>
                            <p className="text-[11px] opacity-80">Pengujian akhir & serah terima unit</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Detail Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                {/* Left col: Unit & Complaint */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-page-bg rounded-control border border-border space-y-2">
                    <div className="flex items-center gap-2 text-deep-green font-semibold">
                      <Wrench className="w-4 h-4" />
                      <span>Rincian Kerusakan & Keluhan</span>
                    </div>
                    <p className="text-text-primary pl-6">
                      {searchedOrder.complaint || 'Tidak ada catatan kerusakan khusus.'}
                    </p>
                  </div>

                  {searchedOrder.technicianNote && (
                    <div className="p-3 bg-brand-green/20 rounded-control border border-border space-y-1">
                      <div className="flex items-center gap-2 text-deep-green font-semibold">
                        <Clock className="w-4 h-4 text-deep-green" />
                        <span>Catatan Teknisi Terbaru:</span>
                      </div>
                      <p className="text-deep-green pl-6">
                        {searchedOrder.technicianNote}
                      </p>
                    </div>
                  )}

                  {/* Security Badge */}
                  <div className="p-3 bg-[#FFFDF3] border border-[#FFE7A3] rounded-control text-[11px] text-[#7A4E00] flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#A66B00] shrink-0 mt-0.5" />
                    <div>
                      <strong>Keamanan Data:</strong> Kunci layar (PIN/Pola) tidak disimpan oleh konter. Anda akan menguji unit secara mandiri saat pengambilan.
                    </div>
                  </div>
                </div>

                {/* Right col: Cost & Timeline */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-page-bg rounded-control border border-border flex items-center justify-between">
                    <div>
                      <span className="text-text-muted block text-[11px]">
                        {searchedOrder.status === 'selesai' ? 'Biaya Akhir Perbaikan:' : 'Estimasi Biaya Perbaikan:'}
                      </span>
                      <span className="text-xl font-bold font-mono text-deep-green">
                        {formatRupiah(searchedOrder.finalCost ?? searchedOrder.estimatedCost)}
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-text-muted">
                      <div>Masuk: {formatDate(searchedOrder.receivedDate)}</div>
                      {searchedOrder.completionDate && (
                        <div className="text-success font-medium">
                          Selesai: {formatDate(searchedOrder.completionDate)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Chronological Status History */}
                  <div className="p-3 bg-surface rounded-control border border-border">
                    <div className="flex items-center gap-2 font-semibold text-deep-green text-xs mb-3">
                      <Calendar className="w-4 h-4 text-deep-green" />
                      <span>Histori Pembaruan Status:</span>
                    </div>
                    <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border pl-6">
                      {searchedOrder.statusHistory.map((hist, idx) => (
                        <div key={idx} className="relative text-xs">
                          <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-deep-green ring-4 ring-page-bg" />
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-deep-green capitalize">
                              {hist.status.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] text-text-muted font-mono">
                              {formatDate(hist.timestamp)}
                            </span>
                          </div>
                          <p className="text-text-muted mt-0.5 text-[11px]">{hist.note}</p>
                          <span className="text-[10px] text-text-muted/80 block mt-0.5">
                            Oleh: {hist.updatedBy}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : hasSearched ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              icon={<AlertCircle className="w-8 h-8 text-warning" />}
              title="Nomor Nota Tidak Ditemukan"
              description={`Tidak ada data servis yang cocok dengan kata kunci "${query}". Harap periksa kembali nomor nota pada tanda terima fisik Anda.`}
              actionLabel="Bersihkan Pencarian"
              onAction={() => setQuery('')}
            />
          </CardContent>
        </Card>
      ) : null}

      {/* Modals */}
      <ServiceReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
      <ServiceWhatsAppModal
        order={waOrder}
        onClose={() => setWaOrder(null)}
      />
    </div>
  );
};
