import { describe, it, expect } from 'vitest';
import {
  isNonEmptyString,
  isValidNumber,
  isPositiveNumber,
  isNonNegativeNumber,
  isValidIndonesianPhone,
} from '../validation';

describe('validation utilities', () => {
  it('validates non-empty string correctly', () => {
    expect(isNonEmptyString('Bungsu Cell')).toBe(true);
    expect(isNonEmptyString('   ')).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(123)).toBe(false);
  });

  it('validates numbers correctly', () => {
    expect(isValidNumber(100)).toBe(true);
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(-50)).toBe(true);
    expect(isValidNumber(NaN)).toBe(false);
    expect(isValidNumber(Infinity)).toBe(false);
    expect(isValidNumber('100')).toBe(false);
  });

  it('validates positive numbers correctly', () => {
    expect(isPositiveNumber(10)).toBe(true);
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-5)).toBe(false);
  });

  it('validates non-negative numbers correctly', () => {
    expect(isNonNegativeNumber(0)).toBe(true);
    expect(isNonNegativeNumber(5)).toBe(true);
    expect(isNonNegativeNumber(-1)).toBe(false);
  });

  it('validates Indonesian phone numbers', () => {
    expect(isValidIndonesianPhone('081234567890')).toBe(true);
    expect(isValidIndonesianPhone('+6281234567890')).toBe(true);
    expect(isValidIndonesianPhone('6281234567890')).toBe(true);
    expect(isValidIndonesianPhone('0812-3456-7890')).toBe(true);
    expect(isValidIndonesianPhone('12345')).toBe(false);
    expect(isValidIndonesianPhone('021-123456')).toBe(false);
  });
});
