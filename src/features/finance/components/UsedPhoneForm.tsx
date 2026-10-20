// src/features/finance/components/UsedPhoneForm.tsx
import React, { useState } from 'react';
import { useFinanceStore } from '@/features/finance/hooks/useFinanceStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

/**
 * Form for adding a used‑phone purchase record and optionally marking it as sold.
 * Mirrors the design language of other forms (Card container, Input fields,
 * validation alerts). No PIN or screen‑lock data is captured per SAW integrity.
 */
export const UsedPhoneForm: React.FC = () => {
  const { addUsedPhone, sellPhone } = useFinanceStore();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [conditionDescription, setConditionDescription] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [repairSparepartCost, setRepairSparepartCost] = useState('');
  const [targetSellingPrice, setTargetSellingPrice] = useState('');
  const [isSold, setIsSold] = useState(false);
  const [actualSellingPrice, setActualSellingPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setBrand('');
    setModel('');
    setConditionDescription('');
    setPurchasePrice('');
    setRepairSparepartCost('');
    setTargetSellingPrice('');
    setIsSold(false);
    setActualSellingPrice('');
    setError('');
    setSuccess('');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!brand || !model || !purchasePrice || !targetSellingPrice) {
      setError('Isikan field wajib (brand, model, harga beli, target jual).');
      return;
    }
    const phone = {
      brand,
      model,
      conditionDescription: conditionDescription || '-',
      purchasePrice: Number(purchasePrice),
      repairSparepartCost: repairSparepartCost ? Number(repairSparepartCost) : 0,
      targetSellingPrice: Number(targetSellingPrice),
      isSold: false,
      purchaseDate: new Date().toISOString(),
    };
    addUsedPhone(phone);
    setSuccess('Data HP bekas berhasil ditambahkan.');
    resetForm();
  };

  const handleSell = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!actualSellingPrice) {
      setError('Masukkan harga jual aktual untuk penjualan.');
      return;
    }
    // For demo purposes we sell the most recent unsold phone
    sellPhone(usedPhones[usedPhones.length - 1]?.id ?? '', Number(actualSellingPrice));
    setSuccess('HP bekas berhasil dijual & profit dihitung.');
    setIsSold(false);
    setActualSellingPrice('');
  };

  // Access the current list to pick the latest unsold phone for selling
  const { usedPhones } = useFinanceStore();
  const latestUnsold = usedPhones.find((p) => !p.isSold);

  return (
    <Card className="max-w-xl mx-auto space-y-6">
      <CardHeader>
        <CardTitle>Tambah HP Bekas</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <Alert variant="danger" title="Error" className="mb-2">{error}</Alert>}
        {success && <Alert variant="success" title="Berhasil" className="mb-2">{success}</Alert>}
        {/* Add phone form */}
        <form onSubmit={handleAdd} className="space-y-3">
          <Input label="Merek" value={brand} onChange={(e) => setBrand(e.target.value)} required />
          <Input label="Model" value={model} onChange={(e) => setModel(e.target.value)} required />
          <Input label="Deskripsi Kondisi" value={conditionDescription} onChange={(e) => setConditionDescription(e.target.value)} placeholder="Contoh: Bekas mulus" />
          <Input label="Harga Beli (IDR)" type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} required />
          <Input label="Biaya Sparepart / Perbaikan" type="number" value={repairSparepartCost} onChange={(e) => setRepairSparepartCost(e.target.value)} />
          <Input label="Target Harga Jual (IDR)" type="number" value={targetSellingPrice} onChange={(e) => setTargetSellingPrice(e.target.value)} required />
          <Button type="submit" variant="brand" className="w-full mt-2">Tambah HP Bekas</Button>
        </form>
        {/* Sell phone form – shown only if there is an unsold phone */}
        {latestUnsold && (
          <form onSubmit={handleSell} className="mt-6 space-y-3">
            <h3 className="text-lg font-medium">Jual HP Bekas: {latestUnsold.brand} {latestUnsold.model}</h3>
            <Input label="Harga Jual Aktual (IDR)" type="number" value={actualSellingPrice} onChange={(e) => setActualSellingPrice(e.target.value)} required />
            <Button type="submit" variant="success" className="w-full">Selesaikan Penjualan</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
