/**
 * Centralized UAE Currency (AED) & Financial Arithmetic Utilities
 * Enforces decimal-safe financial calculations and consistent AED formatting throughout the platform.
 */

export const DEFAULT_CURRENCY = 'AED';

/**
 * Format a number or numeric string into official UAE Dirhams format.
 * Examples:
 *   formatAED(25) => "AED 25.00"
 *   formatAED(1250) => "AED 1,250.00"
 *   formatAED(10000.5) => "AED 10,000.50"
 */
export function formatAED(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') {
    return 'AED 0.00';
  }

  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return 'AED 0.00';
  }

  // Use standard UAE English locale with 2 fixed decimal places
  const formatted = new Intl.NumberFormat('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return `AED ${formatted}`;
}

/**
 * Safely parse a currency string into a 2-decimal number.
 * Removes "AED", commas, and spaces.
 */
export function parseAED(value: string | number): number {
  if (typeof value === 'number') {
    return roundCurrency(value);
  }
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : roundCurrency(parsed);
}

/**
 * Round a monetary number safely to 2 decimal places to avoid IEEE-754 binary float errors.
 */
export function roundCurrency(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

/**
 * Add monetary amounts with decimal safety.
 */
export function addCurrency(...amounts: (number | string)[]): number {
  const sumInCents = amounts.reduce((acc: number, curr) => {
    const val = typeof curr === 'string' ? parseAED(curr) : curr;
    return acc + Math.round(val * 100);
  }, 0);
  return sumInCents / 100;
}

/**
 * Subtract monetary amounts with decimal safety: a - b.
 */
export function subtractCurrency(a: number | string, b: number | string): number {
  const valA = typeof a === 'string' ? parseAED(a) : a;
  const valB = typeof b === 'string' ? parseAED(b) : b;
  return (Math.round(valA * 100) - Math.round(valB * 100)) / 100;
}

/**
 * Multiply monetary amount by quantity or rate with decimal safety.
 */
export function multiplyCurrency(amount: number | string, quantity: number): number {
  const val = typeof amount === 'string' ? parseAED(amount) : amount;
  return Math.round(val * quantity * 100) / 100;
}

/**
 * High-precision rounding for vendor calculations (supports up to 3 decimal places for fils rates, e.g. 4.385 AED).
 */
export function roundVendorCurrency(val: number, decimals: number = 3): number {
  const factor = Math.pow(10, decimals);
  return Math.round((val + Number.EPSILON) * factor) / factor;
}

/**
 * Format vendor AED amount cleanly, displaying 3 decimals if fractional fils exist (e.g. 618.355),
 * otherwise defaulting to standard 2 decimal places (e.g. 1,275.00).
 */
export function formatVendorAED(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') {
    return 'AED 0.00';
  }
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) {
    return 'AED 0.00';
  }

  // Check if there are 3 decimal digits
  const hasThreeDecimals = Math.abs(Math.round(num * 1000) - Math.round(num * 100) * 10) > 0;
  const digits = hasThreeDecimals ? 3 : 2;

  const formatted = new Intl.NumberFormat('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(num);

  return `AED ${formatted}`;
}

