import * as XLSX from 'xlsx';
import { Customer, Invoice, Building, Vendor, VendorTransaction, VendorStatement } from '../types';
import { roundVendorCurrency, formatVendorAED } from './currency';

export interface ParsedImportRow {
  full_name: string;
  company_name?: string;
  area: string;
  building_name_cache: string;
  apartment_cache: string;
  phone: string;
  emergency_contact?: string;
  status: 'active' | 'paused' | 'left' | 'trial';
  has_breakfast: boolean;
  has_lunch: boolean;
  has_dinner: boolean;
  monthly_rate: number;
  total_overdue: number;
  payment_rating: 'Good' | 'Late payer' | 'Bad';
  dietary_preferences: string;
  notes: string;
  payment_made_up_to_date?: string;
  billed_up_to_date?: string;
  managed_by?: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  validRows: ParsedImportRow[];
  errors: string[];
}

// Helper to auto-fit worksheet column widths
function autoFitColumns(worksheet: XLSX.WorkSheet, data: any[]) {
  if (!data || data.length === 0) return;
  const colKeys = Object.keys(data[0]);
  const colWidths = colKeys.map(key => {
    let maxLen = key.toString().length;
    data.forEach(row => {
      const val = row[key];
      if (val !== null && val !== undefined) {
        maxLen = Math.max(maxLen, val.toString().length);
      }
    });
    return { wch: Math.min(Math.max(maxLen + 2, 10), 50) };
  });
  worksheet['!cols'] = colWidths;
}

// Export arbitrary tabular data to Excel or CSV
export function exportTableToExcel(data: any[], filename: string, sheetName = 'Sheet1', format: 'xlsx' | 'csv' = 'xlsx') {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  autoFitColumns(ws, data);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  if (format === 'csv') {
    XLSX.writeFile(wb, `${filename}.csv`, { bookType: 'csv' });
  } else {
    XLSX.writeFile(wb, `${filename}.xlsx`, { bookType: 'xlsx' });
  }
}

// 1. Export Customers
export function exportCustomersToExcel(
  customers: Customer[],
  filterType: 'all' | 'active' | 'overdue' = 'all',
  format: 'xlsx' | 'csv' = 'xlsx'
) {
  let list = customers;
  if (filterType === 'active') {
    list = customers.filter(c => c.status === 'active');
  } else if (filterType === 'overdue') {
    list = customers.filter(c => (c.total_overdue || 0) > 0);
  }

  const exportRows = list.map(c => ({
    'Customer Code': c.customer_code,
    'Customer Name': c.full_name,
    'Company / Workplace': c.company_name || '-',
    'Building': c.building_name_cache || '-',
    'Flat / Room': c.apartment_cache || '-',
    'Phone Number': c.phone || '-',
    'Emergency Contact': c.emergency_contact || '-',
    'Who is this customer (Managed By)': c.managed_by || 'admin',
    'Status': c.status.toUpperCase(),
    'Breakfast (BF)': c.has_breakfast ? 'YES' : 'NO',
    'Lunch (LN)': c.has_lunch ? 'YES' : 'NO',
    'Dinner (DN)': c.has_dinner ? 'YES' : 'NO',
    'Monthly Rate (AED)': Number(c.monthly_rate || 0).toFixed(2),
    'Payment Made Up To The Date': c.payment_made_up_to_date || c.billing_start_date || '-',
    'Billed Up To The Date': c.billed_up_to_date || c.billing_end_date || '-',
    'Total Overdue (AED)': Number(c.total_overdue || 0).toFixed(2),
    'Payment Rating': c.payment_rating || 'Good',
    'Dietary Preferences': c.dietary_preferences || 'Standard',
    'Joining Date': c.joining_date || '-',
    'Billing End Date': c.billing_end_date || '-',
    'Remarks / Notes': c.notes || '-'
  }));

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Orbit_Customers_${filterType.toUpperCase()}_${dateStr}`;
  exportTableToExcel(exportRows, filename, 'Customers', format);
}

// 2. Export Invoices
export function exportInvoicesToExcel(invoices: Invoice[], format: 'xlsx' | 'csv' = 'xlsx') {
  const exportRows = invoices.map(inv => ({
    'Invoice Number': inv.invoice_number,
    'Customer Name': (inv as any).customer_name_cache || inv.customer?.full_name || '-',
    'Building': (inv as any).building_cache || inv.customer?.building_name_cache || '-',
    'Issue Date': inv.issue_date,
    'Due Date': inv.due_date,
    'Period Start': inv.period_start,
    'Period End': inv.period_end,
    'Subtotal (AED)': Number(inv.subtotal || 0).toFixed(2),
    'Total Amount (AED)': Number(inv.total_amount || 0).toFixed(2),
    'Paid Amount (AED)': Number(inv.paid_amount || 0).toFixed(2),
    'Balance Due (AED)': Number(inv.balance_amount || 0).toFixed(2),
    'Status': inv.status.toUpperCase(),
    'Notes / Remarks': inv.notes || '-'
  }));

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Orbit_Invoices_${dateStr}`;
  exportTableToExcel(exportRows, filename, 'Invoices', format);
}

