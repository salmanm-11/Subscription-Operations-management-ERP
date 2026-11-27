import * as XLSX from 'xlsx';
import { Customer, Building, MealPlan, Invoice, Payment, Business, BusinessSettings } from '../types';
import { OfflineStorage } from '../api/offlineStorage';
import { saveCustomer, recordPayment, createInvoice } from '../api/supabase';

export interface BackupDataset {
  customers: Customer[];
  buildings: Building[];
  mealPlans: MealPlan[];
  invoices: Invoice[];
  payments: Payment[];
  business?: Business;
  settings?: BusinessSettings;
}

export interface BackupResult {
  supported: boolean;
  success?: boolean;
  skipped?: boolean;
  backupDir?: string;
  savedFiles?: string[];
  timestamp?: string;
  lastDate?: string;
  error?: string;
}

export class AutoBackupService {
  /**
   * Checks if the app is currently running as the installed Windows Desktop App
   */
  static isDesktopApp(): boolean {
    return typeof window !== 'undefined' && Boolean(window.electronAPI && window.electronAPI.isElectron);
  }

  /**
   * Formats numbers cleanly for Excel
   */
  private static formatNum(val?: number): number {
    return val !== undefined && val !== null ? Number(Number(val).toFixed(2)) : 0;
  }

  /**
   * Generates a comprehensive multi-sheet Excel Workbook
   */
  static generateExcelWorkbook(dataset: BackupDataset): XLSX.WorkBook {
    const wb = XLSX.utils.book_new();

    // 1. Customers Sheet
    const customersData = dataset.customers.map((c) => ({
      'Customer Code': c.customer_code,
      'Full Name': c.full_name,
      'Company Name': c.company_name || '',
      'Phone Number': c.phone || '',
      'Status': (c.status || 'active').toUpperCase(),
      'Building / Area': c.building?.name || c.building_name_cache || '',
      'Room / Bed': c.room?.room_number || c.apartment_cache || '',
      'Breakfast': c.has_breakfast ? 'YES' : 'NO',
      'Lunch': c.has_lunch ? 'YES' : 'NO',
      'Dinner': c.has_dinner ? 'YES' : 'NO',
      'Monthly Rate (AED)': this.formatNum(c.monthly_rate),
      'Overdue Dues (AED)': this.formatNum(c.total_overdue),
      'Payment Rating': c.payment_rating || 'Good',
      'Paid Up To': c.payment_made_up_to_date || '',
      'Billed Up To': c.billed_up_to_date || c.billing_end_date || '',
      'Dietary Notes': c.dietary_preferences || '',
      'Notes': c.notes || '',
    }));
    const wsCustomers = XLSX.utils.json_to_sheet(customersData);
    XLSX.utils.book_append_sheet(wb, wsCustomers, 'Customers');

    // 2. Overdue Accounts Sheet
    const overdueList = dataset.customers
      .filter((c) => (c.total_overdue || 0) > 0)
      .map((c) => ({
        'Customer Code': c.customer_code,
        'Full Name': c.full_name,
        'Phone Number': c.phone || '',
        'Building': c.building?.name || c.building_name_cache || '',
        'Room': c.apartment_cache || '',
        'Overdue Amount (AED)': this.formatNum(c.total_overdue),
        'Payment Rating': c.payment_rating || 'Late payer',
        'Last Settled Date': c.payment_made_up_to_date || '',
      }));
    const wsOverdue = XLSX.utils.json_to_sheet(overdueList.length > 0 ? overdueList : [{ Status: 'No active overdue accounts' }]);
    XLSX.utils.book_append_sheet(wb, wsOverdue, 'Overdue Accounts');

    // 3. Payment Receipts Sheet
    const paymentsData = (dataset.payments || []).map((p) => {
      const cust = dataset.customers.find((c) => c.id === p.customer_id || c.customer_code === p.customer_id);
      return {
        'Receipt No': p.payment_number || '',
        'Payment Date': p.payment_date || '',
        'Customer Code': cust ? cust.customer_code : p.customer_id,
        'Customer Name': cust ? cust.full_name : '',
        'Amount Paid (AED)': this.formatNum(p.amount),
        'Method': (p.payment_method || 'cash').toUpperCase(),
        'Reference / Cheque No': p.reference_number || '',
        'Notes': p.notes || '',
      };
    });
    const wsPayments = XLSX.utils.json_to_sheet(paymentsData.length > 0 ? paymentsData : [{ Status: 'No payments recorded' }]);
    XLSX.utils.book_append_sheet(wb, wsPayments, 'Payment Receipts');

    // 4. Invoices Sheet
    const invoicesData = (dataset.invoices || []).map((inv) => {
      const cust = dataset.customers.find((c) => c.id === inv.customer_id || c.customer_code === inv.customer_id);
      return {
        'Invoice Number': inv.invoice_number,
        'Issue Date': inv.issue_date,
        'Due Date': inv.due_date,
        'Customer Name': cust ? cust.full_name : '',
        'Total Amount (AED)': this.formatNum(inv.total_amount),
        'Paid Amount (AED)': this.formatNum(inv.paid_amount),
        'Balance Due (AED)': this.formatNum(inv.balance_amount),
        'Status': (inv.status || 'issued').toUpperCase(),
      };
    });
    const wsInvoices = XLSX.utils.json_to_sheet(invoicesData.length > 0 ? invoicesData : [{ Status: 'No invoices' }]);
    XLSX.utils.book_append_sheet(wb, wsInvoices, 'Invoices');

    // 5. Meal Plans & Business Info Sheet
    const plansData = (dataset.mealPlans || []).map((mp) => ({
      'Plan Name': mp.name,
      'Monthly Price (AED)': this.formatNum(mp.monthly_price),
      'Per Meal Price (AED)': this.formatNum(mp.per_meal_price),
      'Breakfast': mp.includes_breakfast ? 'YES' : 'NO',
      'Lunch': mp.includes_lunch ? 'YES' : 'NO',
      'Dinner': mp.includes_dinner ? 'YES' : 'NO',
    }));
    const wsPlans = XLSX.utils.json_to_sheet(plansData);
    XLSX.utils.book_append_sheet(wb, wsPlans, 'Meal Plans');

    return wb;
  }

