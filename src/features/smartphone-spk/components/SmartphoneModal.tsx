import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Smartphone, SmartphoneCondition } from '@/types';

interface SmartphoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phone: Smartphone) => void;
  phoneToEdit?: Smartphone | null;
}

const conditionOptions = [
  { value: 'baru', label: 'Baru (Segel / Garansi Resmi)' },
  { value: 'bekas_mulus', label: 'Bekas Mulus (Grade A / 95-99%)' },
  { value: 'bekas_minus_ringan', label: 'Bekas Minus Ringan (Grade B)' },
];

const ratingOptions = [
  { value: '5', label: '5 — Sangat Baik / Flagship' },
  { value: '4', label: '4 — Baik / Menengah ke Atas' },
  { value: '3', label: '3 — Cukup / Standar' },
  { value: '2', label: '2 — Kurang' },
  { value: '1', label: '1 — Sangat Kurang' },
];

export const SmartphoneModal: React.FC<SmartphoneModalProps> = ({
  isOpen,
  onClose,
  onSave,
  phoneToEdit,
}) => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState<SmartphoneCondition>('baru');
  const [price, setPrice] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [battery, setBattery] = useState('');
  const [chipset, setChipset] = useState('');
  const [cameraDescription, setCameraDescription] = useState('');
  const [cameraQualityRating, setCameraQualityRating] = useState('4');
  const [cameraDesignRating, setCameraDesignRating] = useState('4');
  const [conditionRating, setConditionRating] = useState('5');
  const [error, setError] = useState('');

  useEffect(() => {
    if (phoneToEdit) {
      setBrand(phoneToEdit.brand);
      setModel(phoneToEdit.model);
      setCondition(phoneToEdit.condition);
      setPrice(String(phoneToEdit.price));
      setRam(String(phoneToEdit.specs.ram));
      setStorage(String(phoneToEdit.specs.storage));
      setBattery(String(phoneToEdit.specs.battery));
      setChipset(phoneToEdit.specs.chipset || '');
      setCameraDescription(phoneToEdit.specs.cameraDescription || '');
      setCameraQualityRating(String(phoneToEdit.criteria.cameraQualityRating));
      setCameraDesignRating(String(phoneToEdit.criteria.cameraDesignRating));
      setConditionRating(String(phoneToEdit.criteria.conditionRating));
    } else {
      setBrand('');
      setModel('');
      setCondition('baru');
      setPrice('');
      setRam('8');
      setStorage('256');
      setBattery('5000');
      setChipset('');
      setCameraDescription('');
      setCameraQualityRating('4');
      setCameraDesignRating('4');
      setConditionRating('5');
    }
    setError('');
  }, [phoneToEdit, isOpen]);

  // Otomatis sesuaikan rating kondisi jika kondisi dipilih
  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as SmartphoneCondition;
    setCondition(val);
    if (val === 'baru') setConditionRating('5');
    else if (val === 'bekas_mulus') setConditionRating('4');
    else if (val === 'bekas_minus_ringan') setConditionRating('3');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numPrice = Number(price);
    const numRam = Number(ram);
    const numStorage = Number(storage);
    const numBattery = Number(battery);
    const numCamQual = Number(cameraQualityRating);
    const numCamDes = Number(cameraDesignRating);
    const numCondRat = Number(conditionRating);

    if (!brand.trim() || !model.trim()) {
      setError('Brand dan Model smartphone wajib diisi.');
      return;
    }

    if (numPrice <= 0 || isNaN(numPrice)) {
      setError('Harga harus berupa angka positif.');
      return;
    }

    if (numRam <= 0 || numStorage <= 0 || numBattery <= 0) {
      setError('Spesifikasi RAM, Storage, dan Baterai harus lebih besar dari 0.');
      return;
    }

    const newPhone: Smartphone = {
      id: phoneToEdit ? phoneToEdit.id : `phone-${Date.now()}`,
      brand: brand.trim(),
      model: model.trim(),
      condition,
      price: numPrice,
      specs: {
        ram: numRam,
        storage: numStorage,
        battery: numBattery,
        chipset: chipset.trim() || 'Octa-Core',
        cameraDescription: cameraDescription.trim() || `${numCamQual * 12} MP AI Camera`,
      },
      criteria: {
        price: numPrice,
        ram: numRam,
        storage: numStorage,
        cameraQualityRating: numCamQual,
        cameraDesignRating: numCamDes,
        battery: numBattery,
        conditionRating: numCondRat,
      },
      isActive: phoneToEdit ? phoneToEdit.isActive : true,
    };

    onSave(newPhone);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={phoneToEdit ? 'Edit Smartphone' : 'Tambah Smartphone Baru'}
      description="Kelola data spesifikasi dan parameter kriteria SAW smartphone."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Brand / Merk"
            placeholder="Misal: Samsung, Xiaomi, Apple"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
          <Input
            label="Model / Seri"
            placeholder="Misal: Galaxy A55 5G"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Kondisi Fisik"
            options={conditionOptions}
            value={condition}
            onChange={handleConditionChange}
          />
          <Input
            label="Harga (Rp) — Kriteria C1 (Cost)"
            type="number"
            placeholder="3500000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="RAM (GB) — C2"
            type="number"
            placeholder="8"
            value={ram}
            onChange={(e) => setRam(e.target.value)}
            required
          />
          <Input
            label="Storage (GB) — C3"
            type="number"
            placeholder="256"
            value={storage}
            onChange={(e) => setStorage(e.target.value)}
            required
          />
          <Input
            label="Baterai (mAh) — C6"
            type="number"
            placeholder="5000"
            value={battery}
            onChange={(e) => setBattery(e.target.value)}
            required
          />
        </div>

        <div className="border-t border-border pt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-deep-green mb-2">
            Penilaian Subjektif SAW (Skala 1–5)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Kualitas Kamera — C4"
              options={ratingOptions}
              value={cameraQualityRating}
              onChange={(e) => setCameraQualityRating(e.target.value)}
            />
            <Select
              label="Desain Modul Kamera — C5"
              options={ratingOptions}
              value={cameraDesignRating}
              onChange={(e) => setCameraDesignRating(e.target.value)}
            />
            <Select
              label="Kondisi Unit — C7"
              options={ratingOptions}
              value={conditionRating}
              onChange={(e) => setConditionRating(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Chipset / Prosesor (Opsional)"
            placeholder="Misal: Snapdragon 7s Gen 2"
            value={chipset}
            onChange={(e) => setChipset(e.target.value)}
          />
          <Input
            label="Deskripsi Kamera (Opsional)"
            placeholder="Misal: 50 MP OIS + 8 MP Ultra-Wide"
            value={cameraDescription}
            onChange={(e) => setCameraDescription(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            {phoneToEdit ? 'Simpan Perubahan' : 'Tambahkan ke Katalog'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