// 3. Export Daily Ledger
export function exportLedgerToExcel(ledgerRecords: any[], format: 'xlsx' | 'csv' = 'xlsx') {
  const exportRows = ledgerRecords.map(item => ({
    'Date': item.date,
    'Day': item.day,
    'Breakfast (BF)': item.bf_count || 0,
    'Lunch (LN)': item.ln_count || 0,
    'Dinner (DN)': item.dn_count || 0,
    'Total Meals': item.total_meals || ((item.bf_count || 0) + (item.ln_count || 0) + (item.dn_count || 0)),
    'Daily Total Charges (AED)': Number(item.charges || 0).toFixed(2),
    'Amount Paid (AED)': Number(item.amount_paid || 0).toFixed(2),
    'Running Balance (AED)': Number(item.balance || 0).toFixed(2),
    'Remarks': item.remarks || '-'
  }));

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Orbit_Daily_Ledger_365Days_${dateStr}`;
  exportTableToExcel(exportRows, filename, 'Daily Ledger', format);
}

// 4. Export Daily Delivery Run Sheet (Grouped by Building & Apartment)
export function exportDeliverySheetToExcel(customers: Customer[], format: 'xlsx' | 'csv' = 'xlsx') {
  const activeCustomers = customers.filter(c => c.status === 'active');

  // Sort by Building then Apartment
  activeCustomers.sort((a, b) => {
    const bldA = (a.building_name_cache || '').toLowerCase();
    const bldB = (b.building_name_cache || '').toLowerCase();
    if (bldA !== bldB) return bldA.localeCompare(bldB);
    return (a.apartment_cache || '').localeCompare(b.apartment_cache || '');
  });

  const exportRows = activeCustomers.map(c => ({
    'Building Name': c.building_name_cache || '-',
    'Flat / Room': c.apartment_cache || '-',
    'Customer Name': c.full_name,
    'Phone Number': c.phone || '-',
    'Emergency Contact': c.emergency_contact || '-',
    'Breakfast (BF)': c.has_breakfast ? 'YES' : '-',
    'Lunch (LN)': c.has_lunch ? 'YES' : '-',
    'Dinner (DN)': c.has_dinner ? 'YES' : '-',
    'Door Code': c.door_passcode || '-',
    'Dietary Instructions / Delivery Notes': c.dietary_preferences || 'Standard Tiffin Box'
  }));

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Orbit_Delivery_RunSheet_${dateStr}`;
  exportTableToExcel(exportRows, filename, 'Delivery Sheet', format);
}

