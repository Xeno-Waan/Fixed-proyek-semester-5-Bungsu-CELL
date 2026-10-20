/**
 * Basic Validation Utilities
 * Reference: docs/UI-GUIDELINE.md & docs/IMPLEMENTATION_PLAN.md
 */

export function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

export function isValidNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val) && isFinite(val);
}

export function isPositiveNumber(val: unknown): val is number {
  return isValidNumber(val) && val > 0;
}

export function isNonNegativeNumber(val: unknown): val is number {
  return isValidNumber(val) && val >= 0;
}

export function isValidIndonesianPhone(phone: string): boolean {
  if (!phone) return false;
  // Indonesian numbers usually start with 08 or +628 or 628, 9-14 digits
  const cleaned = phone.replace(/[\s-]/g, '');
  return /^(?:\+628|628|08)[0-9]{8,12}$/.test(cleaned);
}
