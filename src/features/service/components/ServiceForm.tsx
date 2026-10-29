// src/features/service/components/ServiceForm.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useServiceStore } from '@/features/service/hooks/useServiceStore';
import { useToast } from '@/components/ui/Toast';
import { PlusCircle, Printer, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ServiceReceiptModal } from './ServiceReceiptModal';
import { ServiceWhatsAppModal } from './ServiceWhatsAppModal';
import { ServiceOrder } from '@/types';

export const ServiceForm: React.FC = () => {
  const { addOrder } = useServiceStore();
  const { toast } = useToast();

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    deviceBrand: '',
    deviceType: '',
    complaint: '',
    estimatedCost: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdOrder, setCreatedOrder] = useState<ServiceOrder | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showWa, setShowWa] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.customerName.trim()) {
      newErrors.customerName = 'Nama pelanggan wajib diisi.';
    }
    if (!form.customerPhone.trim()) {
      newErrors.customerPhone = 'Nomor telepon wajib diisi.';
    } else if (!/^[0-9+\s-]{8,16}$/.test(form.customerPhone.trim())) {
      newErrors.customerPhone = 'Format nomor HP tidak valid (minimal 8 angka).';
    }
    if (!form.deviceBrand.trim()) {
      newErrors.deviceBrand = 'Merek perangkat wajib diisi.';
    }
    if (!form.deviceType.trim()) {
      newErrors.deviceType = 'Tipe / model perangkat wajib diisi.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const costNum = parseFloat(form.estimatedCost) || 0;

    const newOrder = addOrder({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      deviceBrand: form.deviceBrand,
      deviceType: form.deviceType,
      complaint: form.complaint,
      estimatedCost: costNum,
    });

    setCreatedOrder(newOrder);

    toast({
      type: 'success',
      title: 'Penerimaan Servis Berhasil',
      description: `Nomor Nota: ${newOrder.invoiceNumber} berhasil dicatat.`,
      duration: 6000,
    });

    // Reset fields
    setForm({
      customerName: '',
      customerPhone: '',
      deviceBrand: '',
      deviceType: '',
      complaint: '',
      estimatedCost: '',
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-deep-green flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            <span>Form Penerimaan Servis Baru</span>
          </CardTitle>
          <p className="text-xs text-text-muted mt-1">
            Catat detail unit yang masuk dari pelanggan. Nomor nota unik akan dibuat otomatis.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-3.5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                name="customerName"
                label="Nama Pelanggan"
                placeholder="Contoh: Budi Santoso"
                value={form.customerName}
                onChange={handleChange}
                error={errors.customerName}
                required
              />
              <Input
                name="customerPhone"
                label="No. WhatsApp / HP"
                placeholder="Contoh: 081234567890"
                value={form.customerPhone}
                onChange={handleChange}
                error={errors.customerPhone}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                name="deviceBrand"
                label="Merek Perangkat"
                placeholder="Contoh: Samsung, Xiaomi, iPhone..."
                value={form.deviceBrand}
                onChange={handleChange}
                error={errors.deviceBrand}
                required
              />
              <Input
                name="deviceType"
                label="Tipe / Model"
                placeholder="Contoh: Galaxy A54, Redmi Note 12..."
                value={form.deviceType}
                onChange={handleChange}
                error={errors.deviceType}
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted block mb-1">
                Keluhan / Kerusakan Fisik & Mesin
              </label>
              <textarea
                name="complaint"
                placeholder="Deskripsikan keluhan (misal: Layar pecah, tidak bisa dicas, tombol power macet...)"
                value={form.complaint}
                onChange={handleChange}
                className="w-full rounded-control border border-border bg-input-bg p-2.5 text-xs text-text-primary focus:border-deep-green outline-none"
                rows={3}
              />
            </div>

            <Input
              name="estimatedCost"
              label="Estimasi Biaya Awal (IDR)"
              type="number"
              min="0"
              placeholder="0"
              value={form.estimatedCost}
              onChange={handleChange}
            />

            {/* Security reminder */}
            <div className="p-2.5 bg-[#FFFDF3] border border-[#FFE7A3] rounded-control text-[11px] text-[#7A4E00] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A66B00] shrink-0 mt-0.5" />
              <span>
                <strong>Aturan Privasi (PRD 4.3):</strong> Dilarang meminta atau mencatat PIN/pola kunci layar pelanggan.
              </span>
            </div>

            <Button type="submit" variant="brand" className="w-full sm:w-auto sm:self-end mt-1">
              Simpan & Terbitkan Nota
            </Button>
          </form>

          {/* Banner notification when an order was just created */}
          {createdOrder && (
            <div className="mt-4 p-3.5 bg-brand-green/30 border border-deep-green/30 rounded-control flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-deep-green">
                    Nota Berhasil Diterbitkan: <span className="font-mono">{createdOrder.invoiceNumber}</span>
                  </p>
                  <p className="text-text-muted text-[11px]">
                    {createdOrder.customerName} · {createdOrder.deviceBrand} {createdOrder.deviceType}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => setShowReceipt(true)}
                >
                  Cetak Nota
                </Button>
                <Button
                  variant="brand"
                  size="sm"
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                  onClick={() => setShowWa(true)}
                >
                  Simulasi WA
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals for newly created order */}
      <ServiceReceiptModal
        order={showReceipt ? createdOrder : null}
        onClose={() => setShowReceipt(false)}
      />
      <ServiceWhatsAppModal
        order={showWa ? createdOrder : null}
        onClose={() => setShowWa(false)}
      />
    </>
  );
};
