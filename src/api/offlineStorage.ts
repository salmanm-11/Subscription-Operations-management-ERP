// Offline and Local Fallback Storage for Karama Mess Management
// Contains the authenticated multi-tenant data structures pre-seeded from Karama Mess records.

import { Customer, CustomerStatus, Building, Room, MealPlan, Invoice, Payment, Business, BusinessSettings, DashboardMetrics, Vendor, VendorTransaction, VendorPayment, VendorAuditLog, VendorDashboardMetrics, VendorStatement, VendorStatementItem } from '../types';
import { roundCurrency, addCurrency, subtractCurrency, roundVendorCurrency, formatVendorAED } from '../utils/currency';
import { getApproachingReminders, getReminderDaysSetting } from '../utils/reminderService';
import { getMonthlySubscriptionRate } from '../utils/billingCycleService';
import fullData from './fullInitialData.json';
import initialVendorData from './initialVendorData.json';
import { ActivityLogService } from './activityLogService';

const STORAGE_KEYS = {
  CURRENT_USER: 'karama_current_user',
  CURRENT_BUSINESS: 'karama_current_business',
  CUSTOMERS: 'karama_customers',
  BUILDINGS: 'karama_buildings',
  ROOMS: 'karama_rooms',
  MEAL_PLANS: 'karama_meal_plans',
  INVOICES: 'karama_invoices',
  PAYMENTS: 'karama_payments',
  SETTINGS: 'karama_settings',
  ATTENDANCE: 'karama_attendance',
  SUPABASE_CONFIG: 'karama_supabase_config',
  VENDORS: 'karama_vendors',
  VENDOR_TRANSACTIONS: 'karama_vendor_transactions',
  VENDOR_PAYMENTS: 'karama_vendor_payments',
  VENDOR_AUDIT_LOGS: 'karama_vendor_audit_logs'
};

// Initial default business
export const DEFAULT_BUSINESS: Business = {
  id: 'b0000000-0000-0000-0000-000000000001',
  name: 'Karama Mess & Catering',
  trade_license_no: 'DXB-MESS-2026-889',
  owner_id: 'u0000000-0000-0000-0000-000000000001',
  created_at: '2026-01-01T00:00:00Z'
};

export const DEFAULT_SETTINGS: BusinessSettings = {
  business_id: DEFAULT_BUSINESS.id,
  currency: 'AED',
  timezone: 'Asia/Dubai',
  contact_person: 'Admin Manager',
  phone: '+971 50 123 4567',
  email: 'admin@karamamess.ae',
  address: 'Al Karama, Opposite Karama Center, Dubai',
  city: 'Dubai',
  country: 'United Arab Emirates',
  invoice_prefix: 'INV-2026-',
  next_invoice_number: 1001,
  default_payment_terms_days: 7,
  tax_enabled: false,
  tax_rate: 5.00,
  tax_number: '100200300400003',
  business_notes: 'Good Food. Happy People.',
  due_reminder_days: 5
};

export const DEFAULT_MEAL_PLANS: MealPlan[] = [
  {
    id: 'mp-3-times',
    business_id: DEFAULT_BUSINESS.id,
    name: '3 Times (Breakfast, Lunch & Dinner)',
    description: 'Full 3-meals daily tiffin delivery (AED 380/mo, AED 12.67 - 13/day)',
    monthly_price: 380.00,
    per_meal_price: 13.00,
    includes_breakfast: true,
    includes_lunch: true,
    includes_dinner: true,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'mp-2-times-ld',
    business_id: DEFAULT_BUSINESS.id,
    name: '2 Times (Lunch & Dinner)',
    description: 'Afternoon Lunch and Evening Dinner box delivery (AED 300/mo, AED 10/day)',
    monthly_price: 300.00,
    per_meal_price: 10.00,
    includes_breakfast: false,
    includes_lunch: true,
    includes_dinner: true,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'mp-2-times-bd',
    business_id: DEFAULT_BUSINESS.id,
    name: '2 Times (Breakfast & Dinner)',
    description: 'Morning Breakfast and Evening Dinner service (AED 300/mo, AED 10/day)',
    monthly_price: 300.00,
    per_meal_price: 10.00,
    includes_breakfast: true,
    includes_lunch: false,
    includes_dinner: true,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'mp-2-times-bl',
    business_id: DEFAULT_BUSINESS.id,
    name: '2 Times (Breakfast & Lunch)',
    description: 'Morning Breakfast and Office Lunch delivery (AED 300/mo, AED 10/day)',
    monthly_price: 300.00,
    per_meal_price: 10.00,
    includes_breakfast: true,
    includes_lunch: true,
    includes_dinner: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'mp-1-time-lunch',
    business_id: DEFAULT_BUSINESS.id,
    name: '1 Time (Lunch Only)',
    description: 'Office or Room lunch delivery (AED 180/mo, AED 6/day)',
    monthly_price: 180.00,
    per_meal_price: 6.00,
    includes_breakfast: false,
    includes_lunch: true,
    includes_dinner: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'mp-1-time-dinner',
    business_id: DEFAULT_BUSINESS.id,
    name: '1 Time (Dinner Only)',
    description: 'Evening dinner delivery (AED 180/mo, AED 6/day)',
    monthly_price: 180.00,
    per_meal_price: 6.00,
    includes_breakfast: false,
    includes_lunch: false,
    includes_dinner: true,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'mp-1-time-breakfast',
    business_id: DEFAULT_BUSINESS.id,
    name: '1 Time (Breakfast Only)',
    description: 'Morning breakfast delivery (AED 180/mo, AED 6/day)',
    monthly_price: 180.00,
    per_meal_price: 6.00,
    includes_breakfast: true,
    includes_lunch: false,
    includes_dinner: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  }
];

function getInitialData() {
  return {
    buildings: [] as Building[],
    customers: [] as Customer[],
    invoices: [] as Invoice[],
    payments: [] as Payment[],
    ledger: []
  };
}

