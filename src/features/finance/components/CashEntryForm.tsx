// src/features/finance/components/CashEntryForm.tsx
import React, { useState } from 'react';
import { useFinanceStore } from '@/features/finance/hooks/useFinanceStore';
import { CashType, PPOBTransactionType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

/**
 * Form for adding a new cash entry (counter or PPOB).
 * UI follows the design system defined in UI‑GUIDELINE.md – uses Card, Input,
 * Select, Button and provides validation feedback.
 */
export const CashEntryForm: React.FC = () => {
  const { addCashEntry } = useFinanceStore();

  const [cashType, setCashType] = useState<CashType>('counter');
  const [flow, setFlow] = useState<'in' | 'out'>('in');
  const [amount, setAmount] = useState('');
  const [adminFee, setAdminFee] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const resetForm = () => {
    setCashType('counter');
    setFlow('in');
    setAmount('');
    setAdminFee('');
    setCategory('');
    setDescription('');
    setReferenceId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Masukkan jumlah uang yang valid.');
      return;
    }
    if (!category) {
      setError('Kategori wajib diisi.');
      return;
    }

    const entry = {
      cashType,
      flow,
      amount: Number(amount),
      adminFee: adminFee ? Number(adminFee) : undefined,
      category,
      description: description || '-',
      referenceId: referenceId || undefined,
    };

    addCashEntry(entry);
    setSuccess('Entri kas berhasil ditambahkan.');
    resetForm();
  };

  // Options for cash type & transaction flow
  const cashTypeOptions = [
    { value: 'counter', label: 'Kas Konter' },
    { value: 'ppob', label: 'Kas PPOB' },
  ];

  const flowOptions = [
    { value: 'in', label: 'Masuk' },
    { value: 'out', label: 'Keluar' },
  ];

  const ppoTransactionOptions = [
    { value: '', label: 'Pilih jenis transaksi' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'tarik_tunai', label: 'Tarik Tunai' },
    { value: 'token_listrik', label: 'Token Listrik' },
    { value: 'bpjs', label: 'BPJS' },
    { value: 'pulsa_data', label: 'Pulsa / Data' },
  ];

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Entri Kas Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="danger" title="Error" className="mb-2">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" title="Berhasil" className="mb-2">
              {success}
            </Alert>
          )}
          <Select
            label="Tipe Kas"
            options={cashTypeOptions}
            value={cashType}
            onChange={(e) => setCashType(e.target.value as CashType)}
            required
          />
          {/* Show specific PPOB transaction type when cash type is PPOB */}
          {cashType === 'ppob' && (
            <Select
              label="Jenis Transaksi PPOB"
              options={ppoTransactionOptions}
              value={category}
              onChange={(e) => setCategory(e.target.value as PPOBTransactionType)}
              required
            />
          )}
          {cashType === 'counter' && (
            <Input
              label="Kategori (contoh: Penjualan, Modal)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Masukkan kategori"
              required
            />
          )}
          <Select
            label="Arah Kas"
            options={flowOptions}
            value={flow}
            onChange={(e) => setFlow(e.target.value as 'in' | 'out')}
            required
          />
          <Input
            label="Jumlah (IDR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            required
          />
          <Input
            label="Biaya Administrasi (optional)"
            type="number"
            value={adminFee}
            onChange={(e) => setAdminFee(e.target.value)}
          />
          <Input
            label="Deskripsi"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Catatan singkat"
          />
          <Input
            label="Reference ID (optional)"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
          />
          <Button type="submit" variant="brand" className="w-full mt-2">
            Simpan Entri
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
