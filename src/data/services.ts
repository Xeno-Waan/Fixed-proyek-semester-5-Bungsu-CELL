import { ServiceOrder } from '@/types';

export const initialServices: ServiceOrder[] = [
  {
    id: 'srv-001',
    invoiceNumber: 'SRV-20261020-001',
    customerName: 'Ahmad Fauzi',
    customerPhone: '081234567890',
    deviceType: 'Redmi Note 11',
    deviceBrand: 'Xiaomi',
    complaint: 'Layar LCD pecah dan tidak menampilkan gambar',
    estimatedCost: 350000,
    status: 'proses_perbaikan',
    receivedDate: '2026-10-18T10:30:00.000Z',
    technicianNote: 'Sparepart LCD sudah tiba, sedang dalam proses pemasangan',
    statusHistory: [
      {
        status: 'pengecekan',
        timestamp: '2026-10-18T10:30:00.000Z',
        note: 'Unit diterima dan diperiksa fisik layar pecah',
        updatedBy: 'Siti (Kasir)',
      },
      {
        status: 'proses_perbaikan',
        timestamp: '2026-10-19T09:00:00.000Z',
        note: 'Pemasangan modul layar LCD original OEM',
        updatedBy: 'Rahmat (Teknisi)',
      },
    ],
  },
  {
    id: 'srv-002',
    invoiceNumber: 'SRV-20261020-002',
    customerName: 'Dewi Lestari',
    customerPhone: '085712349988',
    deviceType: 'Samsung Galaxy A32',
    deviceBrand: 'Samsung',
    complaint: 'Baterai drop cepat dan kembung',
    estimatedCost: 220000,
    finalCost: 220000,
    status: 'selesai',
    receivedDate: '2026-10-17T14:15:00.000Z',
    completionDate: '2026-10-19T16:00:00.000Z',
    technicianNote: 'Baterai baru sudah dipasang dan lolos uji charging 100%',
    statusHistory: [
      {
        status: 'pengecekan',
        timestamp: '2026-10-17T14:15:00.000Z',
        note: 'Pengecekan arus pengisian daya',
        updatedBy: 'Siti (Kasir)',
      },
      {
        status: 'proses_perbaikan',
        timestamp: '2026-10-18T11:00:00.000Z',
        note: 'Penggantian modul baterai 5000mAh',
        updatedBy: 'Rahmat (Teknisi)',
      },
      {
        status: 'selesai',
        timestamp: '2026-10-19T16:00:00.000Z',
        note: 'Unit selesai dan siap diambil pelanggan',
        updatedBy: 'Rahmat (Teknisi)',
      },
    ],
  },
];
