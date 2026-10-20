/**
 * Currency utility functions for Indonesian Rupiah formatting
 * Reference: docs/UI-GUIDELINE.md
 */

/**
 * Format a number to standard Indonesian Rupiah string
 * Example: 150000 -> "Rp 150.000"
 */
export function formatRupiah(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }

  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(Math.round(amount));

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absoluteAmount);

  // Replace standard non-breaking space if any
  const cleanFormatted = formatted.replace(/\s+/g, ' ');

  return isNegative ? `-${cleanFormatted}` : cleanFormatted;
}

/**
 * Parse an Indonesian Rupiah or string number into a numeric value
 * Example: "Rp 150.000" -> 150000
 */
export function parseRupiah(value: string | number): number {
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }

  if (!value || typeof value !== 'string') {
    return 0;
  }

  // Remove non-digit characters except minus sign
  const isNegative = value.trim().startsWith('-');
  const cleanString = value.replace(/[^0-9]/g, '');

  if (!cleanString) {
    return 0;
  }

  const parsed = parseInt(cleanString, 10);
  return isNegative ? -parsed : parsed;
}
