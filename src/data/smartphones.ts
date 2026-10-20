import { Smartphone, Criteria } from '@/types';

export const sawCriteria: Criteria[] = [
  {
    code: 'C1',
    name: 'Harga',
    attribute: 'cost',
    description: 'Harga unit smartphone dalam Rupiah. Semakin murah, nilai semakin tinggi.',
    scaleType: 'raw_numeric',
    defaultWeight: 0.25,
  },
  {
    code: 'C2',
    name: 'RAM',
    attribute: 'benefit',
    description: 'Kapasitas RAM dalam Gigabyte (GB). Semakin besar, performa multitasking semakin tinggi.',
    scaleType: 'raw_numeric',
    defaultWeight: 0.15,
  },
  {
    code: 'C3',
    name: 'Penyimpanan Internal',
    attribute: 'benefit',
    description: 'Kapasitas ROM dalam Gigabyte (GB). Semakin besar, kapasitas simpan semakin tinggi.',
    scaleType: 'raw_numeric',
    defaultWeight: 0.15,
  },
  {
    code: 'C4',
    name: 'Kualitas Kamera',
    attribute: 'benefit',
    description: 'Rating kualitas foto & sensor dalam skala 1–5.',
    scaleType: 'scale_1_5',
    defaultWeight: 0.15,
  },
  {
    code: 'C5',
    name: 'Desain Modul Kamera',
    attribute: 'benefit',
    description: 'Estetika modul kamera yang compact, tipis, dan subtle dalam skala 1–5.',
    scaleType: 'scale_1_5',
    defaultWeight: 0.10,
  },
  {
    code: 'C6',
    name: 'Kapasitas Baterai',
    attribute: 'benefit',
    description: 'Kapasitas baterai dalam mAh. Semakin besar, ketahanan semakin tinggi.',
    scaleType: 'raw_numeric',
    defaultWeight: 0.10,
  },
  {
    code: 'C7',
    name: 'Kondisi Unit',
    attribute: 'benefit',
    description: 'Kondisi fisik unit (Baru=5, Bekas Mulus=4, Bekas Minus Ringan=3).',
    scaleType: 'scale_1_5',
    defaultWeight: 0.10,
  },
];

export const initialSmartphones: Smartphone[] = [
  {
    id: 'sp-001',
    brand: 'Xiaomi',
    model: 'Redmi Note 13 (8/256)',
    condition: 'baru',
    price: 2499000,
    specs: {
      ram: 8,
      storage: 256,
      battery: 5000,
      cameraDescription: 'Triple camera 108MP + 8MP ultra-wide + 2MP macro',
      chipset: 'Snapdragon 685 (6nm)',
    },
    criteria: {
      price: 2499000, // C1 (Cost)
      ram: 8, // C2 (Benefit)
      storage: 256, // C3 (Benefit)
      cameraQualityRating: 4, // C4 (Benefit 1-5)
      cameraDesignRating: 4, // C5 (Benefit 1-5, flush & elegant)
      battery: 5000, // C6 (Benefit)
      conditionRating: 5, // C7 (Benefit: Baru=5)
    },
    isActive: true,
  },
  {
    id: 'sp-002',
    brand: 'Samsung',
    model: 'Samsung Galaxy A15 (8/128)',
    condition: 'baru',
    price: 2699000,
    specs: {
      ram: 8,
      storage: 128,
      battery: 5000,
      cameraDescription: 'Triple 50MP + 5MP + 2MP Super AMOLED',
      chipset: 'Helio G99',
    },
    criteria: {
      price: 2699000,
      ram: 8,
      storage: 128,
      cameraQualityRating: 4,
      cameraDesignRating: 5, // Iconic flat camera island
      battery: 5000,
      conditionRating: 5,
    },
    isActive: true,
  },
  {
    id: 'sp-003',
    brand: 'Infinix',
    model: 'Infinix Note 40 (8/256)',
    condition: 'baru',
    price: 2399000,
    specs: {
      ram: 8,
      storage: 256,
      battery: 5000,
      cameraDescription: '108MP Super-Zoom, Active Halo Lighting',
      chipset: 'Helio G99 Ultimate',
    },
    criteria: {
      price: 2399000,
      ram: 8,
      storage: 256,
      cameraQualityRating: 4,
      cameraDesignRating: 3, // slightly bulky camera island
      battery: 5000,
      conditionRating: 5,
    },
    isActive: true,
  },
  {
    id: 'sp-004',
    brand: 'Xiaomi',
    model: 'Redmi Note 10 Pro (8/128) - Bekas',
    condition: 'bekas_mulus',
    price: 1850000,
    specs: {
      ram: 8,
      storage: 128,
      battery: 5020,
      cameraDescription: 'Quad 108MP Samsung HM2, 120Hz AMOLED',
      chipset: 'Snapdragon 732G',
    },
    criteria: {
      price: 1850000,
      ram: 8,
      storage: 128,
      cameraQualityRating: 4,
      cameraDesignRating: 4,
      battery: 5020,
      conditionRating: 4, // Bekas mulus = 4
    },
    isActive: true,
  },
];
