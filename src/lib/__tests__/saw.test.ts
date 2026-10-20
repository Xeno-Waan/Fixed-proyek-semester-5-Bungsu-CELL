import { describe, it, expect } from 'vitest';
import { normalizeCost, normalizeBenefit, normalizeWeights, calculateSAW } from '../saw';
import { initialSmartphones, sawCriteria } from '@/data/smartphones';
import { CriteriaCode, CriteriaAttribute } from '@/types';

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
    const weights: Record<CriteriaCode, number> = {
      C1: 0.25,
      C2: 0.15,
      C3: 0.15,
      C4: 0.15,
      C5: 0.1,
      C6: 0.1,
      C7: 0.1,
    };
    const attributes: Record<CriteriaCode, CriteriaAttribute> = sawCriteria.reduce(
      (acc, c) => ({ ...acc, [c.code]: c.attribute }),
      {} as Record<CriteriaCode, CriteriaAttribute>
    );

    const results = calculateSAW(initialSmartphones, { weights, attributes });
    expect(results.length).toBe(initialSmartphones.length);
    expect(results[0].rank).toBe(1);
    expect(results[results.length - 1].rank).toBe(results.length);

    // Verify descending final scores
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].finalScore).toBeGreaterThanOrEqual(results[i + 1].finalScore);
    }
  });
});
