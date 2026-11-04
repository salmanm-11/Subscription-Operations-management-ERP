// TypeScript Domain Types for Karama Mess Management Software

export type UserRole = 'owner' | 'manager' | 'staff';
export type CustomerStatus = 'active' | 'inactive' | 'paused' | 'left' | 'cancelled' | 'trial' | 'cancelling_soon';
export type AttendanceStatus = 'present' | 'absent' | 'cancelled';
export type InvoiceStatus = 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'cheque' | 'other';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Business {
  id: string;
  name: string;
  trade_license_no?: string;
  owner_id: string;
  created_at: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  role: UserRole;
  is_active: boolean;
  profile?: UserProfile;
  created_at: string;
}

export interface BusinessSettings {
  business_id: string;
  currency: string; // 'AED'
  timezone: string; // 'Asia/Dubai'
  contact_person?: string;
  phone?: string;
  emergency_contact?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  logo_url?: string;
  invoice_prefix: string;
  next_invoice_number: number;
  default_payment_terms_days: number;
  tax_enabled: boolean;
  tax_rate: number;
  tax_number?: string;
  business_notes?: string;
  due_reminder_days?: number; // Days window for approaching payment due reminders (e.g. 5 days)
}

export interface Building {
  id: string;
  business_id: string;
  name: string;
  area?: string;
  address?: string;
  total_floors?: number;
  door_passcode?: string;
  notes?: string;
  rooms_count?: number;
  active_customers_count?: number;
  created_at: string;
}

export interface Room {
  id: string;
  business_id: string;
  building_id?: string;
  room_number: string;
  floor_number?: number;
  capacity: number;
  delivery_notes?: string;
  building?: Building;
  created_at: string;
}

export interface MealPlan {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  monthly_price: number; // AED
  per_meal_price: number; // AED
  includes_breakfast: boolean;
  includes_lunch: boolean;
  includes_dinner: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  customer_code: string;
  full_name: string;
  phone?: string;
  emergency_contact?: string;
  email?: string;
  building_id?: string;
  room_id?: string;
  building_name_cache?: string;
  apartment_cache?: string;
  meal_plan_id?: string;
  has_breakfast: boolean;
  has_lunch: boolean;
  has_dinner: boolean;
  monthly_rate: number; // AED
  dietary_preferences?: string;
  delivery_time?: string;
  door_passcode?: string;
  joining_date: string;
  billing_start_date: string;
  billing_end_date?: string;
  cancellation_date?: string; // Scheduled cancellation date (YYYY-MM-DD)
  cancellation_reason?: string; // Notice remarks or reason for leaving
  cancellation_notice_date?: string; // Date notice was received (YYYY-MM-DD)
  payment_made_up_to_date?: string;
  billed_up_to_date?: string;
  status: CustomerStatus;
  payment_rating?: 'Good' | 'Late payer' | 'Bad';
  total_overdue?: number; // Calculated or cached AED
  managed_by?: string; // 'admin' | 'manager' | handler username
  notes?: string;
  building?: Building;
  room?: Room;
  meal_plan?: MealPlan;
  created_at: string;
  updated_at: string;
}

export interface MealAttendance {
  id: string;
  business_id: string;
  customer_id: string;
  attendance_date: string; // YYYY-MM-DD
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  status: AttendanceStatus;
  marked_by?: string;
  notes?: string;
  customer?: Customer;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  business_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number; // AED
}

export interface Invoice {
  id: string;
  business_id: string;
  invoice_number: string;
  customer_id: string;
  issue_date: string;
  due_date: string;
  period_start: string;
  period_end: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number; // AED
  paid_amount: number; // AED
  balance_amount: number; // AED
  status: InvoiceStatus;
  notes?: string;
  customer?: Customer;
  customer_name_cache?: string;
  building_cache?: string;
  items?: InvoiceItem[];
  payments?: Payment[];
  created_at: string;
}

export interface Payment {
  id: string;
  business_id: string;
  payment_number: string;
  customer_id: string;
  invoice_id?: string;
  amount: number; // AED
  payment_date: string;
  payment_method: PaymentMethod;
  reference_number?: string;
  notes?: string;
  is_reversed: boolean;
  reversal_reason?: string;
  reversed_at?: string;
  customer?: Customer;
  invoice?: Invoice;
  created_at: string;
}

export interface DashboardMetrics {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  cancelledCustomers?: number;
  trialCustomers?: number;
  runningAccounts: number;
  newCustomersThisMonth: number;
  todayBreakfast: number;
  todayLunch: number;
  todayDinner: number;
  todayTotalMeals: number;
  billedThisMonth: number;
  collectedThisMonth: number;
  totalOutstandingDues: number;
  dueSoonCount: number;
  overdueInvoicesCount: number;
  recentCustomers: Customer[];
  upcomingPayments: Customer[];
}

// ==========================================
// SYSTEM ACTIVITY LOG TYPES
// ==========================================

export type LogModuleType =
  | 'Customers'
  | 'Billing'
  | 'Payments'
  | 'Vendors'
  | 'Attendance'
  | 'Buildings'
  | 'Meal Plans'
  | 'Settings'
  | 'Authentication'
  | 'System';

export type LogActionType =
  | 'ADD'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PAYMENT'
  | 'INVOICE'
  | 'IMPORT'
  | 'EXPORT'
  | 'PASSWORD_CHANGE'
  | 'CONFIG_CHANGE';

