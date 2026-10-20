import {
  CriteriaCode,
  CriteriaAttribute,
  Smartphone,
  SAWNormalizedItem,
} from '@/types';

/**
 * Normalization formula for Cost criteria (PRD 5):
 * r_ij = min(x_j) / x_ij
 * Returns 0 if x_ij is 0 or invalid to avoid division by zero.
 */
export function normalizeCost(val: number, minVal: number): number {
  if (val <= 0 || minVal <= 0) return 0;
  return Number((minVal / val).toFixed(4));
}

/**
 * Normalization formula for Benefit criteria (PRD 5):
 * r_ij = x_ij / max(x_j)
 * Returns 0 if maxVal is 0 or invalid to avoid division by zero.
 */
export function normalizeBenefit(val: number, maxVal: number): number {
  if (maxVal <= 0 || val < 0) return 0;
  return Number((val / maxVal).toFixed(4));
}

/**
 * Validates that weights sum to a positive number and normalizes them so their sum equals 1.
 */
export function normalizeWeights(weights: Record<CriteriaCode, number>): Record<CriteriaCode, number> {
  const codes = Object.keys(weights) as CriteriaCode[];
  const total = codes.reduce((sum, code) => sum + (Math.max(0, weights[code] || 0)), 0);

  const normalized: Partial<Record<CriteriaCode, number>> = {};
  codes.forEach((code) => {
    const rawWeight = Math.max(0, weights[code] || 0);
    normalized[code] = total > 0 ? Number((rawWeight / total).toFixed(4)) : 0;
  });

  return normalized as Record<CriteriaCode, number>;
}

export interface SAWCalculationOptions {
  weights: Record<CriteriaCode, number>;
  attributes: Record<CriteriaCode, CriteriaAttribute>;
}

/**
 * Baseline SAW Calculator contract
 * Will be fully integrated and expanded in Phase E
 */
export function calculateSAW(
  smartphones: Smartphone[],
  options: SAWCalculationOptions
): SAWNormalizedItem[] {
  const activePhones = smartphones.filter((sp) => sp.isActive);
  if (activePhones.length === 0) return [];

  const normWeights = normalizeWeights(options.weights);

  // Extract min and max per criteria
  const minMax: Record<CriteriaCode, { min: number; max: number }> = {
    C1: { min: Infinity, max: -Infinity },
    C2: { min: Infinity, max: -Infinity },
    C3: { min: Infinity, max: -Infinity },
    C4: { min: Infinity, max: -Infinity },
    C5: { min: Infinity, max: -Infinity },
    C6: { min: Infinity, max: -Infinity },
    C7: { min: Infinity, max: -Infinity },
  };

  const criteriaMapping: Record<CriteriaCode, keyof Smartphone['criteria']> = {
    C1: 'price',
    C2: 'ram',
    C3: 'storage',
    C4: 'cameraQualityRating',
    C5: 'cameraDesignRating',
    C6: 'battery',
    C7: 'conditionRating',
  };

  activePhones.forEach((sp) => {
    (Object.keys(criteriaMapping) as CriteriaCode[]).forEach((code) => {
      const val = sp.criteria[criteriaMapping[code]];
      if (val < minMax[code].min) minMax[code].min = val;
      if (val > minMax[code].max) minMax[code].max = val;
    });
  });

  const results: SAWNormalizedItem[] = activePhones.map((sp) => {
    const normalizedScores: Record<CriteriaCode, number> = {} as Record<CriteriaCode, number>;
    const weightedScores: Record<CriteriaCode, number> = {} as Record<CriteriaCode, number>;
    let finalScore = 0;

    (Object.keys(criteriaMapping) as CriteriaCode[]).forEach((code) => {
      const val = sp.criteria[criteriaMapping[code]];
      const attr = options.attributes[code];
      const normScore =
        attr === 'cost'
          ? normalizeCost(val, minMax[code].min)
          : normalizeBenefit(val, minMax[code].max);

      normalizedScores[code] = normScore;
      const weighted = Number((normScore * (normWeights[code] || 0)).toFixed(4));
      weightedScores[code] = weighted;
      finalScore += weighted;
    });

    return {
      smartphoneId: sp.id,
      model: sp.model,
      normalizedScores,
      weightedScores,
      finalScore: Number(finalScore.toFixed(4)),
      rank: 0,
    };
  });

  // Sort descending by finalScore, deterministic tie-breaking by smartphoneId
  results.sort((a, b) => {
    if (b.finalScore !== a.finalScore) {
      return b.finalScore - a.finalScore;
    }
    return a.smartphoneId.localeCompare(b.smartphoneId);
  });

  // Assign ranks
  results.forEach((item, index) => {
    item.rank = index + 1;
  });

  return results;
}
