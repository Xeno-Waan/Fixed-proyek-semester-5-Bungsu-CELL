import { CashEntry, UsedPhone } from '@/types';

export const initialCashEntries: CashEntry[] = [
  {
    id: 'csh-001',
    date: '2026-10-20T08:00:00.000Z',
    cashType: 'counter',
    flow: 'in',
    amount: 500000,
    category: 'Modal Awal Kasir',
    description: 'Modal kas kecil konter pagi hari',
  },
  {
    id: 'csh-002',
    date: '2026-10-20T09:30:00.000Z',
    cashType: 'ppob',
    flow: 'in',
    amount: 10000000,
    category: 'Saldo Agen PPOB',
    description: 'Saldo rekening operasional transfer & tarik tunai',
  },
  {
    id: 'csh-003',
    date: '2026-10-20T10:15:00.000Z',
    cashType: 'ppob',
    flow: 'in',
    amount: 250000,
    adminFee: 5000,
    category: 'Transfer Uang BRI',
    description: 'Simulasi transaksi transfer antar bank oleh pelanggan',
  },
];

export const initialUsedPhones: UsedPhone[] = [
  {
    id: 'uph-001',
    brand: 'Xiaomi',
    model: 'Redmi Note 10 Pro (8/128)',
    conditionDescription: 'Mulus 95%, bezel ada baret pemakaian halus, LCD original',
    purchasePrice: 1400000,
    repairSparepartCost: 150000, // ganti backdoor
    targetSellingPrice: 1900000,
    actualSellingPrice: 1850000,
    isSold: true,
    purchaseDate: '2026-10-10T11:00:00.000Z',
    soldDate: '2026-10-18T15:20:00.000Z',
    netProfit: 300000, // 1.850.000 - (1.400.000 + 150.000)
  },
  {
    id: 'uph-002',
    brand: 'Oppo',
    model: 'Oppo Reno 6 5G (8/128)',
    conditionDescription: 'Fullset original, baterai awet, fungsi 100% normal',
    purchasePrice: 2200000,
    repairSparepartCost: 0,
    targetSellingPrice: 2700000,
    isSold: false,
    purchaseDate: '2026-10-15T13:40:00.000Z',
  },
];
