import { describe, it, expect } from 'vitest';
import { normalizeCost, normalizeBenefit, normalizeWeights, calculateSAW, calculateSAWWithDiagnostics } from '../saw';
import { initialSmartphones, sawCriteria } from '@/data/smartphones';
import { CriteriaCode, CriteriaAttribute, Smartphone } from '@/types';

const weights: Record<CriteriaCode, number> = {
  C1: 0.25, C2: 0.15, C3: 0.15, C4: 0.15, C5: 0.1, C6: 0.1, C7: 0.1,
};

const attributes: Record<CriteriaCode, CriteriaAttribute> = sawCriteria.reduce(
  (acc, c) => ({ ...acc, [c.code]: c.attribute }),
  {} as Record<CriteriaCode, CriteriaAttribute>
);

describe('SAW integrity and calculations', () => {
  it('correctly normalizes cost criteria: min / x', () => {
    // min is 100, current is 200 => 100/200 = 0.5
    expect(normalizeCost(200, 100)).toBe(0.5);
    // min is 100, current is 100 => 1.0
    expect(normalizeCost(100, 100)).toBe(1);
    // zero or negative guards
    expect(normalizeCost(0, 100)).toBe(0);
    expect(normalizeCost(100, 0)).toBe(0);
  });

  it('correctly normalizes benefit criteria: x / max', () => {
    // max is 500, current is 250 => 250/500 = 0.5
    expect(normalizeBenefit(250, 500)).toBe(0.5);
    // max is 500, current is 500 => 1.0
    expect(normalizeBenefit(500, 500)).toBe(1);
    // zero division guards
    expect(normalizeBenefit(100, 0)).toBe(0);
    expect(normalizeBenefit(-10, 500)).toBe(0);
  });

  it('normalizes weights to sum to 1', () => {
    const rawWeights: Record<CriteriaCode, number> = {
      C1: 20,
      C2: 20,
      C3: 20,
      C4: 20,
      C5: 10,
      C6: 5,
      C7: 5,
    };
    const norm = normalizeWeights(rawWeights);
    const sum = Object.values(norm).reduce((a, b) => a + b, 0);
    expect(Math.round(sum)).toBe(1);
  });

  it('computes calculateSAW deterministically with descending ranks', () => {
    const results = calculateSAW(initialSmartphones, { weights, attributes });
    expect(results.length).toBe(initialSmartphones.length);
    expect(results[0].rank).toBe(1);
    expect(results[results.length - 1].rank).toBe(results.length);

    // Verify descending final scores
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].finalScore).toBeGreaterThanOrEqual(results[i + 1].finalScore);
    }
  });

  it('rejects zero-total and negative weights explicitly', () => {
    const zeroWeights = { ...weights, C1: 0, C2: 0, C3: 0, C4: 0, C5: 0, C6: 0, C7: 0 };
    expect(calculateSAWWithDiagnostics(initialSmartphones, { weights: zeroWeights, attributes }).error)
      .toMatch(/Total bobot/);
    expect(calculateSAWWithDiagnostics(initialSmartphones, { weights: { ...weights, C1: -1 }, attributes }).error)
      .toMatch(/nol atau positif/);
  });

  it('excludes invalid active alternatives with a reason', () => {
    const invalidPhone: Smartphone = {
      ...initialSmartphones[0], id: 'invalid-phone', model: 'Unit data rusak',
      criteria: { ...initialSmartphones[0].criteria, price: 0 },
    };
    const calculation = calculateSAWWithDiagnostics([...initialSmartphones, invalidPhone], { weights, attributes });
    expect(calculation.results).toHaveLength(initialSmartphones.length);
    expect(calculation.excluded).toEqual([{ smartphoneId: 'invalid-phone', model: 'Unit data rusak', reason: 'Nilai C1 tidak valid.' }]);
  });

  it('handles a zero benefit maximum without NaN or Infinity', () => {
    const zeroBattery = initialSmartphones.map((phone) => ({
      ...phone, criteria: { ...phone.criteria, battery: 0 },
    }));
    const results = calculateSAW(zeroBattery, { weights, attributes });
    expect(results.every((result) => Number.isFinite(result.finalScore) && result.normalizedScores.C6 === 0)).toBe(true);
  });

  it('uses smartphone ID as a deterministic tie-breaker', () => {
    const samePhone = (id: string): Smartphone => ({
      ...initialSmartphones[0], id, model: `Model ${id}`,
    });
    const tied = calculateSAW([samePhone('sp-z'), samePhone('sp-a')], { weights, attributes });
    expect(tied.map((item) => item.smartphoneId)).toEqual(['sp-a', 'sp-z']);
  });
});