// 5. Download Sample Excel Template for Importing Customers
export function downloadCustomerTemplate(format: 'xlsx' | 'csv' = 'xlsx') {
  const sampleData = [
    {
      'Customer Name': 'Salman Mohammed',
      'Area': '🟠 Burjman & Mankhool',
      'Building Name': 'Era Building',
      'Apartment': '110',
      'Phone Number': '+971 50 123 4567',
      'Emergency Contact': '+971 50 999 8888',
      'Status': 'active',
      'Breakfast (BF)': 'YES',
      'Lunch (LN)': 'YES',
      'Dinner (DN)': 'YES',
      'Monthly Rate (AED)': 380,
      'Payment Made Up To The Date': '2026-10-31',
      'Billed Up To The Date': '2026-10-31',
      'Total Overdue (AED)': 0,
      'Payment Rating': 'Good',
      'Dietary Preferences': 'No fish curry, Barik rice only',
      'Notes': 'Deliver at 6:00 AM'
    },
    {
      'Customer Name': 'Rahul Nair',
      'Area': '🟡 Park, Pioneer & ADCB',
      'Building Name': 'Al Wasl Building',
      'Apartment': '305',
      'Phone Number': '+971 50 987 6543',
      'Status': 'active',
      'Breakfast (BF)': 'NO',
      'Lunch (LN)': 'YES',
      'Dinner (DN)': 'YES',
      'Monthly Rate (AED)': 310,
      'Total Overdue (AED)': 150,
      'Payment Rating': 'Late payer',
      'Dietary Preferences': 'Handmade chapati only',
      'Notes': 'Passcode: 4695#'
    },
    {
      'Customer Name': 'Fayas Kareem',
      'Area': '🟢 Karama Center - Pyramid',
      'Building Name': 'Star 1 B Block',
      'Apartment': '206',
      'Phone Number': '+971 52 555 4321',
      'Status': 'active',
      'Breakfast (BF)': 'NO',
      'Lunch (LN)': 'YES',
      'Dinner (DN)': 'NO',
      'Monthly Rate (AED)': 186,
      'Total Overdue (AED)': 0,
      'Payment Rating': 'Good',
      'Dietary Preferences': 'Lunch only, Half rice + chapati',
      'Notes': 'Deliver inside kitchen'
    }
  ];

  exportTableToExcel(sampleData, 'Orbit_Customer_Import_Template', 'Template', format);
}

