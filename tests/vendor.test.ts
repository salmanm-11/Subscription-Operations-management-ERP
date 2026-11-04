import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineStorage } from '../src/api/offlineStorage';
import { parseMomsAccountExcel } from '../src/utils/excelService';
import { roundVendorCurrency } from '../src/utils/currency';
import fs from 'fs';
import path from 'path';

// Mock localStorage for Vitest Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Vendor Accounts Management Module', () => {
  beforeEach(() => {
    // Clear storage for fresh test state
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    OfflineStorage.init();
  });

  it('1. should add and edit a vendor with custom rates and payment terms', () => {
    const newVendor = OfflineStorage.saveVendor({
      name: 'Dubai Central Spice Market',
      category: 'Groceries & Provisions',
      breakfast_rate: 0,
      lunch_rate: 0,
      dinner_rate: 0,
      opening_balance: 500.00,
      payment_terms: 'Net 15',
      phone: '+971 50 999 1122'
    }, 'admin_test');

    expect(newVendor.id).toBeDefined();
    expect(newVendor.vendor_code).toMatch(/^VEND-/);
    expect(newVendor.name).toBe('Dubai Central Spice Market');
    expect(newVendor.opening_balance).toBe(500.00);

    // Edit vendor
    const updated = OfflineStorage.saveVendor({
      id: newVendor.id,
      name: 'Dubai Central Spice & Wholesale Market',
      payment_terms: 'Net 30'
    }, 'admin_test');

    expect(updated.name).toBe('Dubai Central Spice & Wholesale Market');
    expect(updated.payment_terms).toBe('Net 30');
  });

  it('2. should configure vendor charges (service, delivery, packing, other) independently', () => {
    const vendor = OfflineStorage.saveVendor({
      name: 'Test Kitchen Supplies',
      category: 'Meal Catering / Kitchen',
      breakfast_rate: 3.50,
      lunch_rate: 5.00,
      dinner_rate: 4.50,
      delivery_charge_config: { type: 'fixed', value: 15, is_enabled: true },
      service_charge_config: { type: 'percentage', value: 5, is_enabled: true },
      packing_charge_config: { type: 'fixed', value: 10, is_enabled: true },
      other_charges_config: { type: 'fixed', value: 0, is_enabled: false }
    }, 'admin_test');

    expect(vendor.delivery_charge_config.is_enabled).toBe(true);
    expect(vendor.delivery_charge_config.value).toBe(15);
    expect(vendor.service_charge_config.type).toBe('percentage');
    expect(vendor.service_charge_config.value).toBe(5);
  });

  it('3. should automatically calculate meal charges from quantities and contract rates', () => {
    // Exact Mom's Food day 1: 22 BF, 73 LN, 53 DN
    const bfQty = 22;
    const lnQty = 73;
    const dnQty = 53;
    const bfRate = 3.27;
    const lnRate = 4.385;
    const dnRate = 4.27;

    const mealCharges = roundVendorCurrency((bfQty * bfRate) + (lnQty * lnRate) + (dnQty * dnRate));
    // 22 * 3.27 = 71.94; 73 * 4.385 = 320.105; 53 * 4.27 = 226.31; Total = 618.355
    expect(mealCharges).toBe(618.355);

    // Create daily transaction via OfflineStorage
    const tx = OfflineStorage.saveVendorTransaction({
      vendor_id: 'vend-moms-food',
      date: '2026-01-01',
      breakfast_qty: bfQty,
      lunch_qty: lnQty,
      dinner_qty: dnQty,
      breakfast_rate: bfRate,
      lunch_rate: lnRate,
      dinner_rate: dnRate,
      service_charge: 0,
      delivery_charge: 0,
      packing_charge: 0,
      other_charges: 0,
      discount: 0,
      amount_paid: 1275.00
    }, 'admin_test');

    expect(tx.meal_charges).toBe(618.355);
    expect(tx.total_charges).toBe(618.355);
  });

  it('4. should apply charges formula correctly: Meal + Service + Delivery + Packing + Other - Discount', () => {
    const tx = OfflineStorage.saveVendorTransaction({
      vendor_id: 'vend-moms-food',
      date: '2026-10-15',
      breakfast_qty: 10,
      lunch_qty: 20,
      dinner_qty: 20,
      breakfast_rate: 3.00,
      lunch_rate: 4.00,
      dinner_rate: 4.00,
      // Meal charges: 10*3 + 20*4 + 20*4 = 30 + 80 + 80 = 190.00
      service_charge: 10.00,
      delivery_charge: 15.00,
      packing_charge: 5.00,
      other_charges: 2.50,
      discount: 7.50,
      amount_paid: 100.00
    }, 'admin_test');

    // Expected: 190 + 10 + 15 + 5 + 2.50 - 7.50 = 215.00
    expect(tx.meal_charges).toBe(190.00);
    expect(tx.total_charges).toBe(215.00);
  });

  it('5. should calculate closing balance according to formula: Opening Balance + Total Charges - Total Payments', () => {
    // Mom's Food starting opening balance = -946.66
    // Day 1: Charges = 618.355, Paid = 1275
    // Closing = -946.66 + 618.355 - 1275 = -1603.305
    const stmt = OfflineStorage.getVendorStatement('vend-moms-food', '2026-01-01', '2026-01-01');
    expect(stmt).toBeDefined();
    expect(stmt?.openingBalance).toBe(-946.66);
    expect(stmt?.totalCharges).toBe(618.355);
    expect(stmt?.totalPayments).toBe(1275.00);
    expect(stmt?.closingBalance).toBe(-1603.305);
  });

  it('6. should record separate payments without double counting', () => {
    const payment = OfflineStorage.recordVendorPayment({
      vendor_id: 'vend-poultry-meat',
      payment_date: '2026-10-28',
      amount: 500.00,
      payment_method: 'bank_transfer',
      reference_number: 'REF-TEST-9988'
    }, 'admin_test');

    expect(payment.id).toBeDefined();
    expect(payment.payment_number).toMatch(/^VPAY-/);
    expect(payment.amount).toBe(500.00);

    const paymentsList = OfflineStorage.getVendorPayments('vend-poultry-meat');
    expect(paymentsList.some(p => p.id === payment.id)).toBe(true);
  });

  it('7. should parse Moms_Account spreadsheet and match historical balances', async () => {
    const csvPath = path.resolve('sample_data/Moms_Account.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');

    const result = await parseMomsAccountExcel(csvContent);

    expect(result.success).toBe(true);
    expect(result.openingBalance).toBe(-946.66);
    expect(result.totalRows).toBe(365);
    expect(result.balanceDiscrepanciesCount).toBe(0);
    // On day 1:
    expect(result.validRows[0].daily_total_charges).toBe(618.355);
    expect(result.validRows[0].amount_paid).toBe(1275);
    expect(result.validRows[0].calculated_balance).toBe(-1603.305);
  });

  it('8. should record audit trail for vendor operations', () => {
    OfflineStorage.addVendorAuditLog({
      vendor_id: 'vend-moms-food',
      vendor_name: "Mom's Food Kitchen",
      action: 'correction',
      details: 'Audit test: verified running balance math.',
      performed_by: 'auditor_test'
    });

    const logs = OfflineStorage.getVendorAuditLogs();
    expect(logs.length).toBeGreaterThan(0);
    const testLog = logs.find(l => l.details.includes('Audit test'));
    expect(testLog).toBeDefined();
    expect(testLog?.performed_by).toBe('auditor_test');
  });
});
