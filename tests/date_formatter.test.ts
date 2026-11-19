import { describe, it, expect } from 'vitest';
import { formatDateDDMMMYYYY, formatDisplayDate } from '../src/utils/dateFormatter';

describe('formatDateDDMMMYYYY Utility', () => {
  it('formats YYYY-MM-DD ISO date strings correctly to dd-mmm-yyyy', () => {
    expect(formatDateDDMMMYYYY('2026-11-19')).toBe('19-Nov-2026');
    expect(formatDateDDMMMYYYY('2026-10-31')).toBe('31-Oct-2026');
    expect(formatDateDDMMMYYYY('2026-01-05')).toBe('05-Jan-2026');
    expect(formatDateDDMMMYYYY('2026-05-01')).toBe('01-May-2026');
  });

  it('formats space-separated date strings (e.g. 31 Oct 2026)', () => {
    expect(formatDateDDMMMYYYY('31 Oct 2026')).toBe('31-Oct-2026');
    expect(formatDateDDMMMYYYY('5 nov 2026')).toBe('05-Nov-2026');
  });

  it('formats numeric DD-MM-YYYY dates', () => {
    expect(formatDateDDMMMYYYY('19-11-2026')).toBe('19-Nov-2026');
    expect(formatDateDDMMMYYYY('01/02/2026')).toBe('01-Feb-2026');
  });

  it('formats Date objects correctly', () => {
    const d = new Date(2026, 10, 19); // month index 10 is Nov
    expect(formatDateDDMMMYYYY(d)).toBe('19-Nov-2026');
  });

  it('gracefully handles empty, null, or undefined dates', () => {
    expect(formatDateDDMMMYYYY(null)).toBe('-');
    expect(formatDateDDMMMYYYY(undefined)).toBe('-');
    expect(formatDateDDMMMYYYY('')).toBe('-');
    expect(formatDateDDMMMYYYY('-')).toBe('-');
    expect(formatDateDDMMMYYYY('N/A')).toBe('-');
  });

  it('formatDisplayDate alias behaves identically', () => {
    expect(formatDisplayDate('2026-11-30')).toBe('30-Nov-2026');
  });
});
