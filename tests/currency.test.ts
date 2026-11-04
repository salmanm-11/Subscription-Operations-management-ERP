import { describe, it, expect } from 'vitest';
import { formatAED, parseAED, addCurrency, subtractCurrency, multiplyCurrency, roundCurrency } from '../src/utils/currency';

describe('UAE Currency (AED) & Financial Decimal Safety Tests', () => {
  it('correctly formats AED amounts with 2 decimal places and thousands separators', () => {
    expect(formatAED(25)).toBe('AED 25.00');
    expect(formatAED(150)).toBe('AED 150.00');
    expect(formatAED(1250)).toBe('AED 1,250.00');
    expect(formatAED(10000.5)).toBe('AED 10,000.50');
    expect(formatAED(0)).toBe('AED 0.00');
    expect(formatAED(null)).toBe('AED 0.00');
    expect(formatAED(undefined)).toBe('AED 0.00');
    expect(formatAED('')).toBe('AED 0.00');
  });

  it('strictly never outputs Indian Rupee (INR) or ₹ symbols', () => {
    const samples = [0, 50, 380, 1000, 25000];
    samples.forEach(val => {
      const formatted = formatAED(val);
      expect(formatted).toContain('AED');
      expect(formatted).not.toContain('₹');
      expect(formatted).not.toContain('INR');
      expect(formatted).not.toContain('Rs');
    });
  });

  it('safely parses currency strings with AED or commas', () => {
    expect(parseAED('AED 1,250.00')).toBe(1250.00);
    expect(parseAED('AED 25.50')).toBe(25.50);
    expect(parseAED('1000')).toBe(1000.00);
    expect(parseAED('')).toBe(0);
  });

  it('performs decimal-safe addition without binary floating point drift', () => {
    // 0.1 + 0.2 in standard JS is 0.30000000000000004
    expect(0.1 + 0.2).not.toBe(0.3);
    expect(addCurrency(0.1, 0.2)).toBe(0.3);
    expect(addCurrency('AED 150.25', 'AED 229.75')).toBe(380.00);
  });

  it('performs decimal-safe subtraction and handles negative balances correctly', () => {
    expect(subtractCurrency(380, 150)).toBe(230.00);
    expect(subtractCurrency('AED 380.00', 'AED 380.00')).toBe(0.00);
    expect(subtractCurrency(100, 150)).toBe(-50.00);
  });

  it('performs decimal-safe multiplication for meal quantities and rates', () => {
    expect(multiplyCurrency(13.00, 10)).toBe(130.00);
    expect(multiplyCurrency(6.20, 30)).toBe(186.00);
  });
});