export interface SystemActivityLog {
  id: string;
  timestamp: string;      // ISO 8601 e.g. 2026-10-28T17:15:00.000Z
  userId?: string;
  userName: string;       // e.g. 'admin' or 'manager'
  userRole?: string;      // e.g. 'Administrator' or 'Operations Manager'
  module: LogModuleType;
  action: LogActionType;
  title: string;
  details: string;
  entityId?: string;
  status?: 'success' | 'warning' | 'info';
}


// ==========================================
// VENDOR ACCOUNTS MANAGEMENT MODULE TYPES
// ==========================================

export type VendorCategory =
  | 'Meal Catering / Kitchen'
  | 'Groceries & Provisions'
  | 'Meat & Poultry'
  | 'Vegetables & Fruits'
  | 'Packaging Supplies'
  | 'Gas & Utilities'
  | 'Maintenance & Services'
  | 'Other';

export type VendorStatus = 'active' | 'inactive';

export type ChargeCalculationType = 'fixed' | 'percentage';

export interface VendorChargeConfig {
  type: ChargeCalculationType;
  value: number; // Fixed amount in AED or percentage (e.g. 5 for 5%)
  is_enabled: boolean;
  effective_date?: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  business_id: string;
  vendor_code: string; // e.g. VEND-001
  name: string;
  contact_person?: string;
  phone?: string;
  address?: string;
  category: VendorCategory;
  // Meal rates (AED)
  breakfast_rate: number;
  lunch_rate: number;
  dinner_rate: number;
  // Configured additional charges
  service_charge_config: VendorChargeConfig;
  delivery_charge_config: VendorChargeConfig;
  packing_charge_config: VendorChargeConfig;
  other_charges_config: VendorChargeConfig;
  opening_balance: number; // Positive = Mess owes Vendor (Payable); Negative = Advance/Credit with Vendor
  payment_terms: string;   // e.g. 'Daily', 'Weekly', 'Bi-Weekly', 'Net 15', 'Net 30', 'Cash on Delivery'
  status: VendorStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type VendorTransactionType = 'daily_meal_entry' | 'supplier_purchase' | 'adjustment';

export interface VendorTransaction {
  id: string;
  business_id: string;
  vendor_id: string;
  vendor_name_cache?: string;
  transaction_type: VendorTransactionType;
  date: string; // YYYY-MM-DD
  day_name?: string; // Thursday, Friday, etc.
  description?: string;
  
  // For daily meal service entries:
  breakfast_qty: number;
  lunch_qty: number;
  dinner_qty: number;
  breakfast_rate: number; // Historical rate frozen for this transaction
  lunch_rate: number;
  dinner_rate: number;
  meal_charges: number;   // (bf_qty * bf_rate) + (ln_qty * ln_rate) + (dn_qty * dn_rate)
  
  // Additional charges frozen for this transaction:
  service_charge: number;
  delivery_charge: number;
  packing_charge: number;
  other_charges: number;
  discount: number;
  
  // Total charges = meal_charges + service + delivery + packing + other - discount
  total_charges: number;
  
  // Payments recorded directly with or against this entry (if any):
  amount_paid: number;
  
  // Computed historical running balance after this transaction
  running_balance: number;
  
  payment_method?: string;
  reference_no?: string;
  remarks?: string;
  
  created_at: string;
  updated_at: string;
}

export interface VendorPayment {
  id: string;
  business_id: string;
  payment_number: string; // e.g. VPAY-001
  vendor_id: string;
  vendor_name_cache?: string;
  payment_date: string; // YYYY-MM-DD
  amount: number;       // AED
  payment_method: 'cash' | 'bank_transfer' | 'card' | 'cheque' | 'online' | 'other';
  reference_number?: string;
  remarks?: string;
  is_reversed?: boolean;
  reversal_reason?: string;
  created_at: string;
}

export interface VendorAuditLog {
  id: string;
  business_id: string;
  vendor_id?: string;
  vendor_name?: string;
  action: 'create_vendor' | 'update_vendor' | 'charges_update' | 'daily_entry' | 'edit_transaction' | 'delete_transaction' | 'payment_record' | 'excel_import' | 'correction';
  details: string;
  performed_by: string;
  timestamp: string;
}

export interface VendorStatementItem {
  id: string;
  date: string;
  day_name?: string;
  type: string;
  description: string;
  breakfast_qty?: number;
  lunch_qty?: number;
  dinner_qty?: number;
  meal_charges: number;
  service_charge: number;
  delivery_charge: number;
  packing_charge: number;
  other_charges: number;
  discount: number;
  total_charges: number;
  payments: number;
  running_balance: number;
  remarks?: string;
  reference_no?: string;
}

export interface VendorStatement {
  vendor: Vendor;
  startDate?: string;
  endDate?: string;
  openingBalance: number;
  items: VendorStatementItem[];
  totalCharges: number;
  totalPayments: number;
  closingBalance: number;
}

export interface VendorDashboardMetrics {
  totalVendors: number;
  activeVendors: number;
  totalChargesThisMonth: number;
  totalOutstandingPayables: number;
  recentTransactions: VendorTransaction[];
  upcomingPayments: {
    vendorId: string;
    vendorName: string;
    balance: number;
    paymentTerms: string;
    status: 'urgent' | 'due_soon' | 'normal' | 'credit';
  }[];
  vendorsWithBalances: {
    vendor: Vendor;
    balance: number;
    status: 'payable' | 'credit' | 'settled';
  }[];
  monthlyExpenses: {
    month: string;
    label: string;
    charges: number;
    payments: number;
  }[];
}

