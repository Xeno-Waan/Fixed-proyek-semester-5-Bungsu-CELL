// src/features/service/components/ServiceList.tsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { ServiceOrder } from '@/types';
import { useServiceStore } from '@/features/service/hooks/useServiceStore';
import { ServiceDetail } from './ServiceDetail';

export const ServiceList: React.FC = () => {
  const { orders, refresh } = useServiceStore();
  const [selected, setSelected] = useState<ServiceOrder | null>(null);

  const closeDetail = () => setSelected(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-deep-green">Daftar Service</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Nota</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Perangkat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(o => (
              <TableRow key={o.id}>
                <TableCell>{o.invoiceNumber}</TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell>{`${o.deviceBrand} ${o.deviceType}`}</TableCell>
                <TableCell>{o.status.replace('_', ' ')}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setSelected(o)}>
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Refresh button for manual reload */}
        <div className="mt-4 flex justify-end">
          <Button onClick={refresh} size="sm">Refresh</Button>
        </div>
        {selected && (
          <ServiceDetail order={selected} onClose={closeDetail} />
        )}
      </CardContent>
    </Card>
  );
};
