import { describe, it, expect, beforeEach } from 'vitest';
import { AutoBackupService, BackupDataset } from '../src/utils/autoBackupService';
import { Customer, Building, MealPlan, Invoice, Payment } from '../src/types';

describe('AutoBackupService Tests', () => {
  const mockDataset: BackupDataset = {
    customers: [
      {
        id: 'c1',
        customer_code: 'CUST-101',
        full_name: 'Mohammed Salman',
        phone: '+971 50 123 4567',
        status: 'active',
        monthly_rate: 380,
        total_overdue: 100,
        payment_rating: 'Good',
        has_breakfast: true,
        has_lunch: true,
        has_dinner: true,
        building_name_cache: 'Belrasheed Building',
        apartment_cache: '102',
      } as Customer,
      {
        id: 'c2',
        customer_code: 'CUST-102',
        full_name: 'Rahul Kumar',
        phone: '+971 50 765 4321',
        status: 'active',
        monthly_rate: 300,
        total_overdue: 0,
        payment_rating: 'Good',
        has_breakfast: false,
        has_lunch: true,
        has_dinner: true,
        building_name_cache: 'Karama Center Block A',
        apartment_cache: '304',
      } as Customer,
    ],
    buildings: [
      { id: 'b1', name: 'Belrasheed Building', area: 'Hamdan Colony' } as Building,
    ],
    mealPlans: [
      {
        id: 'mp1',
        name: '3 Times Daily',
        monthly_price: 380,
        per_meal_price: 13,
        includes_breakfast: true,
        includes_lunch: true,
        includes_dinner: true,
      } as MealPlan,
    ],
    invoices: [
      {
        id: 'inv1',
        customer_id: 'c1',
        invoice_number: 'INV-2026-1001',
        issue_date: '2026-11-01',
        due_date: '2026-11-08',
        total_amount: 380,
        paid_amount: 280,
        balance_amount: 100,
        status: 'issued',
      } as Invoice,
    ],
    payments: [
      {
        id: 'p1',
        customer_id: 'c1',
        payment_number: 'PAY-1001',
        payment_date: '2026-11-05',
        amount: 280,
        payment_method: 'cash',
        notes: 'Partial settlement',
      } as Payment,
    ],
  };

  it('generates multi-sheet Excel workbook with required sheets', () => {
    const wb = AutoBackupService.generateExcelWorkbook(mockDataset);
    expect(wb.SheetNames).toContain('Customers');
    expect(wb.SheetNames).toContain('Overdue Accounts');
    expect(wb.SheetNames).toContain('Payment Receipts');
    expect(wb.SheetNames).toContain('Invoices');
    expect(wb.SheetNames).toContain('Meal Plans');
  });

  it('generates complete and parseable JSON system snapshot', () => {
    const jsonStr = AutoBackupService.generateSystemSnapshotJson(mockDataset);
    expect(jsonStr).toBeTypeOf('string');
    const parsed = JSON.parse(jsonStr);
    expect(parsed.app).toBe('Karama Mess Management Software');
    expect(parsed.customers.length).toBe(2);
    expect(parsed.invoices.length).toBe(1);
    expect(parsed.payments.length).toBe(1);
    expect(parsed.stats.total_customers).toBe(2);
  });

  it('reports desktop status accurately when running in browser vs electron', () => {
    // In Vitest/Node environment without window.electronAPI:
    expect(AutoBackupService.isDesktopApp()).toBe(false);
  });

  it('skips auto backup gracefully if not running in desktop app', async () => {
    const res = await AutoBackupService.executeDailyBackup(mockDataset);
    expect(res.supported).toBe(false);
  });
});