  /**
   * Generates a complete system snapshot JSON
   */
  static generateSystemSnapshotJson(dataset: BackupDataset): string {
    const snapshot = {
      app: 'Orbit Enterprise ERP',
      schema_version: '1.0.4',
      exported_at: new Date().toISOString(),
      business: dataset.business || OfflineStorage.getBusiness(),
      settings: dataset.settings || OfflineStorage.getSettings(),
      stats: {
        total_customers: dataset.customers.length,
        total_invoices: dataset.invoices.length,
        total_payments: dataset.payments.length,
        total_buildings: dataset.buildings.length,
        total_meal_plans: dataset.mealPlans.length,
      },
      customers: dataset.customers,
      buildings: dataset.buildings,
      mealPlans: dataset.mealPlans,
      invoices: dataset.invoices,
      payments: dataset.payments,
    };
    return JSON.stringify(snapshot, null, 2);
  }

  /**
   * Performs automatic daily background backup on Windows PC
   */
  static async executeDailyBackup(dataset: BackupDataset, force: boolean = false): Promise<BackupResult> {
    if (!this.isDesktopApp()) {
      return { supported: false, error: 'Automatic local file saving is available in the Desktop App.' };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const lastBackupDate = localStorage.getItem('karama_last_auto_backup_date');

    // If already backed up today and not forced, skip quietly
    if (!force && lastBackupDate === todayStr) {
      return {
        supported: true,
        skipped: true,
        lastDate: todayStr,
      };
    }

    try {
      // 1. Generate Excel Workbook in Base64
      const wb = this.generateExcelWorkbook(dataset);
      const excelBase64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

      // 2. Generate JSON System Snapshot
      const jsonString = this.generateSystemSnapshotJson(dataset);

      // 3. Write via Electron IPC to Windows Documents\Karama Mess Backups
      const res = await window.electronAPI!.saveBackup({
        excelBase64,
        jsonString,
        dateStr: todayStr,
      });

      if (res.success) {
        localStorage.setItem('karama_last_auto_backup_date', todayStr);
        localStorage.setItem('karama_last_auto_backup_time', new Date().toLocaleTimeString());
        return {
          supported: true,
          success: true,
          backupDir: res.backupDir,
          savedFiles: res.savedFiles,
          timestamp: res.timestamp || new Date().toISOString(),
        };
      } else {
        return {
          supported: true,
          success: false,
          error: res.error || 'Failed to write backup files',
        };
      }
    } catch (err: any) {
      console.error('Auto backup execution error:', err);
      return {
        supported: true,
        success: false,
        error: err.message || 'Unknown backup error',
      };
    }
  }

  /**
   * Opens the backup directory directly in Windows Explorer
   */
  static async openBackupFolder(): Promise<boolean> {
    if (!this.isDesktopApp()) return false;
    const res = await window.electronAPI!.openBackupFolder();
    return Boolean(res.success);
  }

  /**
   * Queries existing backup files from the local disk
   */
  static async getDiskBackupStatus() {
    if (!this.isDesktopApp()) return null;
    return await window.electronAPI!.getBackupStatus();
  }

  /**
   * Restores data from a backup JSON snapshot string
   */
  static async restoreFromJson(jsonString: string): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      const data = JSON.parse(jsonString);
      if (!data.customers || !Array.isArray(data.customers)) {
        return { success: false, count: 0, error: 'Invalid backup file: customers array missing' };
      }

      // 1. Save all customers to local offline storage and sync to cloud
      for (const cust of data.customers) {
        await saveCustomer(cust);
      }

      // 2. Restore payments
      if (Array.isArray(data.payments)) {
        for (const p of data.payments) {
          await recordPayment(p);
        }
      }

      // 3. Restore invoices
      if (Array.isArray(data.invoices)) {
        for (const inv of data.invoices) {
          await createInvoice(inv);
        }
      }

      return {
        success: true,
        count: data.customers.length,
      };
    } catch (err: any) {
      console.error('Failed to restore from backup:', err);
      return { success: false, count: 0, error: err.message };
    }
  }
}
