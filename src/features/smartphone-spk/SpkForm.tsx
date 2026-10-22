import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { sawCriteria } from '@/data/smartphones';
import { CriteriaCode } from '@/types';

export interface PreferenceFormProps {
  onSubmit: (weights: Record<CriteriaCode, number>) => void;
}

export const PreferenceForm: React.FC<PreferenceFormProps> = ({ onSubmit }) => {
  // Initialize weights using defaultWeight from sawCriteria
  const initialWeights = {} as Record<CriteriaCode, number>;
  sawCriteria.forEach((c) => {
    initialWeights[c.code] = c.defaultWeight;
  });

  const [weights, setWeights] = useState<Record<CriteriaCode, number>>(initialWeights);
  const [error, setError] = useState<string>('');
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);

  const handleChange = (code: CriteriaCode, value: string) => {
    const num = parseFloat(value);
    setWeights((prev) => ({ ...prev, [code]: isNaN(num) ? 0 : num }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight <= 0 || Object.values(weights).some((weight) => weight < 0 || !Number.isFinite(weight))) {
      setError('Setiap bobot harus nol atau positif dan totalnya harus lebih dari nol.');
      return;
    }
    setError('');
    onSubmit(weights);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-deep-green">Pengaturan Bobot Kriteria</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {sawCriteria.map((c) => (
            <div key={c.code} className="flex items-center gap-4">
              <label htmlFor={c.code} className="w-32 text-sm font-medium text-text-muted">
                {c.code} – {c.name}
              </label>
              <Input
                id={c.code}
                type="number"
                min={0}
                step={0.01}
                value={weights[c.code]}
                onChange={(e) => handleChange(c.code, e.target.value)}
                className="w-24"
              />
            </div>
          ))}
          <p className="text-xs text-text-muted">Total bobot: {totalWeight.toFixed(2)}. Sistem menormalisasi total positif menjadi 100%.</p>
          {error && <p className="text-xs text-danger" role="alert">{error}</p>}
          <Button type="submit" variant="primary" className="mt-2">
            Hitung SAW
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
