import { describe, it, expect } from 'vitest';
import { formatRupiah, parseRupiah } from '../currency';

describe('currency utilities', () => {
  describe('formatRupiah', () => {
    it('formats positive integers to Indonesian Rupiah', () => {
      const result = formatRupiah(150000);
      expect(result).toMatch(/Rp\s?150\.000/);
    });

    it('formats zero correctly', () => {
      const result = formatRupiah(0);
      expect(result).toMatch(/Rp\s?0/);
    });

    it('handles negative numbers with leading minus sign', () => {
      const result = formatRupiah(-50000);
      expect(result).toMatch(/-Rp\s?50\.000/);
    });

    it('handles null and undefined gracefully', () => {
      expect(formatRupiah(null)).toMatch(/Rp\s?0/);
      expect(formatRupiah(undefined)).toMatch(/Rp\s?0/);
      expect(formatRupiah(NaN)).toMatch(/Rp\s?0/);
    });
  });

  describe('parseRupiah', () => {
    it('parses formatted rupiah string into numeric value', () => {
      expect(parseRupiah('Rp 150.000')).toBe(150000);
      expect(parseRupiah('Rp. 2.500.000')).toBe(2500000);
    });

    it('handles negative values correctly', () => {
      expect(parseRupiah('-Rp 50.000')).toBe(-50000);
    });

    it('handles numeric input directly', () => {
      expect(parseRupiah(75000)).toBe(75000);
    });

    it('handles invalid or empty strings gracefully', () => {
      expect(parseRupiah('')).toBe(0);
      expect(parseRupiah('abc')).toBe(0);
    });
  });
});
