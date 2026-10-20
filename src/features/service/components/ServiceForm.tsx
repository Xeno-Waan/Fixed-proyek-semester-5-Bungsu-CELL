// src/features/service/components/ServiceForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useServiceStore } from '@/features/service/hooks/useServiceStore';
import { ServiceOrder } from '@/types';

export const ServiceForm: React.FC = () => {
  const { addOrder } = useServiceStore();
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    deviceBrand: '',
    deviceType: '',
    complaint: '',
    estimatedCost: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'estimatedCost' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation – ensure required fields are filled
    if (!form.customerName || !form.customerPhone || !form.deviceBrand || !form.deviceType) {
      return;
    }
    addOrder({
      ...form,
      // fields that will be added by the store
    } as Omit<ServiceOrder, 'id' | 'invoiceNumber' | 'status' | 'statusHistory'>);
    // Reset form after submission
    setForm({
      customerName: '',
      customerPhone: '',
      deviceBrand: '',
      deviceType: '',
      complaint: '',
      estimatedCost: 0,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-deep-green">Form Penerimaan Servis</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            name="customerName"
            label="Nama Pelanggan"
            value={form.customerName}
            onChange={handleChange}
            required
          />
          <Input
            name="customerPhone"
            label="No. HP Pelanggan"
            value={form.customerPhone}
            onChange={handleChange}
            required
          />
          <Input
            name="deviceBrand"
            label="Merek Perangkat"
            value={form.deviceBrand}
            onChange={handleChange}
            required
          />
          <Input
            name="deviceType"
            label="Tipe/Model Perangkat"
            value={form.deviceType}
            onChange={handleChange}
            required
          />
          <textarea
            name="complaint"
            placeholder="Keluhan (opsional)"
            value={form.complaint}
            onChange={handleChange}
            className="w-full rounded-md border border-border bg-input-bg p-2 text-text-primary focus:border-focus outline-none"
            rows={3}
          />
          <Input
            name="estimatedCost"
            label="Estimasi Biaya (IDR)"
            type="number"
            value={form.estimatedCost}
            onChange={handleChange}
          />
          <Button type="submit" className="self-end">
            Tambah Order Servis
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