export class OfflineStorage {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error('Storage write error:', err);
    }
  }

  static getLicenseStatus(): string {
    return this.getItem<string>('karama_license_status', 'ACTIVE');
  }

  static setLicenseStatus(status: string): void {
    this.setItem('karama_license_status', status);
  }

  static clearAllBusinessData(): void {
    this.setItem(STORAGE_KEYS.CUSTOMERS, []);
    this.setItem(STORAGE_KEYS.INVOICES, []);
    this.setItem(STORAGE_KEYS.PAYMENTS, []);
    this.setItem(STORAGE_KEYS.VENDORS, []);
    this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, []);
    this.setItem(STORAGE_KEYS.VENDOR_PAYMENTS, []);
    this.setItem(STORAGE_KEYS.VENDOR_AUDIT_LOGS, []);
    this.setItem(STORAGE_KEYS.ATTENDANCE, {});
    ActivityLogService.clearLogs();
  }

  static init() {
    if (typeof localStorage === 'undefined') return;
    const isVitest = typeof process !== 'undefined' && Boolean(process.env?.VITEST || process.env?.NODE_ENV === 'test');
    const DATA_VERSION = 'karama_clean_production_v10';

    if (localStorage.getItem('karama_data_version') !== DATA_VERSION) {
      this.setItem(STORAGE_KEYS.CURRENT_BUSINESS, DEFAULT_BUSINESS);
      this.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
      this.setItem(STORAGE_KEYS.MEAL_PLANS, DEFAULT_MEAL_PLANS);
      this.clearAllBusinessData();
      localStorage.setItem('karama_data_version', DATA_VERSION);
    }

    if (isVitest) {
      // In unit test environment only, seed vendor test data if vendors table is empty
      const currentVendors = this.getItem<Vendor[]>(STORAGE_KEYS.VENDORS, []);
      if (currentVendors.length === 0) {
        this.setItem(STORAGE_KEYS.VENDORS, initialVendorData.vendors);
        this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, initialVendorData.transactions);
        this.setItem(STORAGE_KEYS.VENDOR_PAYMENTS, initialVendorData.payments);
      }
    }
  }

  static getBusiness(): Business {
    return this.getItem(STORAGE_KEYS.CURRENT_BUSINESS, DEFAULT_BUSINESS);
  }

  static getSettings(): BusinessSettings {
    return this.getItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  static saveSettings(settings: Partial<BusinessSettings>): BusinessSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings, currency: 'AED' };
    this.setItem(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // Customers
  static getCustomers(): Customer[] {
    this.init();
    const isVitest = typeof process !== 'undefined' && Boolean(process.env?.VITEST || process.env?.NODE_ENV === 'test');
    if (!isVitest) {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.CUSTOMERS) : null;
      if (raw === null && fullData && (fullData as any).customers && (fullData as any).customers.length > 0) {
        const defaultCustomers = (fullData as any).customers;
        this.setItem(STORAGE_KEYS.CUSTOMERS, defaultCustomers);
        return defaultCustomers;
      }
    }
    const list = this.getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);

    // Automatically transition expired cancellation notices to 'cancelled' status
    const todayStr = new Date().toISOString().split('T')[0];
    let changed = false;
    const synchronized = list.map((c) => {
      if (c.status !== 'cancelled' && c.status !== 'left' && c.cancellation_date && c.cancellation_date < todayStr) {
        changed = true;
        return {
          ...c,
          status: 'cancelled' as CustomerStatus,
          notes: c.notes
            ? `${c.notes}\n[${todayStr}] Notice period ended on ${c.cancellation_date}. Automatically moved to Cancelled status.`
            : `Notice period ended on ${c.cancellation_date}. Automatically moved to Cancelled status.`,
          updated_at: new Date().toISOString(),
        };
      }
      return c;
    });

    if (changed) {
      this.setItem(STORAGE_KEYS.CUSTOMERS, synchronized);
      return synchronized;
    }

    return list;
  }

  static saveCustomer(cust: Partial<Customer>): Customer {
    const customers = this.getCustomers();
    const now = new Date().toISOString();

    if (cust.id) {
      const idx = customers.findIndex(c => c.id === cust.id);
      if (idx !== -1) {
        let cancelDate = cust.cancellation_date !== undefined ? cust.cancellation_date : customers[idx].cancellation_date;
        let cancelReason = cust.cancellation_reason !== undefined ? cust.cancellation_reason : customers[idx].cancellation_reason;
        const notesToCheck = cust.notes || customers[idx].notes;
        if (!cancelDate && notesToCheck && notesToCheck.includes('[NOTICE: Cancelling on ')) {
          const match = notesToCheck.match(/\[NOTICE: Cancelling on (\d{4}-\d{2}-\d{2})(?: \| Reason: ([^\]]+))?\]/);
          if (match) {
            cancelDate = match[1];
            if (match[2]) cancelReason = match[2];
          }
        }
        if (!cancelDate && (cust.status === 'cancelling_soon' || customers[idx].status === 'cancelling_soon')) {
          cancelDate = cust.billing_end_date || customers[idx].billing_end_date;
        }
        if (cust.status && cust.status !== 'cancelling_soon' && cust.cancellation_date === undefined) {
          cancelDate = undefined;
          cancelReason = undefined;
        }
        customers[idx] = {
          ...customers[idx],
          ...cust,
          cancellation_date: cancelDate,
          cancellation_reason: cancelReason,
          updated_at: now,
        };
        this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
        return customers[idx];
      }
    }

    const maxCodeNum = customers.reduce((max, c) => {
      const num = parseInt((c.customer_code || '').replace(/\D/g, ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextCodeNum = Math.max(maxCodeNum + 1, customers.length + 1);

    const newCustomer: Customer = {
      id: cust.id || `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      business_id: DEFAULT_BUSINESS.id,
      customer_code: cust.customer_code || `CUST-${String(nextCodeNum).padStart(3, '0')}`,
      full_name: cust.full_name || 'New Customer',
      phone: cust.phone || '',
      emergency_contact: cust.emergency_contact || '',
      email: cust.email || '',
      building_id: cust.building_id,
      building_name_cache: cust.building_name_cache || '',
      apartment_cache: cust.apartment_cache || '',
      meal_plan_id: cust.meal_plan_id,
      has_breakfast: Boolean(cust.has_breakfast),
      has_lunch: cust.has_lunch !== undefined ? Boolean(cust.has_lunch) : true,
      has_dinner: cust.has_dinner !== undefined ? Boolean(cust.has_dinner) : true,
      monthly_rate: cust.monthly_rate || (() => {
        const mealCount = (Boolean(cust.has_breakfast) ? 1 : 0) +
          (cust.has_lunch !== undefined ? (cust.has_lunch ? 1 : 0) : 1) +
          (cust.has_dinner !== undefined ? (cust.has_dinner ? 1 : 0) : 1);
        return mealCount === 1 ? 180.00 : (mealCount === 2 ? 300.00 : 380.00);
      })(),
      dietary_preferences: cust.dietary_preferences || '',
      delivery_time: cust.delivery_time || '',
      door_passcode: cust.door_passcode || '',
      joining_date: cust.joining_date || now.split('T')[0],
      billing_start_date: cust.billing_start_date || now.split('T')[0],
      payment_made_up_to_date: cust.payment_made_up_to_date,
      billed_up_to_date: cust.billed_up_to_date,
      status: cust.status || 'active',
      payment_rating: cust.payment_rating || 'Good',
      total_overdue: cust.total_overdue || 0,
      managed_by: cust.managed_by || 'admin',
      notes: cust.notes || '',
      created_at: now,
      updated_at: now
    };

    customers.unshift(newCustomer);
    this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
    return newCustomer;
  }

  static deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    if (filtered.length !== customers.length) {
      this.setItem(STORAGE_KEYS.CUSTOMERS, filtered);
      return true;
    }
    return false;
  }

  static deleteAllCustomers(): void {
    this.setItem(STORAGE_KEYS.CUSTOMERS, []);
  }

  static setCustomers(customers: Customer[]): void {
    this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
  }

  // Buildings
  static setBuildings(buildings: Building[]): void {
    this.setItem(STORAGE_KEYS.BUILDINGS, buildings);
  }

  static getBuildings(): Building[] {
    this.init();
    const list = this.getItem<Building[]>(STORAGE_KEYS.BUILDINGS, []);
    if (list.length === 0 && fullData && (fullData as any).buildings && (fullData as any).buildings.length > 0) {
      const seen = new Map<string, number>();
      const defaultBuildings: Building[] = (fullData as any).buildings.map((b: any) => {
        let name = (b.name || '').trim();
        const key = name.toLowerCase();
        if (seen.has(key)) {
          const count = (seen.get(key) || 1) + 1;
          seen.set(key, count);
          const cleanArea = (b.area || '').replace(/^[\p{Emoji}\p{Symbol}\s]+/u, '').trim();
          name = cleanArea ? `${name} - ${cleanArea}` : `${name} (${count})`;
        } else {
          seen.set(key, 1);
        }
        return {
          id: b.id,
          business_id: b.business_id || DEFAULT_BUSINESS.id,
          name: name,
          area: (b.area || 'Burjman & Mankhool').replace(/^[\p{Emoji}\p{Symbol}\s]+/u, '').trim(),
          address: b.address || `${name}, Karama, Dubai`,
          total_floors: b.total_floors || 1,
          created_at: b.created_at || '2026-01-01T00:00:00Z',
        };
      });
      this.setItem(STORAGE_KEYS.BUILDINGS, defaultBuildings);
      return defaultBuildings;
    }

    // Auto-normalize any stored buildings that still carry emoji prefixes in their area
    if (list.length > 0) {
      let modified = false;
      for (const b of list) {
        const cleanArea = (b.area || '').replace(/^[\p{Emoji}\p{Symbol}\s]+/u, '').trim();
        if (cleanArea && b.area !== cleanArea) {
          b.area = cleanArea;
          modified = true;
        }
      }
      if (modified) {
        this.setItem(STORAGE_KEYS.BUILDINGS, list);
      }
    }

    return list;
  }

  static saveBuilding(bld: Partial<Building>): Building {
    const list = this.getBuildings();
    if (bld.id) {
      const idx = list.findIndex(b => b.id === bld.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...bld };
        this.setItem(STORAGE_KEYS.BUILDINGS, list);
        return list[idx];
      }
    }
    const newBuilding: Building = {
      id: `bld-${Date.now()}`,
      business_id: DEFAULT_BUSINESS.id,
      name: bld.name || 'New Building',
      area: bld.area || 'Karama',
      address: bld.address || '',
      total_floors: bld.total_floors || 1,
      door_passcode: bld.door_passcode || '',
      notes: bld.notes || '',
      created_at: new Date().toISOString()
    };
    list.unshift(newBuilding);
    this.setItem(STORAGE_KEYS.BUILDINGS, list);
    return newBuilding;
  }

  static deleteBuilding(id: string): boolean {
    const list = this.getBuildings();
    const filtered = list.filter(b => b.id !== id);
    if (filtered.length !== list.length) {
      this.setItem(STORAGE_KEYS.BUILDINGS, filtered);
      return true;
    }
    return false;
  }

  static deleteBuildings(ids: string[]): boolean {
    const idSet = new Set(ids);
    const list = this.getBuildings();
    const filtered = list.filter(b => !idSet.has(b.id));
    if (filtered.length !== list.length) {
      this.setItem(STORAGE_KEYS.BUILDINGS, filtered);
      return true;
    }
    return false;
  }

  static pruneEmptyBuildings(customers: Customer[]): number {
    const list = this.getBuildings();
    const residingCustomers = customers.filter(c => c.status !== 'left' && c.status !== 'cancelled');
    const occupiedIds = new Set(residingCustomers.map(c => c.building_id).filter(Boolean));
    const occupiedNames = new Set(residingCustomers.map(c => (c.building_name_cache || '').toLowerCase().trim()).filter(Boolean));
    const kept = list.filter(b => occupiedIds.has(b.id) || (b.name && occupiedNames.has(b.name.toLowerCase().trim())));
    const removedCount = list.length - kept.length;
    if (removedCount > 0) {
      this.setItem(STORAGE_KEYS.BUILDINGS, kept);
    }
    return removedCount;
  }

  // Meal Plans
  static getMealPlans(): MealPlan[] {
    this.init();
    return this.getItem<MealPlan[]>(STORAGE_KEYS.MEAL_PLANS, DEFAULT_MEAL_PLANS);
  }

  static saveMealPlan(mp: Partial<MealPlan>): MealPlan {
    const list = this.getMealPlans();
    if (mp.id) {
      const idx = list.findIndex(m => m.id === mp.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...mp };
        this.setItem(STORAGE_KEYS.MEAL_PLANS, list);
        return list[idx];
      }
    }
    const newPlan: MealPlan = {
      id: `mp-${Date.now()}`,
      business_id: DEFAULT_BUSINESS.id,
      name: mp.name || 'Custom Plan',
      description: mp.description || '',
      monthly_price: mp.monthly_price || 380,
      per_meal_price: mp.per_meal_price || 13,
      includes_breakfast: Boolean(mp.includes_breakfast),
      includes_lunch: Boolean(mp.includes_lunch),
      includes_dinner: Boolean(mp.includes_dinner),
      is_active: mp.is_active !== undefined ? Boolean(mp.is_active) : true,
      created_at: new Date().toISOString()
    };
    list.push(newPlan);
    this.setItem(STORAGE_KEYS.MEAL_PLANS, list);
    return newPlan;
  }

  static deleteMealPlan(id: string): boolean {
    const list = this.getMealPlans();
    const filtered = list.filter(m => m.id !== id);
    if (filtered.length !== list.length) {
      this.setItem(STORAGE_KEYS.MEAL_PLANS, filtered);
      return true;
    }
    return false;
  }

  // Invoices & Payments
  static setInvoices(invoices: Invoice[]): void {
    this.setItem(STORAGE_KEYS.INVOICES, invoices);
  }

  static getInvoices(): Invoice[] {
    let invoices = this.getItem<Invoice[]>(STORAGE_KEYS.INVOICES, []);
    const customers = this.getCustomers();

    // Auto-seed initial demo invoices if storage is empty
    if (invoices.length === 0 && fullData && (fullData as any).invoices && (fullData as any).invoices.length > 0) {
      invoices = (fullData as any).invoices;
      this.setItem(STORAGE_KEYS.INVOICES, invoices);
    }

    const cMap = new Map(customers.map((c) => [c.id, c]));

    return invoices.map((inv) => {
      let cust = inv.customer;
      if (!cust && inv.customer_id && cMap.has(inv.customer_id)) {
        cust = cMap.get(inv.customer_id);
      }
      if (!cust && inv.customer_name_cache) {
        cust = customers.find(
          (c) => c.full_name?.toLowerCase() === inv.customer_name_cache?.toLowerCase()
        );
      }
      return cust ? { ...inv, customer: cust } : inv;
    });
  }

  static autoGenerateMissingInvoices(targetCustomers?: Customer[]): Invoice[] {
    const allCustomers = this.getCustomers();
    const customers = targetCustomers || allCustomers;
    const invoices = this.getItem<Invoice[]>(STORAGE_KEYS.INVOICES, []);

    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const defaultStart = `${currentMonthPrefix}-01`;
    const defaultEnd = `${currentMonthPrefix}-${String(lastDayOfMonth).padStart(2, '0')}`;
    const defaultDueDate = `${currentMonthPrefix}-10`;

    const activeCustomers = customers.filter(
      (c) => c.status === 'active' || c.status === 'trial'
    );

    const generated: Invoice[] = [];
    const settings = this.getSettings();
    let customersUpdated = false;

    for (const c of activeCustomers) {
      // Find invoices belonging to this customer
      const custInvoices = invoices.filter(
        (i) =>
          (c.id && i.customer_id === c.id) ||
          (c.full_name && i.customer_name_cache && i.customer_name_cache.toLowerCase().trim() === c.full_name.toLowerCase().trim())
      );

      // Check if customer already has an invoice for the current monthly cycle
      const hasCurrentCycleInvoice = custInvoices.some(
        (i) =>
          i.period_start?.startsWith(currentMonthPrefix) ||
          i.issue_date?.startsWith(currentMonthPrefix)
      );

      if (!hasCurrentCycleInvoice) {
        const invNum = `${settings.invoice_prefix}${settings.next_invoice_number++}`;

        // Determine period start and end first
        let pStart = defaultStart;
        let pEnd = defaultEnd;

        // If customer has a previous invoice, the new cycle starts after the last invoice's period_end
        const sortedPrior = [...custInvoices].sort((a, b) => (b.period_end || '').localeCompare(a.period_end || ''));
        const latestPrior = sortedPrior[0];

        if (latestPrior && latestPrior.period_end) {
          const prevEndDate = new Date(latestPrior.period_end);
          if (!isNaN(prevEndDate.getTime())) {
            const nextStart = new Date(prevEndDate);
            nextStart.setDate(nextStart.getDate() + 1);
            pStart = nextStart.toISOString().split('T')[0];
            const nextDays = new Date(nextStart.getFullYear(), nextStart.getMonth() + 1, 0).getDate();
            const nextEnd = new Date(nextStart);
            nextEnd.setDate(nextEnd.getDate() + (nextDays - 1));
            pEnd = nextEnd.toISOString().split('T')[0];
          }
        } else if (c.billing_start_date) {
          pStart = c.billing_start_date;
          if (c.billing_end_date) pEnd = c.billing_end_date;
        }

        // Automatic 30 vs 31 days rate calculation (380 AED for 30d, 390 AED for 31d for monthly customers)
        const cycleRate = getMonthlySubscriptionRate(c, pStart, pEnd);
        const monthlyRate = cycleRate.effectiveRate;

        // Calculate previous unpaid overdue/balance
        const priorUnpaidSum = custInvoices
          .filter((i) => i.status !== 'paid' && (i.balance_amount || 0) > 0)
          .reduce((sum, i) => sum + (i.balance_amount || 0), 0);

        const previousOverdue = Math.max(c.total_overdue || 0, priorUnpaidSum);

        // Cumulative total: previous due + current month subscription rate
        const cumulativeTotal = previousOverdue + monthlyRate;

        let notesText = cycleRate.is31Days && cycleRate.isMonthlySubscriber
          ? `Monthly mess subscription for ${c.full_name} (31-day month: AED 390)`
          : `Monthly mess subscription for ${c.full_name}`;
        if (previousOverdue > 0) {
          const priorPeriodLabel = latestPrior
            ? `${latestPrior.period_start} to ${latestPrior.period_end}`
            : 'Previous Billing Cycle';
          notesText += ` [ARREARS: AED ${previousOverdue.toFixed(2)} | Period: ${priorPeriodLabel}]`;
        }

        const newInv: Invoice = {
          id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          business_id: DEFAULT_BUSINESS.id,
          invoice_number: invNum,
          customer_id: c.id,
          customer_name_cache: c.full_name,
          building_cache: c.building_name_cache || '',
          issue_date: pStart,
          due_date: defaultDueDate,
          period_start: pStart,
          period_end: pEnd,
          subtotal: monthlyRate,
          discount_amount: 0,
          tax_amount: 0,
          total_amount: cumulativeTotal,
          paid_amount: 0,
          balance_amount: cumulativeTotal,
          status: 'issued',
          notes: notesText,
          created_at: new Date().toISOString(),
        };

        invoices.push(newInv);
        generated.push(newInv);

        // Update customer cumulative overdue and billed up to date
        c.total_overdue = cumulativeTotal;
        c.billed_up_to_date = pEnd;
        customersUpdated = true;

        const matchIdx = allCustomers.findIndex((ac) => ac.id === c.id);
        if (matchIdx !== -1) {
          allCustomers[matchIdx].total_overdue = cumulativeTotal;
          allCustomers[matchIdx].billed_up_to_date = pEnd;
        }
      }
    }

    if (generated.length > 0) {
      this.saveSettings({ next_invoice_number: settings.next_invoice_number });
      this.setItem(STORAGE_KEYS.INVOICES, invoices);
      if (customersUpdated) {
        this.setItem(STORAGE_KEYS.CUSTOMERS, allCustomers);
      }
    }

    return generated;
  }

  static saveInvoice(inv: Partial<Invoice>): Invoice {
    const invoices = this.getInvoices();

    // If updating an existing invoice by id
    if (inv.id) {
      const idx = invoices.findIndex((i) => i.id === inv.id || i.invoice_number === inv.id);
      if (idx !== -1) {
        const existing = invoices[idx];
        const total = inv.total_amount !== undefined ? inv.total_amount : existing.total_amount;
        const paid = inv.paid_amount !== undefined ? inv.paid_amount : existing.paid_amount;
        const balance = inv.balance_amount !== undefined ? inv.balance_amount : subtractCurrency(total, paid);
        const updatedInvoice: Invoice = {
          ...existing,
          ...inv,
          total_amount: total,
          paid_amount: paid,
          balance_amount: balance,
          status: inv.status || (balance === 0 ? 'paid' : (paid > 0 ? 'partially_paid' : 'issued')),
        };
        invoices[idx] = updatedInvoice;
        this.setItem(STORAGE_KEYS.INVOICES, invoices);
        return updatedInvoice;
      }
    }

    const settings = this.getSettings();
    const invNum = inv.invoice_number || `${settings.invoice_prefix}${settings.next_invoice_number++}`;
    this.saveSettings({ next_invoice_number: settings.next_invoice_number });

    const total = inv.total_amount || 380.00;
    const paid = inv.paid_amount || 0;
    const balance = inv.balance_amount !== undefined ? inv.balance_amount : subtractCurrency(total, paid);

    const newInvoice: Invoice = {
      id: inv.id || `inv-${Date.now()}`,
      business_id: DEFAULT_BUSINESS.id,
      invoice_number: invNum,
      customer_id: inv.customer_id || '',
      customer_name_cache: inv.customer_name_cache || '',
      building_cache: inv.building_cache || '',
      issue_date: inv.issue_date || new Date().toISOString().split('T')[0],
      due_date: inv.due_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      period_start: inv.period_start || new Date().toISOString().split('T')[0],
      period_end: inv.period_end || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      subtotal: inv.subtotal || total,
      discount_amount: inv.discount_amount || 0,
      tax_amount: inv.tax_amount || 0,
      total_amount: total,
      paid_amount: paid,
      balance_amount: balance,
      status: inv.status || (balance === 0 ? 'paid' : (paid > 0 ? 'partially_paid' : 'issued')),
      notes: inv.notes || '',
      created_at: new Date().toISOString()
    };

    invoices.unshift(newInvoice);
    this.setItem(STORAGE_KEYS.INVOICES, invoices);
    return newInvoice;
  }

  static deleteInvoice(id: string): boolean {
    const invoices = this.getInvoices();
    const filtered = invoices.filter((i) => i.id !== id && i.invoice_number !== id);
    if (filtered.length !== invoices.length) {
      this.setItem(STORAGE_KEYS.INVOICES, filtered);
      return true;
    }
    return false;
  }

  static setPayments(payments: Payment[]): void {
    this.setItem(STORAGE_KEYS.PAYMENTS, payments);
  }

  static getPayments(): Payment[] {
    const payments = this.getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const customers = this.getCustomers();
    const cMap = new Map(customers.map((c) => [c.id, c]));

    return payments.map((p) => {
      if (!p.customer) {
        if (p.customer_id && cMap.has(p.customer_id)) {
          return { ...p, customer: cMap.get(p.customer_id) };
        } else if (p.customer_id === 'c-thahir-corp' || p.notes?.toLowerCase().includes('thahir')) {
          const thahir = customers.find((c) => c.customer_code?.includes('THAHIR') || c.full_name?.toLowerCase().includes('thahir'));
          if (thahir) return { ...p, customer: thahir };
        }
      }
      return p;
    });
  }

  static recordPayment(pay: Partial<Payment>): Payment {
    const payments = this.getPayments();
    const amount = pay.amount || 0;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      business_id: DEFAULT_BUSINESS.id,
      payment_number: `REC-${Date.now().toString().slice(-6)}`,
      customer_id: pay.customer_id || '',
      invoice_id: pay.invoice_id,
      amount: roundCurrency(amount),
      payment_date: pay.payment_date || new Date().toISOString().split('T')[0],
      payment_method: pay.payment_method || 'cash',
      reference_number: pay.reference_number || '',
      notes: pay.notes || '',
      is_reversed: false,
      created_at: new Date().toISOString()
    };

    payments.unshift(newPayment);
    this.setItem(STORAGE_KEYS.PAYMENTS, payments);

    // Update customer overdue and payment dates
    let targetCustomer: Customer | undefined;
    if (pay.customer_id) {
      const customers = this.getCustomers();
      targetCustomer = customers.find(item => item.id === pay.customer_id || item.customer_code === pay.customer_id);
      if (targetCustomer) {
        targetCustomer.total_overdue = Math.max(0, subtractCurrency(targetCustomer.total_overdue || 0, amount));
        if (targetCustomer.total_overdue === 0) {
          targetCustomer.payment_rating = 'Good';
          if (targetCustomer.billed_up_to_date) {
            targetCustomer.payment_made_up_to_date = targetCustomer.billed_up_to_date;
          } else {
            targetCustomer.payment_made_up_to_date = newPayment.payment_date;
          }
        } else {
          targetCustomer.payment_made_up_to_date = newPayment.payment_date;
        }
        this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
      }
    }

    // Update associated invoices
    if (pay.customer_id) {
      const invoices = this.getInvoices();
      let remainingPayment = amount;

      // 1. If a specific invoice ID was targeted
      if (pay.invoice_id) {
        const targetInv = invoices.find(i => i.id === pay.invoice_id || i.invoice_number === pay.invoice_id);
        if (targetInv) {
          const dueOnInv = Math.max(0, (targetInv.balance_amount !== undefined ? targetInv.balance_amount : targetInv.total_amount));
          const applied = Math.min(dueOnInv, remainingPayment);
          targetInv.paid_amount = roundCurrency(addCurrency(targetInv.paid_amount || 0, applied));
          targetInv.balance_amount = Math.max(0, roundCurrency(subtractCurrency(targetInv.total_amount, targetInv.paid_amount)));
          targetInv.status = targetInv.balance_amount === 0 ? 'paid' : (targetInv.paid_amount > 0 ? 'partially_paid' : targetInv.status);
          remainingPayment = roundCurrency(subtractCurrency(remainingPayment, applied));
        }
      }

      // 2. If remaining payment or no specific invoice, apply to open invoices of this customer
      if (remainingPayment > 0) {
        const custInvoices = invoices.filter(
          i => (i.customer_id === pay.customer_id || (targetCustomer && (i.customer_id === targetCustomer.id || (i.customer_name_cache && i.customer_name_cache.toLowerCase() === targetCustomer.full_name.toLowerCase())))) &&
               (i.status === 'issued' || i.status === 'overdue' || i.status === 'partially_paid' || (i.balance_amount !== undefined && i.balance_amount > 0))
        );

        for (const inv of custInvoices) {
          if (remainingPayment <= 0) break;
          const dueOnInv = Math.max(0, (inv.balance_amount !== undefined ? inv.balance_amount : inv.total_amount));
          if (dueOnInv <= 0) continue;

          const applied = Math.min(dueOnInv, remainingPayment);
          inv.paid_amount = roundCurrency(addCurrency(inv.paid_amount || 0, applied));
          inv.balance_amount = Math.max(0, roundCurrency(subtractCurrency(inv.total_amount, inv.paid_amount)));
          inv.status = inv.balance_amount === 0 ? 'paid' : 'partially_paid';
          remainingPayment = roundCurrency(subtractCurrency(remainingPayment, applied));
        }
      }

      this.setItem(STORAGE_KEYS.INVOICES, invoices);
    }

    return newPayment;
  }

  static deletePayment(id: string): boolean {
    const payments = this.getItem<Payment[]>(STORAGE_KEYS.PAYMENTS, []);
    const payment = payments.find((p) => p.id === id || p.payment_number === id);
    if (!payment) return false;

    // Filter out payment
    const remainingPayments = payments.filter((p) => p.id !== id && p.payment_number !== id);
    this.setItem(STORAGE_KEYS.PAYMENTS, remainingPayments);

    // If payment was tied to a customer and was not reversed, restore the overdue
    if (payment.customer_id && !payment.is_reversed) {
      const customers = this.getCustomers();
      const cust = customers.find(
        (c) => c.id === payment.customer_id || c.customer_code === payment.customer_id
      );
      if (cust) {
        cust.total_overdue = roundCurrency(addCurrency(cust.total_overdue || 0, payment.amount || 0));
        cust.payment_rating = (cust.total_overdue || 0) > 0 ? 'Late payer' : 'Good';
        this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
      }

      // If tied to an invoice, restore balance on invoice
      if (payment.invoice_id) {
        const invoices = this.getInvoices();
        const inv = invoices.find(
          (i) => i.id === payment.invoice_id || i.invoice_number === payment.invoice_id
        );
        if (inv) {
          inv.paid_amount = Math.max(0, roundCurrency(subtractCurrency(inv.paid_amount || 0, payment.amount || 0)));
          inv.balance_amount = Math.min(inv.total_amount, roundCurrency(addCurrency(inv.balance_amount || 0, payment.amount || 0)));
          inv.status = inv.paid_amount === 0 ? 'issued' : (inv.balance_amount === 0 ? 'paid' : 'partially_paid');
          this.setItem(STORAGE_KEYS.INVOICES, invoices);
        }
      }
    }

    return true;
  }

  // Dashboard Metrics
  static getDashboardMetrics(
    customCustomers?: Customer[],
    customInvoices?: Invoice[],
    customPayments?: Payment[]
  ): DashboardMetrics {
    const customers = customCustomers !== undefined ? customCustomers : this.getCustomers();
    const invoices = customInvoices !== undefined ? customInvoices : this.getInvoices();
    const payments = customPayments !== undefined ? customPayments : this.getPayments();

    const activeOnly = customers.filter(c => c.status === 'active' || c.status === 'cancelling_soon');
    const trial = customers.filter(c => c.status === 'trial');
    const active = customers.filter(c => c.status === 'active' || c.status === 'trial' || c.status === 'cancelling_soon');
    const inactive = customers.filter(c => c.status !== 'active' && c.status !== 'trial' && c.status !== 'cancelling_soon');
    const running = activeOnly.length;
    
    let totalBF = 0;
    let totalLN = 0;
    let totalDN = 0;
    let totalDues = 0;

    for (const c of active) {
      if (c.has_breakfast) totalBF++;
      if (c.has_lunch) totalLN++;
      if (c.has_dinner) totalDN++;
    }

    for (const c of customers) {
      const overdue = c.total_overdue || 0;
      if (overdue > 0) {
        totalDues = addCurrency(totalDues, overdue);
      }
    }

    const reminderDays = getReminderDaysSetting();
    const approachingReminders = getApproachingReminders(customers, invoices, reminderDays);
    const dueSoon = approachingReminders.length;
    const upcomingPayments = approachingReminders.map(r => r.customer).slice(0, 10);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const collectedThisMonth = payments
      .filter(p => !p.is_reversed && p.payment_date && p.payment_date.startsWith(currentMonth))
      .reduce((acc, p) => addCurrency(acc, p.amount), 0);

    const billedThisMonth = invoices
      .filter(i => i.issue_date && i.issue_date.startsWith(currentMonth))
      .reduce((acc, i) => addCurrency(acc, i.total_amount), active.length * 380);

    return {
      totalCustomers: customers.length,
      activeCustomers: activeOnly.length,
      inactiveCustomers: inactive.length,
      cancelledCustomers: customers.filter(c => c.status === 'left' || c.status === 'cancelled').length,
      trialCustomers: trial.length,
      runningAccounts: running,
      newCustomersThisMonth: customers.filter(c => (c.joining_date || c.billing_start_date || '').startsWith(currentMonth)).length,
      todayBreakfast: totalBF,
      todayLunch: totalLN,
      todayDinner: totalDN,
      todayTotalMeals: totalBF + totalLN + totalDN,
      billedThisMonth,
      collectedThisMonth,
      totalOutstandingDues: totalDues,
      dueSoonCount: dueSoon,
      overdueInvoicesCount: customers.filter(c => (c.total_overdue || 0) > 0).length,
      recentCustomers: customers.slice(0, 5),
      upcomingPayments: upcomingPayments.length > 0 ? upcomingPayments : customers.filter(c => (c.total_overdue || 0) >= 0).slice(0, 5)
    };
  }

  // Supabase connection config
  static getLedger(): any[] {
    return (fullData.ledger as any[]) || [];
  }

  static getCorporateAccounts(): any[] {
    return [
      {
        id: 'corp-1',
        name: 'Thahir Corporate Group 1',
        building: 'Star of Karama / Dhe Fish',
        period: '18 Sep 2026 - 21 Oct 2026',
        membersCount: 11,
        totalAmount: 2203.00,
        paidAmount: 1300.00,
        overdueAmount: 903.00,
        status: 'Partially Paid',
        members: [
          { name: 'Thahir A', building: 'Star of Karama', days: 19, amount: 247.00 },
          { name: 'Thahir B', building: 'Dhe Fish', days: 5, amount: 65.00 },
          { name: 'Thahir C', building: 'Star of Karama', days: 13, amount: 169.00 },
          { name: 'Thahir D', building: 'Star of Karama', days: 16, amount: 208.00 },
          { name: 'Thahir E', building: 'Dhe Fish, 103', days: 31, amount: 403.00 },
          { name: 'Thahir F', building: 'Dhe Fish, 204', days: 31, amount: 403.00 },
          { name: 'Thahir G', building: 'Dhe Fish, 204', days: 20, amount: 260.00 },
          { name: 'Thahir H', building: 'Dhe Fish', days: 6, amount: 78.00 },
          { name: 'Thahir I', building: 'Dhe Fish', days: 6, amount: 78.00 },
          { name: 'Thahir J', building: 'Dhe Fish', days: 9, amount: 117.00 },
          { name: 'Thahir K', building: 'A9, 33', days: 8, amount: 104.00 }
        ]
      },
      {
        id: 'corp-2',
        name: 'Thahir Corporate Group 2',
        building: 'Al Wasl G / A3 / Dhe Fish',
        period: '27 July 2026 - 17 Aug 2026',
        membersCount: 9,
        totalAmount: 1132.00,
        paidAmount: 400.00,
        overdueAmount: 732.00,
        status: 'Partially Paid',
        members: [
          { name: 'Thahir A', building: 'Al Wasl G block', days: 5, amount: 65.00 },
          { name: 'Thahir B', building: 'Al Wasl G block', days: 5, amount: 65.00 },
          { name: 'Thahir C', building: 'A3 Building', days: 14, amount: 182.00 },
          { name: 'Thahir D', building: 'Star of Karama 311', days: 6, amount: 78.00 },
          { name: 'Thahir E', building: 'A3 Building', days: 10, amount: 130.00 },
          { name: 'Thahir F', building: 'A3 Building', days: 10, amount: 130.00 },
          { name: 'Thahir AA', building: 'A3 Building', days: 5, amount: 65.00 },
          { name: 'Thahir BB', building: 'Dhe Fish', days: 2, amount: 26.00 },
          { name: 'Thahir CC', building: 'Dhe Fish', days: 6, amount: 78.00 }
        ]
      }
    ];
  }

  static getSupabaseConfig(): { url: string; anonKey: string } {
    return this.getItem(STORAGE_KEYS.SUPABASE_CONFIG, {
      url: (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || '',
      anonKey: (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || ''
    });
  }

  static saveSupabaseConfig(url: string, anonKey: string): void {
    this.setItem(STORAGE_KEYS.SUPABASE_CONFIG, { url, anonKey });
  }

  // ==========================================
  // VENDOR ACCOUNTS MANAGEMENT MODULE
  // ==========================================

  static getVendors(): Vendor[] {
    this.init();
    return this.getItem<Vendor[]>(STORAGE_KEYS.VENDORS, []);
  }

  static setVendors(vendors: Vendor[]): void {
    this.setItem(STORAGE_KEYS.VENDORS, vendors);
  }

  static getVendorById(id: string): Vendor | undefined {
    return this.getVendors().find(v => v.id === id);
  }

  static saveVendor(vendorData: Partial<Vendor>, user = 'admin'): Vendor {
    const vendors = this.getVendors();
    const now = new Date().toISOString();
    const isNew = !vendorData.id;

    let savedVendor: Vendor;

    if (!isNew) {
      const idx = vendors.findIndex(v => v.id === vendorData.id);
      if (idx !== -1) {
        const oldOpening = vendors[idx].opening_balance;
        savedVendor = {
          ...vendors[idx],
          ...vendorData,
          updated_at: now
        };
        vendors[idx] = savedVendor;
        this.setItem(STORAGE_KEYS.VENDORS, vendors);

        this.addVendorAuditLog({
          vendor_id: savedVendor.id,
          vendor_name: savedVendor.name,
          action: 'update_vendor',
          details: `Updated vendor details for "${savedVendor.name}" (${savedVendor.vendor_code}).`,
          performed_by: user
        });

        // If opening balance changed, recalculate running balances
        if (oldOpening !== savedVendor.opening_balance) {
          this.recalculateVendorRunningBalances(savedVendor.id);
        }

        return savedVendor;
      }
    }

    // Creating new vendor
    const nextCode = `VEND-${String(vendors.length + 1).padStart(3, '0')}`;
    savedVendor = {
      id: vendorData.id || `vend-${Date.now()}`,
      business_id: DEFAULT_BUSINESS.id,
      vendor_code: vendorData.vendor_code || nextCode,
      name: vendorData.name || 'New Vendor',
      contact_person: vendorData.contact_person || '',
      phone: vendorData.phone || '',
      address: vendorData.address || '',
      category: vendorData.category || 'Meal Catering / Kitchen',
      breakfast_rate: Number(vendorData.breakfast_rate) || 0,
      lunch_rate: Number(vendorData.lunch_rate) || 0,
      dinner_rate: Number(vendorData.dinner_rate) || 0,
      service_charge_config: vendorData.service_charge_config || { type: 'fixed', value: 0, is_enabled: false },
      delivery_charge_config: vendorData.delivery_charge_config || { type: 'fixed', value: 0, is_enabled: false },
      packing_charge_config: vendorData.packing_charge_config || { type: 'fixed', value: 0, is_enabled: false },
      other_charges_config: vendorData.other_charges_config || { type: 'fixed', value: 0, is_enabled: false },
      opening_balance: Number(vendorData.opening_balance) || 0,
      payment_terms: vendorData.payment_terms || 'Weekly',
      status: vendorData.status || 'active',
      notes: vendorData.notes || '',
      created_at: now,
      updated_at: now
    };

    vendors.push(savedVendor);
    this.setItem(STORAGE_KEYS.VENDORS, vendors);

    this.addVendorAuditLog({
      vendor_id: savedVendor.id,
      vendor_name: savedVendor.name,
      action: 'create_vendor',
      details: `Registered new vendor "${savedVendor.name}" (${savedVendor.vendor_code}) with opening balance ${savedVendor.opening_balance} AED.`,
      performed_by: user
    });

    return savedVendor;
  }

  static deleteVendor(id: string, user = 'admin'): boolean {
    const vendors = this.getVendors();
    const vendor = vendors.find(v => v.id === id);
    if (!vendor) return false;

    const filtered = vendors.filter(v => v.id !== id);
    this.setItem(STORAGE_KEYS.VENDORS, filtered);

    this.addVendorAuditLog({
      vendor_id: id,
      vendor_name: vendor.name,
      action: 'correction',
      details: `Removed vendor profile "${vendor.name}" (${vendor.vendor_code}).`,
      performed_by: user
    });

    return true;
  }

  // Vendor Transactions (Daily Accounts & Purchases)
  static getVendorTransactions(vendorId?: string): VendorTransaction[] {
    this.init();
    const all = this.getItem<VendorTransaction[]>(STORAGE_KEYS.VENDOR_TRANSACTIONS, []);
    if (vendorId) {
      return all.filter(t => t.vendor_id === vendorId);
    }
    return all;
  }

  static setVendorTransactions(txs: VendorTransaction[]): void {
    this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, txs);
  }

  static saveVendorTransaction(txData: Partial<VendorTransaction>, user = 'admin'): VendorTransaction {
    const allTx = this.getVendorTransactions();
    const now = new Date().toISOString();
    const vendor = this.getVendorById(txData.vendor_id || '');

    // Calculate Meal Charges: (BF * rate) + (LN * rate) + (DN * rate)
    const bfQty = Number(txData.breakfast_qty) || 0;
    const lnQty = Number(txData.lunch_qty) || 0;
    const dnQty = Number(txData.dinner_qty) || 0;

    const bfRate = txData.breakfast_rate !== undefined ? Number(txData.breakfast_rate) : (vendor?.breakfast_rate || 0);
    const lnRate = txData.lunch_rate !== undefined ? Number(txData.lunch_rate) : (vendor?.lunch_rate || 0);
    const dnRate = txData.dinner_rate !== undefined ? Number(txData.dinner_rate) : (vendor?.dinner_rate || 0);

    const mealCharges = roundVendorCurrency((bfQty * bfRate) + (lnQty * lnRate) + (dnQty * dnRate));

    const serviceCharge = Number(txData.service_charge) || 0;
    const deliveryCharge = Number(txData.delivery_charge) || 0;
    const packingCharge = Number(txData.packing_charge) || 0;
    const otherCharges = Number(txData.other_charges) || 0;
    const discount = Number(txData.discount) || 0;

    const totalCharges = roundVendorCurrency(mealCharges + serviceCharge + deliveryCharge + packingCharge + otherCharges - discount);
    const amountPaid = Number(txData.amount_paid) || 0;

    const date = txData.date || now.split('T')[0];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[new Date(date).getDay()] || '';

    let savedTx: VendorTransaction;
    const idx = allTx.findIndex(t => t.id === txData.id);

    if (idx !== -1) {
      savedTx = {
        ...allTx[idx],
        ...txData,
        breakfast_qty: bfQty,
        lunch_qty: lnQty,
        dinner_qty: dnQty,
        breakfast_rate: bfRate,
        lunch_rate: lnRate,
        dinner_rate: dnRate,
        meal_charges: mealCharges,
        service_charge: serviceCharge,
        delivery_charge: deliveryCharge,
        packing_charge: packingCharge,
        other_charges: otherCharges,
        discount: discount,
        total_charges: totalCharges,
        amount_paid: amountPaid,
        day_name: dayOfWeek,
        updated_at: now
      };
      allTx[idx] = savedTx;
      this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, allTx);

      this.addVendorAuditLog({
        vendor_id: savedTx.vendor_id,
        vendor_name: vendor?.name,
        action: 'edit_transaction',
        details: `Edited daily transaction for date ${savedTx.date}: Total Charges ${savedTx.total_charges} AED, Paid ${savedTx.amount_paid} AED.`,
        performed_by: user
      });
    } else {
      savedTx = {
        id: txData.id || `vtx-${Date.now()}`,
        business_id: DEFAULT_BUSINESS.id,
        vendor_id: txData.vendor_id || '',
        vendor_name_cache: vendor?.name || 'Vendor',
        transaction_type: txData.transaction_type || 'daily_meal_entry',
        date: date,
        day_name: dayOfWeek,
        description: txData.description || (txData.transaction_type === 'supplier_purchase' ? 'Supplier Purchase' : `Daily Meal Supply (${bfQty + lnQty + dnQty} Meals)`),
        breakfast_qty: bfQty,
        lunch_qty: lnQty,
        dinner_qty: dnQty,
        breakfast_rate: bfRate,
        lunch_rate: lnRate,
        dinner_rate: dnRate,
        meal_charges: mealCharges,
        service_charge: serviceCharge,
        delivery_charge: deliveryCharge,
        packing_charge: packingCharge,
        other_charges: otherCharges,
        discount: discount,
        total_charges: totalCharges,
        amount_paid: amountPaid,
        running_balance: 0,
        payment_method: txData.payment_method,
        reference_no: txData.reference_no,
        remarks: txData.remarks || '',
        created_at: now,
        updated_at: now
      };
      allTx.push(savedTx);
      this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, allTx);

      this.addVendorAuditLog({
        vendor_id: savedTx.vendor_id,
        vendor_name: vendor?.name,
        action: 'daily_entry',
        details: `Entered daily transaction on ${savedTx.date} (${savedTx.day_name}): Charges ${savedTx.total_charges} AED, Payment ${savedTx.amount_paid} AED.`,
        performed_by: user
      });
    }

    // Also sync payment record if amount_paid > 0
    if (amountPaid > 0) {
      this.syncTransactionPayment(savedTx);
    }

    // Chronologically recalculate running balances for this vendor
    this.recalculateVendorRunningBalances(savedTx.vendor_id);
    return savedTx;
  }

  static deleteVendorTransaction(id: string, user = 'admin'): boolean {
    const allTx = this.getVendorTransactions();
    const tx = allTx.find(t => t.id === id);
    if (!tx) return false;

    const filtered = allTx.filter(t => t.id !== id);
    this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, filtered);

    this.addVendorAuditLog({
      vendor_id: tx.vendor_id,
      vendor_name: tx.vendor_name_cache,
      action: 'delete_transaction',
      details: `Deleted transaction on date ${tx.date} (Charges: ${tx.total_charges} AED).`,
      performed_by: user
    });

    this.recalculateVendorRunningBalances(tx.vendor_id);
    return true;
  }

  // Vendor Payments
  static getVendorPayments(vendorId?: string): VendorPayment[] {
    this.init();
    const all = this.getItem<VendorPayment[]>(STORAGE_KEYS.VENDOR_PAYMENTS, []);
    if (vendorId) {
      return all.filter(p => p.vendor_id === vendorId);
    }
    return all.sort((a, b) => b.payment_date.localeCompare(a.payment_date));
  }

  static setVendorPayments(payments: VendorPayment[]): void {
    this.setItem(STORAGE_KEYS.VENDOR_PAYMENTS, payments);
  }

  static recordVendorPayment(paymentData: Partial<VendorPayment>, user = 'admin'): VendorPayment {
    const payments = this.getItem<VendorPayment[]>(STORAGE_KEYS.VENDOR_PAYMENTS, []);
    const now = new Date().toISOString();
    const vendor = this.getVendorById(paymentData.vendor_id || '');

    const nextNumber = `VPAY-${String(payments.length + 1).padStart(4, '0')}`;
    const newPayment: VendorPayment = {
      id: paymentData.id || `vpay-${Date.now()}`,
      business_id: DEFAULT_BUSINESS.id,
      payment_number: paymentData.payment_number || nextNumber,
      vendor_id: paymentData.vendor_id || '',
      vendor_name_cache: vendor?.name || 'Vendor',
      payment_date: paymentData.payment_date || now.split('T')[0],
      amount: Number(paymentData.amount) || 0,
      payment_method: paymentData.payment_method || 'bank_transfer',
      reference_number: paymentData.reference_number || '',
      remarks: paymentData.remarks || '',
      is_reversed: false,
      created_at: now
    };

    payments.unshift(newPayment);
    this.setItem(STORAGE_KEYS.VENDOR_PAYMENTS, payments);

    this.addVendorAuditLog({
      vendor_id: newPayment.vendor_id,
      vendor_name: vendor?.name,
      action: 'payment_record',
      details: `Recorded payment of ${newPayment.amount} AED to "${vendor?.name}" via ${newPayment.payment_method} (Ref: ${newPayment.reference_number || '-'}).`,
      performed_by: user
    });

    // Also update or insert daily transaction payment for that date
    this.applyPaymentToTransactions(newPayment);

    // Recalculate vendor balances
    this.recalculateVendorRunningBalances(newPayment.vendor_id);
    return newPayment;
  }

  static deleteVendorPayment(id: string, user = 'admin'): boolean {
    const payments = this.getItem<VendorPayment[]>(STORAGE_KEYS.VENDOR_PAYMENTS, []);
    const payment = payments.find(p => p.id === id);
    if (!payment) return false;

    const filtered = payments.filter(p => p.id !== id);
    this.setItem(STORAGE_KEYS.VENDOR_PAYMENTS, filtered);

    this.addVendorAuditLog({
      vendor_id: payment.vendor_id,
      vendor_name: payment.vendor_name_cache,
      action: 'correction',
      details: `Reversed/removed payment ${payment.payment_number} of ${payment.amount} AED dated ${payment.payment_date}.`,
      performed_by: user
    });

    // Remove amount_paid from corresponding transaction
    const allTx = this.getVendorTransactions(payment.vendor_id);
    const tx = allTx.find(t => t.date === payment.payment_date);
    if (tx) {
      tx.amount_paid = Math.max(0, roundVendorCurrency(tx.amount_paid - payment.amount));
      this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, this.getItem<VendorTransaction[]>(STORAGE_KEYS.VENDOR_TRANSACTIONS, []).map(t => t.id === tx.id ? tx : t));
    }

    this.recalculateVendorRunningBalances(payment.vendor_id);
    return true;
  }

  private static syncTransactionPayment(tx: VendorTransaction): void {
    const payments = this.getItem<VendorPayment[]>(STORAGE_KEYS.VENDOR_PAYMENTS, []);
    const existingIndex = payments.findIndex(p => p.vendor_id === tx.vendor_id && p.payment_date === tx.date);

    if (existingIndex !== -1) {
      payments[existingIndex].amount = tx.amount_paid;
      payments[existingIndex].remarks = tx.remarks || 'Daily account payment';
    } else {
      payments.unshift({
        id: `vpay-sync-${tx.id}`,
        business_id: DEFAULT_BUSINESS.id,
        payment_number: `VPAY-${String(payments.length + 1).padStart(4, '0')}`,
        vendor_id: tx.vendor_id,
        vendor_name_cache: tx.vendor_name_cache,
        payment_date: tx.date,
        amount: tx.amount_paid,
        payment_method: (tx.payment_method as any) || 'bank_transfer',
        reference_number: tx.reference_no || '',
        remarks: tx.remarks || 'Daily account payment',
        is_reversed: false,
        created_at: new Date().toISOString()
      });
    }
    this.setItem(STORAGE_KEYS.VENDOR_PAYMENTS, payments);
  }

  private static applyPaymentToTransactions(payment: VendorPayment): void {
    const allTx = this.getVendorTransactions(payment.vendor_id);
    const existingTx = allTx.find(t => t.date === payment.payment_date);

    if (existingTx) {
      existingTx.amount_paid = roundVendorCurrency((existingTx.amount_paid || 0) + payment.amount);
      const allStored = this.getItem<VendorTransaction[]>(STORAGE_KEYS.VENDOR_TRANSACTIONS, []);
      this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, allStored.map(t => t.id === existingTx.id ? existingTx : t));
    } else {
      // Create a standalone payment transaction record for the ledger
      this.saveVendorTransaction({
        vendor_id: payment.vendor_id,
        vendor_name_cache: payment.vendor_name_cache,
        transaction_type: 'adjustment',
        date: payment.payment_date,
        description: `Payment (${payment.payment_method.toUpperCase()}) - Ref: ${payment.reference_number || '-'}`,
        breakfast_qty: 0,
        lunch_qty: 0,
        dinner_qty: 0,
        breakfast_rate: 0,
        lunch_rate: 0,
        dinner_rate: 0,
        meal_charges: 0,
        service_charge: 0,
        delivery_charge: 0,
        packing_charge: 0,
        other_charges: 0,
        discount: 0,
        total_charges: 0,
        amount_paid: payment.amount,
        remarks: payment.remarks
      }, 'system');
    }
  }

  // Recalculate running balance across all chronological transactions for a vendor
  static recalculateVendorRunningBalances(vendorId: string): void {
    const vendor = this.getVendorById(vendorId);
    if (!vendor) return;

    const allStored = this.getItem<VendorTransaction[]>(STORAGE_KEYS.VENDOR_TRANSACTIONS, []);
    const vendorTx = allStored.filter(t => t.vendor_id === vendorId);
    const otherTx = allStored.filter(t => t.vendor_id !== vendorId);

    // Sort chronologically by date ascending
    vendorTx.sort((a, b) => a.date.localeCompare(b.date));

    let running = vendor.opening_balance || 0;
    vendorTx.forEach(tx => {
      running = roundVendorCurrency(running + (tx.total_charges || 0) - (tx.amount_paid || 0));
      tx.running_balance = running;
    });

    this.setItem(STORAGE_KEYS.VENDOR_TRANSACTIONS, [...otherTx, ...vendorTx]);
  }

  // Vendor Statement
  static getVendorStatement(vendorId: string, startDate?: string, endDate?: string): VendorStatement | null {
    const vendor = this.getVendorById(vendorId);
    if (!vendor) return null;

    let txList = this.getVendorTransactions(vendorId);
    txList.sort((a, b) => a.date.localeCompare(b.date));

    // Calculate effective opening balance up to startDate
    let effectiveOpening = vendor.opening_balance || 0;
    if (startDate) {
      const priorTx = txList.filter(t => t.date < startDate);
      priorTx.forEach(t => {
        effectiveOpening = roundVendorCurrency(effectiveOpening + (t.total_charges || 0) - (t.amount_paid || 0));
      });
    }

    // Filter transactions in range
    let filteredTx = txList;
    if (startDate) {
      filteredTx = filteredTx.filter(t => t.date >= startDate);
    }
    if (endDate) {
      filteredTx = filteredTx.filter(t => t.date <= endDate);
    }

    let running = effectiveOpening;
    let periodTotalCharges = 0;
    let periodTotalPayments = 0;

    const statementItems: VendorStatementItem[] = filteredTx.map(t => {
      const charges = t.total_charges || 0;
      const payments = t.amount_paid || 0;
      periodTotalCharges = roundVendorCurrency(periodTotalCharges + charges);
      periodTotalPayments = roundVendorCurrency(periodTotalPayments + payments);
      running = roundVendorCurrency(running + charges - payments);

      return {
        id: t.id,
        date: t.date,
        day_name: t.day_name,
        type: t.transaction_type,
        description: t.description || 'Meal Supply',
        breakfast_qty: t.breakfast_qty,
        lunch_qty: t.lunch_qty,
        dinner_qty: t.dinner_qty,
        meal_charges: t.meal_charges || 0,
        service_charge: t.service_charge || 0,
        delivery_charge: t.delivery_charge || 0,
        packing_charge: t.packing_charge || 0,
        other_charges: t.other_charges || 0,
        discount: t.discount || 0,
        total_charges: charges,
        payments: payments,
        running_balance: running,
        remarks: t.remarks,
        reference_no: t.reference_no
      };
    });

    const closingBalance = roundVendorCurrency(effectiveOpening + periodTotalCharges - periodTotalPayments);

    return {
      vendor,
      startDate,
      endDate,
      openingBalance: effectiveOpening,
      items: statementItems,
      totalCharges: periodTotalCharges,
      totalPayments: periodTotalPayments,
      closingBalance: closingBalance
    };
  }

  // Vendor Dashboard Metrics
  static getVendorDashboardMetrics(): VendorDashboardMetrics {
    const vendors = this.getVendors();
    const allTx = this.getVendorTransactions();
    const payments = this.getVendorPayments();

    const activeVendors = vendors.filter(v => v.status === 'active');
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Charges this month (or fallback to latest month if dataset is 2026 test data)
    let chargesThisMonth = allTx
      .filter(t => t.date.startsWith(currentMonth))
      .reduce((acc, t) => roundVendorCurrency(acc + (t.total_charges || 0)), 0);

    if (chargesThisMonth === 0) {
      // Find latest active month in transactions
      const months = Array.from(new Set(allTx.map(t => t.date.slice(0, 7)))).sort();
      const latestMonth = months[months.length - 1];
      if (latestMonth) {
        chargesThisMonth = allTx
          .filter(t => t.date.startsWith(latestMonth))
          .reduce((acc, t) => roundVendorCurrency(acc + (t.total_charges || 0)), 0);
      }
    }

    // Calculate closing balance for all vendors
    let totalOutstandingPayables = 0;
    const vendorsWithBalances: { vendor: Vendor; balance: number; status: 'payable' | 'credit' | 'settled' }[] = [];
    const upcomingPayments: VendorDashboardMetrics['upcomingPayments'] = [];

    vendors.forEach(v => {
      const statement = this.getVendorStatement(v.id);
      const balance = statement ? statement.closingBalance : v.opening_balance;
      
      let status: 'payable' | 'credit' | 'settled' = 'settled';
      if (balance > 0.01) {
        status = 'payable';
        totalOutstandingPayables = roundVendorCurrency(totalOutstandingPayables + balance);
      } else if (balance < -0.01) {
        status = 'credit';
      }

      vendorsWithBalances.push({ vendor: v, balance, status });

      if (balance > 0) {
        upcomingPayments.push({
          vendorId: v.id,
          vendorName: v.name,
          balance,
          paymentTerms: v.payment_terms || 'Weekly',
          status: balance > 5000 ? 'urgent' : balance > 1000 ? 'due_soon' : 'normal'
        });
      }
    });

    // Recent 10 transactions
    const sortedTx = [...allTx].sort((a, b) => b.date.localeCompare(a.date));
    const recentTransactions = sortedTx.slice(0, 10);

    // Monthly expense breakdown (last 6-12 months)
    const monthMap: Record<string, { charges: number; payments: number }> = {};
    allTx.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!monthMap[m]) monthMap[m] = { charges: 0, payments: 0 };
      monthMap[m].charges = roundVendorCurrency(monthMap[m].charges + (t.total_charges || 0));
      monthMap[m].payments = roundVendorCurrency(monthMap[m].payments + (t.amount_paid || 0));
    });

    const monthKeys = Object.keys(monthMap).sort();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyExpenses = monthKeys.map(k => {
      const [year, month] = k.split('-');
      const label = `${monthNames[parseInt(month) - 1]} ${year.slice(2)}`;
      return {
        month: k,
        label,
        charges: monthMap[k].charges,
        payments: monthMap[k].payments
      };
    });

    return {
      totalVendors: vendors.length,
      activeVendors: activeVendors.length,
      totalChargesThisMonth: chargesThisMonth,
      totalOutstandingPayables: totalOutstandingPayables,
      recentTransactions,
      upcomingPayments,
      vendorsWithBalances,
      monthlyExpenses
    };
  }

  // Audit Logs
  static getVendorAuditLogs(): VendorAuditLog[] {
    this.init();
    const logs = this.getItem<VendorAuditLog[]>(STORAGE_KEYS.VENDOR_AUDIT_LOGS, []);
    return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  static addVendorAuditLog(log: Omit<VendorAuditLog, 'id' | 'business_id' | 'timestamp'>): void {
    const logs = this.getItem<VendorAuditLog[]>(STORAGE_KEYS.VENDOR_AUDIT_LOGS, []);
    logs.unshift({
      id: `vlog-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      business_id: DEFAULT_BUSINESS.id,
      timestamp: new Date().toISOString(),
      ...log
    });
    // Keep max 500 audit entries
    if (logs.length > 500) logs.length = 500;
    this.setItem(STORAGE_KEYS.VENDOR_AUDIT_LOGS, logs);

    // Sync to centralized System Activity Log
    try {
      let actionType: any = 'UPDATE';
      if (log.action === 'create_vendor') actionType = 'ADD';
      else if (log.action === 'payment_record') actionType = 'PAYMENT';
      else if (log.action === 'daily_entry') actionType = 'ADD';
      else if (log.action === 'excel_import') actionType = 'IMPORT';
      else if (log.action === 'delete_transaction' || log.action === 'correction') actionType = 'DELETE';

      ActivityLogService.logAction(
        'Vendors',
        actionType,
        log.vendor_name ? `Vendor Activity (${log.vendor_name})` : 'Vendor Activity',
        log.details,
        { userName: log.performed_by, status: actionType === 'DELETE' ? 'warning' : 'success' }
      );
    } catch {
      // Ignored if logging during initial bootstrapping
    }
  }
}
