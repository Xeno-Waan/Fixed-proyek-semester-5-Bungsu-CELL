// src/features/finance/data/finance.ts
import { CashEntry, UsedPhone } from '@/types';

export const initialCashEntries: CashEntry[] = [
  {
    id: 'cash-001',
    date: new Date().toISOString(),
    cashType: 'counter',
    flow: 'in',
    amount: 500000,
    adminFee: 0,
    category: 'Penjualan',
    description: 'Penjualan awal hari',
    referenceId: undefined,
  },
  {
    id: 'cash-002',
    date: new Date().toISOString(),
    cashType: 'ppob',
    flow: 'out',
    amount: 20000,
    adminFee: 500,
    category: 'Token Listrik',
    description: 'Pembelian token listrik',
    referenceId: undefined,
  },
];

export const initialUsedPhones: UsedPhone[] = [
  {
    id: 'phone-001',
    brand: 'Samsung',
    model: 'Galaxy S21',
    conditionDescription: 'Bekas mulus',
    purchasePrice: 2000000,
    repairSparepartCost: 150000,
    targetSellingPrice: 2500000,
    isSold: false,
    purchaseDate: new Date().toISOString(),
  },
];