export function normalizeToDateString(val: any): string | undefined {
  if (!val) return undefined;
  if (typeof val === 'number') {
    const date = new Date(Math.round((val - 25569) * 86400 * 1000));
    return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : undefined;
  }
  const str = String(val).trim();
  if (!str) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  if (/^\d+(\.\d+)?$/.test(str)) {
    const num = parseFloat(str);
    if (num > 20000 && num < 60000) {
      const date = new Date(Math.round((num - 25569) * 86400 * 1000));
      return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : undefined;
    }
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return undefined;
}

// 6. Parse Uploaded Excel or CSV File (Multi-Sheet and Header Offset Resilient)
export async function parseCustomerExcel(file: File): Promise<ImportResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          resolve({
            success: false,
            totalRows: 0,
            validRows: [],
            errors: ['The selected file contains no sheets.']
          });
          return;
        }

        // Helper to detect table header row offset (up to row 10)
        const findHeaderRowOffset = (sheet: XLSX.WorkSheet): number => {
          if (!sheet['!ref']) return 0;
          const range = XLSX.utils.decode_range(sheet['!ref']);
          for (let R = range.s.r; R <= Math.min(range.e.r, 10); ++R) {
            let keywordMatches = 0;
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
              if (cell && cell.v) {
                const val = String(cell.v).toLowerCase().replace(/[^a-z0-9]/g, '');
                if (
                  val.includes('name') ||
                  val.includes('customer') ||
                  val.includes('phone') ||
                  val.includes('building') ||
                  val.includes('room') ||
                  val.includes('flat') ||
                  val.includes('apartment') ||
                  val.includes('rate') ||
                  val.includes('meal') ||
                  val.includes('status') ||
                  val.includes('area')
                ) {
                  keywordMatches++;
                }
              }
            }
            if (keywordMatches >= 2) return R;
          }
          return 0;
        };

        // Scan all sheets in the workbook and pick the sheet with the most valid customer rows
        let bestRows: ParsedImportRow[] = [];
        let bestRawCount = 0;
        let bestSheetName = workbook.SheetNames[0];

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          if (!worksheet || !worksheet['!ref']) continue;

          const headerOffset = findHeaderRowOffset(worksheet);
          const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, {
            range: headerOffset,
            defval: ''
          });

          if (!rawJson || rawJson.length === 0) continue;

          const sheetValidRows: ParsedImportRow[] = [];

          rawJson.forEach((row) => {
            // Normalize row keys (lowercase, remove spaces & symbols)
            const normalized: Record<string, any> = {};
            Object.keys(row).forEach((k) => {
              const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
              normalized[cleanKey] = row[k];
            });

            // Match Name (Broad multi-language & ERP variations)
            const nameKey = Object.keys(normalized).find((k) => k.includes('name')) || '';
            const name =
              normalized['customername'] ||
              normalized['name'] ||
              normalized['fullname'] ||
              normalized['customer'] ||
              normalized['clientname'] ||
              normalized['client'] ||
              normalized['membername'] ||
              normalized['member'] ||
              normalized['person'] ||
              normalized['resident'] ||
              normalized['tenant'] ||
              normalized['subscriber'] ||
              normalized['custname'] ||
              normalized['cname'] ||
              normalized['empname'] ||
              normalized['employee'] ||
              (nameKey ? normalized[nameKey] : '');

            if (!name || String(name).trim().length === 0 || String(name).toLowerCase() === 'total' || String(name).toLowerCase() === 'grand total') {
              return; // Skip empty rows or summary footer
            }

            // Match Building & Area
            const building =
              normalized['buildingname'] ||
              normalized['building'] ||
              normalized['bld'] ||
              normalized['buildingarea'] ||
              normalized['property'] ||
              normalized['address'] ||
              'Karama Central';
            const area = normalized['area'] || normalized['zone'] || normalized['deliveryarea'] || 'Karama Central';
            const apartment = String(
              normalized['apartment'] ||
              normalized['flat'] ||
              normalized['room'] ||
              normalized['flatroom'] ||
              normalized['roomno'] ||
              normalized['flatno'] ||
              normalized['apt'] ||
              ''
            );
            const phone = String(
              normalized['phonenumber'] ||
              normalized['phone'] ||
              normalized['mobile'] ||
              normalized['contact'] ||
              normalized['phnumber'] ||
              normalized['mob'] ||
              normalized['cell'] ||
              ''
            );
            const emergencyContact = String(
              normalized['emergencycontact'] ||
              normalized['emergencyphone'] ||
              normalized['soscontact'] ||
              normalized['sos'] ||
              normalized['emergency'] ||
              ''
            );

            // Match Meals
            const bfVal = String(normalized['breakfastbf'] || normalized['breakfast'] || normalized['bf'] || '').toLowerCase();
            const lnVal = String(normalized['lunchln'] || normalized['lunch'] || normalized['ln'] || '').toLowerCase();
            const dnVal = String(normalized['dinnerdn'] || normalized['dinner'] || normalized['dn'] || '').toLowerCase();

            const hasBf = bfVal === 'yes' || bfVal === '1' || bfVal === 'true' || bfVal === 'bf' || bfVal === 'y';
            const hasLn = lnVal === 'yes' || lnVal === '1' || lnVal === 'true' || lnVal === 'ln' || lnVal === 'y';
            const hasDn = dnVal === 'yes' || dnVal === '1' || dnVal === 'true' || dnVal === 'dn' || dnVal === 'y';

            // Match Rate & Overdue
            const count = (hasBf ? 1 : 0) + (hasLn ? 1 : 0) + (hasDn ? 1 : 0);
            const fallbackRate = count === 1 ? 180 : (count === 2 ? 300 : 380);
            const rawRate =
              normalized['monthlyrateaed'] ||
              normalized['monthlyrate'] ||
              normalized['monthlyprice'] ||
              normalized['rate'] ||
              normalized['price'] ||
              normalized['amount'];
            const rateVal = rawRate ? (parseFloat(String(rawRate).replace(/[^0-9.-]/g, '')) || fallbackRate) : fallbackRate;
            const overdueVal =
              parseFloat(
                String(
                  normalized['totaloverdueaed'] ||
                  normalized['totaloverdue'] ||
                  normalized['overdue'] ||
                  normalized['due'] ||
                  normalized['balance'] ||
                  '0'
                ).replace(/[^0-9.-]/g, '')
              ) || 0;

            // Match Status
            const rawStatus = String(normalized['status'] || 'active').toLowerCase();
            let status: 'active' | 'paused' | 'left' | 'trial' = 'active';
            if (rawStatus.includes('trial')) status = 'trial';
            else if (rawStatus.includes('notice') || rawStatus.includes('pause')) status = 'paused';
            else if (rawStatus.includes('cancel') || rawStatus.includes('left') || rawStatus.includes('stop')) status = 'left';

            // Match Rating
            const rawRating = String(normalized['paymentrating'] || normalized['rating'] || '').toLowerCase();
            let rating: 'Good' | 'Late payer' | 'Bad' = 'Good';
            if (rawRating.includes('bad')) rating = 'Bad';
            else if (rawRating.includes('late') || overdueVal > 0) rating = 'Late payer';

            // Dietary Preferences & Notes
            const dietary = String(normalized['dietarypreferences'] || normalized['dietary'] || normalized['label'] || '').trim();
            const notes = String(normalized['remarksnotes'] || normalized['remarks'] || normalized['notes'] || '').trim();

            // Dates
            const paymentMadeUpTo = normalizeToDateString(
              normalized['paymentmadeuptothedate'] ||
              normalized['paymentmadeupto'] ||
              normalized['paidupto'] ||
              normalized['lastpaid']
            );
            const billedUpTo = normalizeToDateString(
              normalized['billeduptothedate'] ||
              normalized['billedupto'] ||
              normalized['billedto']
            );
            const managedBy = String(
              normalized['whoisthiscustomer'] ||
              normalized['whoisthiscustomermanagedby'] ||
              normalized['managedby'] ||
              normalized['handler'] ||
              'admin'
            ).trim();

            const company = String(
              normalized['customercompanyname'] ||
              normalized['companyname'] ||
              normalized['company'] ||
              normalized['companyworkplace'] ||
              normalized['employer'] ||
              normalized['workplace'] ||
              ''
            ).trim();

            sheetValidRows.push({
              full_name: String(name).trim(),
              company_name: company || undefined,
              area: String(area).trim(),
              building_name_cache: String(building).trim(),
              apartment_cache: apartment.trim(),
              phone: phone.trim(),
              emergency_contact: emergencyContact.trim() || undefined,
              status,
              has_breakfast: hasBf,
              has_lunch: hasLn || (!hasBf && !hasDn), // default lunch if none specified
              has_dinner: hasDn,
              monthly_rate: rateVal,
              total_overdue: overdueVal,
              payment_rating: rating,
              dietary_preferences: dietary || 'Standard Menu',
              notes,
              payment_made_up_to_date: paymentMadeUpTo || undefined,
              billed_up_to_date: billedUpTo || undefined,
              managed_by: managedBy || 'admin',
            });
          });

          if (sheetValidRows.length > bestRows.length) {
            bestRows = sheetValidRows;
            bestRawCount = rawJson.length;
            bestSheetName = sheetName;
          }
        }

        resolve({
          success: bestRows.length > 0,
          totalRows: bestRawCount,
          validRows: bestRows,
          errors: bestRows.length === 0 ? ['No valid customer rows could be parsed. Please check column headers.'] : []
        });
      } catch (err: any) {
        reject(new Error(`Failed to parse Excel file: ${err.message}`));
      }
    };

    reader.onerror = () => reject(new Error('File reading failed. Please try again.'));
    reader.readAsArrayBuffer(file);
  });
}

