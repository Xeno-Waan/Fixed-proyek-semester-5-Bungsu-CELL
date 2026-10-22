/**
 * Domain and Core Types for Bungsu Cell System
 * Reference: docs/PRD.md and docs/IMPLEMENTATION_PLAN.md
 */

// ==========================================
// User & Role Simulation Types
// ==========================================
export type UserRole = 'admin' | 'kasir' | 'teknisi' | 'pelanggan';

export interface CurrentUser {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// ==========================================
// 1. POS & Inventory Types (Kasir & Stok)
// ==========================================
export type ProductCategory = 
  | 'aksesoris' 
  | 'casing' 
  | 'charger' 
  | 'tempered_glass' 
  | 'kartu_perdana' 
  | 'voucher_fisik';

export interface Product {
  id: string;
  code: string;
  name: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoiceNumber: string;
  date: string; // ISO format
  items: SaleItem[];
  totalAmount: number;
  cashReceived: number;
  change: number;
  cashierName: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  previousStock: number;
  currentStock: number;
  note: string;
  timestamp: string;
}

// ==========================================
// 2. Service Management Types (Servis HP)
// ==========================================
export type ServiceStatus = 
  | 'pengecekan' 
  | 'proses_perbaikan' 
  | 'selesai' 
  | 'dibatalkan';

export interface ServiceStatusHistory {
  status: ServiceStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface ServiceOrder {
  id: string;
  invoiceNumber: string; // e.g. "SRV-20261020-001"
  customerName: string;
  customerPhone: string;
  deviceType: string;
  deviceBrand: string;
  complaint: string;
  estimatedCost: number;
  finalCost?: number;
  status: ServiceStatus;
  receivedDate: string;
  completionDate?: string;
  statusHistory: ServiceStatusHistory[];
  technicianNote?: string;
  // NOTE: Screen lock PIN/pattern is STRICTLY EXCLUDED per security requirements
}

// ==========================================
// 3. Finance & PPOB Types (Keuangan & Kas)
// ==========================================
export type CashType = 'counter' | 'ppob'; // Pemisahan kas konter dan kas operasional agen PPOB

export type PPOBTransactionType = 
  | 'transfer' 
  | 'tarik_tunai' 
  | 'token_listrik' 
  | 'bpjs' 
  | 'pulsa_data';

export interface CashEntry {
  id: string;
  date: string;
  cashType: CashType;
  flow: 'in' | 'out';
  amount: number;
  adminFee?: number;
  category: string;
  description: string;
  referenceId?: string;
}

export interface UsedPhone {
  id: string;
  brand: string;
  model: string;
  conditionDescription: string;
  purchasePrice: number;
  repairSparepartCost: number;
  targetSellingPrice: number;
  actualSellingPrice?: number;
  isSold: boolean;
  purchaseDate: string;
  soldDate?: string;
  netProfit?: number; // actualSellingPrice - (purchasePrice + repairSparepartCost)
}

// ==========================================
// 4. Smartphone Recommendation (SPK SAW) Types
// ==========================================
export type SmartphoneCondition = 'baru' | 'bekas_mulus' | 'bekas_minus_ringan';

export interface SmartphoneCriteriaValues {
  // Raw values
  price: number; // C1: Cost (IDR)
  ram: number; // C2: Benefit (GB)
  storage: number; // C3: Benefit (GB)
  cameraQualityRating: number; // C4: Benefit (Scale 1-5)
  cameraDesignRating: number; // C5: Benefit (Scale 1-5, compact/thin/subtle)
  battery: number; // C6: Benefit (mAh)
  conditionRating: number; // C7: Benefit (Scale 1-5: Baru=5, Bekas Mulus=4, Minus Ringan=3)
}

export interface Smartphone {
  id: string;
  brand: string;
  model: string;
  condition: SmartphoneCondition;
  price: number;
  specs: {
    ram: number;
    storage: number;
    battery: number;
    cameraDescription: string;
    chipset: string;
  };
  criteria: SmartphoneCriteriaValues;
  isActive: boolean;
  imageUrl?: string;
}

export type CriteriaCode = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7';
export type CriteriaAttribute = 'cost' | 'benefit';

export interface Criteria {
  code: CriteriaCode;
  name: string;
  attribute: CriteriaAttribute;
  description: string;
  scaleType: 'raw_numeric' | 'scale_1_5';
  defaultWeight: number; // Percentage or fraction
}

export interface CustomerPreference {
  weights: Record<CriteriaCode, number>; // Must sum to positive number, normalized to 1
  minRam?: number;
  maxPrice?: number;
  preferredCondition?: SmartphoneCondition | 'all';
}

export interface SAWNormalizedItem {
  smartphoneId: string;
  model: string;
  condition: SmartphoneCondition;
  price: number;
  normalizedScores: Record<CriteriaCode, number>; // r_ij
  weightedScores: Record<CriteriaCode, number>; // w_j * r_ij
  finalScore: number; // V_i
  rank: number;
}

// ==========================================
// UI & Navigation Types
// ==========================================
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
}
