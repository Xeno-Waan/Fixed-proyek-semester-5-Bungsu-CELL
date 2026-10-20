// src/features/service/components/ServiceDetail.tsx
import React from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ServiceOrder, ServiceStatus } from '@/types';
import { useServiceStore } from '@/features/service/hooks/useServiceStore';

interface Props {
  order: ServiceOrder;
  onClose: () => void;
}

export const ServiceDetail: React.FC<Props> = ({ order, onClose }) => {
  const { updateStatus } = useServiceStore();

  const handleStatusChange = (newStatus: ServiceStatus, note: string) => {
    updateStatus(order.id, newStatus, note);
    onClose();
  };

  const footer = (
    <>
      {order.status === 'pengecekan' && (
        <Button onClick={() => handleStatusChange('proses_perbaikan', 'Mulai perbaikan')}>Mulai Perbaikan</Button>
      )}
      {order.status === 'proses_perbaikan' && (
        <Button onClick={() => handleStatusChange('selesai', 'Perbaikan selesai')}>Selesai</Button>
      )}
      {(order.status === 'pengecekan' || order.status === 'proses_perbaikan') && (
        <Button variant="destructive" onClick={() => handleStatusChange('dibatalkan', 'Dibatalkan oleh sistem')}>Batalkan</Button>
      )}
      <Button variant="outline" onClick={onClose}>Tutup</Button>
    </>
  );

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title={`Detail Service ${order.invoiceNumber}`}
      description={`${order.customerName} - ${order.deviceBrand} ${order.deviceType}`}
      footer={footer}
    >
      <Card>
        <CardContent className="space-y-2">
          <p><strong>Keluhan:</strong> {order.complaint || '-'} </p>
          <p><strong>Estimasi Biaya:</strong> {order.estimatedCost?.toLocaleString('id-ID') ?? '-'} IDR</p>
          <p><strong>Status Saat Ini:</strong> {order.status.replace('_', ' ')}</p>
          <p><strong>Catatan Teknisi:</strong> {order.technicianNote || '-'} </p>
        </CardContent>
      </Card>
    </Dialog>
  );
};