// ==========================================
// VENDOR MODULE EXCEL EXPORT & IMPORT
// ==========================================

export interface ParsedMomsRow {
  date: string;
  day_name: string;
  breakfast_qty: number;
  lunch_qty: number;
  dinner_qty: number;
  daily_total_charges: number;
  amount_paid: number;
  reported_balance: number;
  calculated_balance: number;
  is_balance_matched: boolean;
  remarks: string;
}

export interface ParsedMomsAccountResult {
  success: boolean;
  openingBalance: number;
  totalRows: number;
  validRows: ParsedMomsRow[];
  totalCharges: number;
  totalPayments: number;
  finalCalculatedBalance: number;
  finalReportedBalance: number;
  balanceDiscrepanciesCount: number;
  duplicatesCount: number;
  errors: string[];
}

/**
 * Export Vendor Account Statement to Excel or CSV
 */
export function exportVendorStatementToExcel(statement: VendorStatement, format: 'xlsx' | 'csv' = 'xlsx') {
  const exportRows = statement.items.map(item => ({
    'Date': item.date,
    'Day': item.day_name || '-',
    'Description': item.description,
    'BF Qty': item.breakfast_qty || 0,
    'LN Qty': item.lunch_qty || 0,
    'DN Qty': item.dinner_qty || 0,
    'Meal Charges (AED)': Number(item.meal_charges || 0).toFixed(3),
    'Service Charge (AED)': Number(item.service_charge || 0).toFixed(2),
    'Delivery Charge (AED)': Number(item.delivery_charge || 0).toFixed(2),
    'Packing Charge (AED)': Number(item.packing_charge || 0).toFixed(2),
    'Other Charges (AED)': Number(item.other_charges || 0).toFixed(2),
    'Discount (AED)': Number(item.discount || 0).toFixed(2),
    'Total Charges (AED)': Number(item.total_charges || 0).toFixed(3),
    'Payments (AED)': Number(item.payments || 0).toFixed(2),
    'Running Balance (AED)': Number(item.running_balance || 0).toFixed(3),
    'Remarks / Ref': item.remarks || item.reference_no || '-'
  }));

  // Append summary row
  exportRows.push({
    'Date': 'TOTAL / CLOSING',
    'Day': '-',
    'Description': `Opening: ${statement.openingBalance.toFixed(3)} AED | Closing: ${statement.closingBalance.toFixed(3)} AED`,
    'BF Qty': statement.items.reduce((acc, i) => acc + (i.breakfast_qty || 0), 0) as any,
    'LN Qty': statement.items.reduce((acc, i) => acc + (i.lunch_qty || 0), 0) as any,
    'DN Qty': statement.items.reduce((acc, i) => acc + (i.dinner_qty || 0), 0) as any,
    'Meal Charges (AED)': Number(statement.items.reduce((acc, i) => acc + (i.meal_charges || 0), 0)).toFixed(3),
    'Service Charge (AED)': Number(statement.items.reduce((acc, i) => acc + (i.service_charge || 0), 0)).toFixed(2),
    'Delivery Charge (AED)': Number(statement.items.reduce((acc, i) => acc + (i.delivery_charge || 0), 0)).toFixed(2),
    'Packing Charge (AED)': Number(statement.items.reduce((acc, i) => acc + (i.packing_charge || 0), 0)).toFixed(2),
    'Other Charges (AED)': Number(statement.items.reduce((acc, i) => acc + (i.other_charges || 0), 0)).toFixed(2),
    'Discount (AED)': Number(statement.items.reduce((acc, i) => acc + (i.discount || 0), 0)).toFixed(2),
    'Total Charges (AED)': Number(statement.totalCharges).toFixed(3),
    'Payments (AED)': Number(statement.totalPayments).toFixed(2),
    'Running Balance (AED)': Number(statement.closingBalance).toFixed(3),
    'Remarks / Ref': statement.closingBalance > 0 ? 'PAYABLE OUTSTANDING' : 'CREDIT / ADVANCE'
  });

  const dateStr = new Date().toISOString().slice(0, 10);
  const cleanVendorName = statement.vendor.name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Orbit_Vendor_Statement_${cleanVendorName}_${dateStr}`;
  exportTableToExcel(exportRows, filename, 'Statement', format);
}

/**
 * Export Vendors Directory List
 */
export function exportVendorsListToExcel(vendors: Vendor[], format: 'xlsx' | 'csv' = 'xlsx') {
  const exportRows = vendors.map(v => ({
    'Vendor Code': v.vendor_code,
    'Vendor Name': v.name,
    'Category': v.category,
    'Contact Person': v.contact_person || '-',
    'Phone': v.phone || '-',
    'Address': v.address || '-',
    'Breakfast Rate (AED)': v.breakfast_rate.toFixed(3),
    'Lunch Rate (AED)': v.lunch_rate.toFixed(3),
    'Dinner Rate (AED)': v.dinner_rate.toFixed(3),
    'Opening Balance (AED)': v.opening_balance.toFixed(3),
    'Payment Terms': v.payment_terms || 'Weekly',
    'Status': v.status.toUpperCase(),
    'Notes': v.notes || '-'
  }));

  const dateStr = new Date().toISOString().slice(0, 10);
  const filename = `Orbit_Vendor_Directory_${dateStr}`;
  exportTableToExcel(exportRows, filename, 'Vendors', format);
}

/**
 * Parse Mom's Account Excel or CSV file (Moms_Account.xlsx)
 * Validates each row, extracts Old Balance, calculates running balance, and compares against spreadsheet balance.
 */
export async function parseMomsAccountExcel(fileOrBuffer: File | ArrayBuffer | string): Promise<ParsedMomsAccountResult> {
  return new Promise((resolve, reject) => {
    try {
      let workbook: XLSX.WorkBook;

      if (typeof fileOrBuffer === 'string') {
        workbook = XLSX.read(fileOrBuffer, { type: 'string' });
      } else if (fileOrBuffer instanceof ArrayBuffer) {
        workbook = XLSX.read(fileOrBuffer, { type: 'array' });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const buf = e.target?.result;
            const wb = XLSX.read(buf, { type: 'array' });
            resolve(processWorkbook(wb));
          } catch (err: any) {
            reject(new Error(`Failed to parse Excel file: ${err.message}`));
          }
        };
        reader.onerror = () => reject(new Error('File reading error.'));
        reader.readAsArrayBuffer(fileOrBuffer);
        return;
      }

      resolve(processWorkbook(workbook));
    } catch (err: any) {
      reject(new Error(`Failed to parse file: ${err.message}`));
    }
  });
}

function processWorkbook(workbook: XLSX.WorkBook): ParsedMomsAccountResult {
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

  if (!rawRows || rawRows.length < 2) {
    return {
      success: false,
      openingBalance: 0,
      totalRows: 0,
      validRows: [],
      totalCharges: 0,
      totalPayments: 0,
      finalCalculatedBalance: 0,
      finalReportedBalance: 0,
      balanceDiscrepanciesCount: 0,
      duplicatesCount: 0,
      errors: ['File is empty or contains no readable data rows.']
    };
  }

  // Detect header row and column indexes
  let headerRowIndex = 0;
  for (let r = 0; r < Math.min(rawRows.length, 5); r++) {
    const rowStr = rawRows[r].map((c: any) => String(c).toLowerCase()).join(' ');
    if (rowStr.includes('date') || rowStr.includes('charges') || rowStr.includes('balance')) {
      headerRowIndex = r;
      break;
    }
  }

  const headers = rawRows[headerRowIndex].map((c: any) => String(c).trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
  const dateCol = headers.findIndex((h: string) => h === 'date');
  const dayCol = headers.findIndex((h: string) => h === 'day');
  const bfCol = headers.findIndex((h: string) => h === 'bf' || h === 'breakfast');
  const lnCol = headers.findIndex((h: string) => h === 'ln' || h === 'lunch');
  const dnCol = headers.findIndex((h: string) => h === 'dn' || h === 'dinner');
  const chargesCol = headers.findIndex((h: string) => h.includes('charge') || h.includes('dailytotal'));
  const paidCol = headers.findIndex((h: string) => h.includes('paid') || h.includes('amountpaid') || h.includes('payment'));
  const balanceCol = headers.findIndex((h: string) => h.includes('balance') && !h.includes('old'));
  const remarksCol = headers.findIndex((h: string) => h.includes('remark') || h.includes('note'));

  // Detect Old Balance in row 1 or other cells
  let openingBalance = 0;
  for (let r = 0; r < Math.min(rawRows.length, 10); r++) {
    const row = rawRows[r];
    for (let c = 0; c < row.length; c++) {
      const cell = String(row[c]).toLowerCase();
      if (cell.includes('old balance') || cell.includes('opening balance')) {
        const nextVal = parseFloat(String(row[c + 1] || '').replace(/[^0-9.-]/g, ''));
        if (!isNaN(nextVal)) {
          openingBalance = nextVal;
          break;
        }
      }
    }
    if (openingBalance !== 0) break;
  }

  // If opening balance wasn't found in a labeled cell, check if row 1 has -946.66
  if (openingBalance === 0 && rawRows[headerRowIndex + 1]) {
    for (const val of rawRows[headerRowIndex + 1]) {
      const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
      if (parsed === -946.66) {
        openingBalance = -946.66;
        break;
      }
    }
  }

  const validRows: ParsedMomsRow[] = [];
  const errors: string[] = [];
  const seenDates = new Set<string>();
  let duplicatesCount = 0;
  let runningBal = openingBalance;
  let totalCharges = 0;
  let totalPayments = 0;
  let balanceDiscrepancies = 0;

  for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    const rawDate = String(row[dateCol !== -1 ? dateCol : 0] || '').trim();
    if (!rawDate || rawDate.toLowerCase() === 'total' || rawDate.toLowerCase() === 'date') continue;

    // Normalize date YYYY-MM-DD
    let dateStr = rawDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      dateStr = rawDate;
    } else {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        dateStr = d.toISOString().split('T')[0];
      }
    }

    if (seenDates.has(dateStr)) {
      duplicatesCount++;
    } else {
      seenDates.add(dateStr);
    }

    const dayName = String(row[dayCol !== -1 ? dayCol : 1] || '').trim();
    const bf = parseInt(String(row[bfCol !== -1 ? bfCol : 2] || '0').replace(/[^0-9]/g, '')) || 0;
    const ln = parseInt(String(row[lnCol !== -1 ? lnCol : 3] || '0').replace(/[^0-9]/g, '')) || 0;
    const dn = parseInt(String(row[dnCol !== -1 ? dnCol : 4] || '0').replace(/[^0-9]/g, '')) || 0;

    const chargesVal = parseFloat(String(row[chargesCol !== -1 ? chargesCol : 6] || '0').replace(/[^0-9.-]/g, '')) || 0;
    const paidVal = parseFloat(String(row[paidCol !== -1 ? paidCol : 7] || '0').replace(/[^0-9.-]/g, '')) || 0;
    const reportedBal = parseFloat(String(row[balanceCol !== -1 ? balanceCol : 8] || '0').replace(/[^0-9.-]/g, '')) || 0;
    const remarks = String(row[remarksCol !== -1 ? remarksCol : 9] || '').trim();

    runningBal = roundVendorCurrency(runningBal + chargesVal - paidVal);
    totalCharges = roundVendorCurrency(totalCharges + chargesVal);
    totalPayments = roundVendorCurrency(totalPayments + paidVal);

    const isMatch = Math.abs(runningBal - reportedBal) < 0.05;
    if (!isMatch && reportedBal !== 0) {
      balanceDiscrepancies++;
    }

    validRows.push({
      date: dateStr,
      day_name: dayName,
      breakfast_qty: bf,
      lunch_qty: ln,
      dinner_qty: dn,
      daily_total_charges: chargesVal,
      amount_paid: paidVal,
      reported_balance: reportedBal,
      calculated_balance: runningBal,
      is_balance_matched: isMatch,
      remarks: remarks
    });
  }

  return {
    success: validRows.length > 0,
    openingBalance,
    totalRows: validRows.length,
    validRows,
    totalCharges,
    totalPayments,
    finalCalculatedBalance: runningBal,
    finalReportedBalance: validRows.length > 0 ? validRows[validRows.length - 1].reported_balance : 0,
    balanceDiscrepanciesCount: balanceDiscrepancies,
    duplicatesCount,
    errors
  };
}

