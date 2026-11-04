import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';

describe('Excel Utilities & Parser Service', () => {
  it('should create and read an Excel workbook correctly using XLSX', () => {
    const testData = [
      { 'Customer Name': 'Saran', 'Building': 'Era Building', 'Overdue (AED)': 250 },
      { 'Customer Name': 'Fayas', 'Building': 'ERA Building', 'Overdue (AED)': 0 }
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(testData);
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    expect(buffer).toBeDefined();
    expect(buffer.length).toBeGreaterThan(0);

    const readWb = XLSX.read(buffer, { type: 'buffer' });
    expect(readWb.SheetNames).toContain('Customers');
    const readRows: any[] = XLSX.utils.sheet_to_json(readWb.Sheets['Customers']);
    expect(readRows.length).toBe(2);
    expect(readRows[0]['Customer Name']).toBe('Saran');
    expect(readRows[0]['Overdue (AED)']).toBe(250);
  });

  it('should parse column headers case-insensitively', () => {
    const rawRow = {
      'CUSTOMER NAME': 'Eugene',
      'Area': '🟠 Burjman & Mankhool',
      'Flat / Room': '101',
      'Monthly Rate (AED)': '310',
      'Breakfast (BF)': 'NO',
      'Lunch (LN)': 'YES',
      'Dinner (DN)': 'YES'
    };

    const normalized: Record<string, any> = {};
    Object.keys(rawRow).forEach(k => {
      const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      normalized[cleanKey] = (rawRow as any)[k];
    });

    expect(normalized['customername']).toBe('Eugene');
    expect(normalized['monthlyrateaed']).toBe('310');
    expect(normalized['lunchln']).toBe('YES');
  });

  it('should parse emergency contact from diverse column headers', () => {
    const rawRow = {
      'Customer Name': 'Eugene',
      'Emergency Contact': '+971 50 111 2222',
      'Managed By': 'admin'
    };

    const normalized: Record<string, any> = {};
    Object.keys(rawRow).forEach(k => {
      const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      normalized[cleanKey] = (rawRow as any)[k];
    });

    const emergencyContact = String(normalized['emergencycontact'] || normalized['emergencyphone'] || normalized['soscontact'] || '').trim();
    expect(emergencyContact).toBe('+971 50 111 2222');
  });
});
