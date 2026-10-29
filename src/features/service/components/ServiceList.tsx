// src/features/service/components/ServiceList.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ServiceOrder, ServiceStatus } from '@/types';
import { useServiceStore } from '@/features/service/hooks/useServiceStore';
import { ServiceDetail } from './ServiceDetail';
import { ServiceReceiptModal } from './ServiceReceiptModal';
import { ServiceWhatsAppModal } from './ServiceWhatsAppModal';
import { formatRupiah } from '@/lib/currency';
import {
  Wrench,
  Search,
  Printer,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
} from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/Dialog';
import { useToast } from '@/components/ui/Toast';

export const ServiceList: React.FC = () => {
  const { orders, reset } = useServiceStore();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<ServiceOrder | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<ServiceOrder | null>(null);
  const [waOrder, setWaOrder] = useState<ServiceOrder | null>(null);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      q === '' ||
      o.invoiceNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      `${o.deviceBrand} ${o.deviceType}`.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusBadge = (status: ServiceStatus) => {
    switch (status) {
      case 'selesai':
        return <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>Selesai</Badge>;
      case 'proses_perbaikan':
        return <Badge variant="warning" size="sm" icon={<Clock className="w-3 h-3" />}>Perbaikan</Badge>;
      case 'dibatalkan':
        return <Badge variant="danger" size="sm" icon={<AlertCircle className="w-3 h-3" />}>Batal</Badge>;
      default:
        return <Badge variant="brand" size="sm" icon={<Clock className="w-3 h-3" />}>Pengecekan</Badge>;
    }
  };

  const handleReset = () => {
    reset();
    setIsResetOpen(false);
    toast({
      type: 'info',
      title: 'Data Servis Direset',
      description: 'Data servis dikembalikan ke data awal dummy.',
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-deep-green flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                <span>Daftar Order Servis ({orders.length})</span>
              </CardTitle>
              <p className="text-xs text-text-muted mt-0.5">
                Kelola status pengerjaan, cetak nota, dan notifikasi WhatsApp pelanggan.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCcw className="w-3.5 h-3.5" />}
              onClick={() => setIsResetOpen(true)}
            >
              Reset Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3.5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <Input
                isSearch
                placeholder="Cari no nota, nama pelanggan, atau tipe HP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Cari order servis"
              />
            </div>
            <div className="w-full sm:w-44">
              <Select
                options={[
                  { value: 'all', label: 'Semua Status' },
                  { value: 'pengecekan', label: 'Pengecekan' },
                  { value: 'proses_perbaikan', label: 'Proses Perbaikan' },
                  { value: 'selesai', label: 'Selesai' },
                  { value: 'dibatalkan', label: 'Dibatalkan' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter status servis"
              />
            </div>
          </div>

          {/* Table */}
          {filteredOrders.length === 0 ? (
            <EmptyState
              icon={<Search className="w-6 h-6" />}
              title="Tidak Ada Order Servis"
              description="Tidak ditemukan order yang cocok dengan pencarian atau filter yang dipilih."
            />
          ) : (
            <div className="overflow-x-auto rounded-control border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#FAFCF9]">
                    <TableHead>No. Nota</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Perangkat</TableHead>
                    <TableHead>Biaya</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((o) => (
                    <TableRow key={o.id} className="hover:bg-page-bg transition-colors">
                      <TableCell className="font-mono text-xs font-semibold text-deep-green whitespace-nowrap">
                        {o.invoiceNumber}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-deep-green">{o.customerName}</div>
                        <div className="text-[11px] text-text-muted">{o.customerPhone}</div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-deep-green">{o.deviceBrand}</div>
                        <div className="text-[11px] text-text-muted">{o.deviceType}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold text-deep-green whitespace-nowrap">
                        {formatRupiah(o.finalCost ?? o.estimatedCost)}
                      </TableCell>
                      <TableCell>{getStatusBadge(o.status)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelected(o)}
                          >
                            Detail
                          </Button>
                          <button
                            type="button"
                            onClick={() => setReceiptOrder(o)}
                            className="p-1.5 text-text-muted hover:text-deep-green hover:bg-page-bg rounded-control transition-colors"
                            title="Cetak Nota"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setWaOrder(o)}
                            className="p-1.5 text-text-muted hover:text-success hover:bg-page-bg rounded-control transition-colors"
                            title="Simulasi WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {selected && (
        <ServiceDetail
          order={selected}
          onClose={() => setSelected(null)}
        />
      )}
      <ServiceReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />
      <ServiceWhatsAppModal
        order={waOrder}
        onClose={() => setWaOrder(null)}
      />

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleReset}
        title="Reset Seluruh Data Servis?"
        message="Semua order servis baru dan perubahan status akan dikembalikan ke data dummy awal. Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Reset Data Servis"
        cancelText="Batal"
        isDestructive
      />
    </>
  );
};
