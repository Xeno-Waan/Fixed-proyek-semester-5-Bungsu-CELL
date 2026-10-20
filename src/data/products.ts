import { Product } from '@/types';

export const initialProducts: Product[] = [
  {
    id: 'prd-001',
    code: 'ACS-001',
    name: 'Casing Silikon Matte iPhone 13/14',
    category: 'casing',
    price: 35000,
    costPrice: 18000,
    stock: 24,
    minStock: 5,
    unit: 'pcs',
  },
  {
    id: 'prd-002',
    code: 'CHG-001',
    name: 'Fast Charger Robot 20W Type-C',
    category: 'charger',
    price: 85000,
    costPrice: 52000,
    stock: 3,
    minStock: 5, // Triggers low stock warning (stock <= minStock)
    unit: 'unit',
  },
  {
    id: 'prd-003',
    code: 'TG-001',
    name: 'Tempered Glass Full Cover Samsung A54',
    category: 'tempered_glass',
    price: 25000,
    costPrice: 10000,
    stock: 15,
    minStock: 5,
    unit: 'pcs',
  },
  {
    id: 'prd-004',
    code: 'SIM-001',
    name: 'Kartu Perdana Telkomsel 14GB',
    category: 'kartu_perdana',
    price: 45000,
    costPrice: 38000,
    stock: 12,
    minStock: 5,
    unit: 'pcs',
  },
  {
    id: 'prd-005',
    code: 'VCH-001',
    name: 'Voucher Kuota Indosat 10GB 30 Hari',
    category: 'voucher_fisik',
    price: 32000,
    costPrice: 28500,
    stock: 2,
    minStock: 5, // Triggers low stock warning
    unit: 'pcs',
  },
];
