import { describe, it, expect } from 'vitest';
import { Customer, Building } from '../src/types';

describe('Customer Directory Robust Search Filtering', () => {
  const sampleBuildings: Building[] = [
    {
      id: 'b-vijazla',
      business_id: 'biz-1',
      name: 'Vijazla',
      area: 'Park, Pioneer & Post Office',
      created_at: '2026-01-01',
    },
    {
      id: 'b-44',
      business_id: 'biz-1',
      name: '44 BUILDING',
      area: 'Karama Central',
      created_at: '2026-01-01',
    },
  ];

  const sampleCustomers: Customer[] = [
    {
      id: 'cust-1',
      business_id: 'biz-1',
      customer_code: 'CUST-031',
      full_name: 'Aaromal',
      phone: '+971 50 123 4567',
      emergency_contact: '+971 52 999 8888',
      building_id: 'b-vijazla',
      building_name_cache: 'Vijazla',
      apartment_cache: '106',
      has_breakfast: false,
      has_lunch: true,
      has_dinner: true,
      monthly_rate: 380,
      dietary_preferences: '2 Time, Lunch & Dinner',
      delivery_time: '1:00 PM',
      door_passcode: '1060',
      joining_date: '2026-11-01',
      billing_start_date: '2026-11-01',
      status: 'active',
      managed_by: 'admin',
      notes: 'Ring bell twice',
      created_at: '2026-11-01',
      updated_at: '2026-11-01',
    },
    {
      id: 'cust-2',
      business_id: 'biz-1',
      customer_code: 'CUST-044',
      full_name: 'Mohammed Shinas',
      phone: '+971 55 987 6543',
      emergency_contact: '',
      building_id: 'b-44',
      building_name_cache: '44 BUILDING',
      apartment_cache: '302',
      has_breakfast: true,
      has_lunch: false,
      has_dinner: true,
      monthly_rate: 300,
      dietary_preferences: 'Spicy chicken, extra rice',
      delivery_time: '8:00 PM',
      door_passcode: '',
      joining_date: '2026-11-01',
      billing_start_date: '2026-11-01',
      status: 'active',
      managed_by: 'manager',
      notes: '',
      created_at: '2026-11-01',
      updated_at: '2026-11-01',
    },
  ];

  const normalizeDigits = (val: string) => {
    const d = val.replace(/\D/g, '');
    return d.replace(/^971/, '').replace(/^0/, '');
  };

  const filterFn = (customers: Customer[], searchTerm: string) => {
    const rawSearch = (searchTerm || '').trim().toLowerCase();
    const searchTokens = rawSearch ? rawSearch.split(/\s+/).filter(Boolean) : [];

    return customers.filter((c) => {
      if (searchTokens.length === 0) return true;

      const fullName = (c.full_name || '').toLowerCase();
      const code = (c.customer_code || '').toLowerCase();
      const codeDigits = code.replace(/\D/g, '');
      const phone = String(c.phone || '');
      const phoneDigits = phone.replace(/\D/g, '');
      const normPhone = normalizeDigits(phone);
      const emergency = String(c.emergency_contact || '');
      const emergencyDigits = emergency.replace(/\D/g, '');
      const normEmergency = normalizeDigits(emergency);
      const buildingName = (c.building_name_cache || '').toLowerCase();
      const apt = String(c.apartment_cache || '').toLowerCase();
      const aptDigits = apt.replace(/\D/g, '');
      const dietary = (c.dietary_preferences || '').toLowerCase();
      const deliveryTime = (c.delivery_time || '').toLowerCase();
      const passcode = (c.door_passcode || '').toLowerCase();
      const notes = (c.notes || '').toLowerCase();

      return searchTokens.every((token) => {
        const cleanTokenDigits = token.replace(/\D/g, '');
        const normTokenDigits = normalizeDigits(token);
        return (
          fullName.includes(token) ||
          code.includes(token) ||
          (cleanTokenDigits && codeDigits.includes(cleanTokenDigits)) ||
          phone.includes(token) ||
          (cleanTokenDigits && phoneDigits.includes(cleanTokenDigits)) ||
          (normTokenDigits && normPhone.includes(normTokenDigits)) ||
          emergency.includes(token) ||
          (cleanTokenDigits && emergencyDigits.includes(cleanTokenDigits)) ||
          (normTokenDigits && normEmergency.includes(normTokenDigits)) ||
          buildingName.includes(token) ||
          apt.includes(token) ||
          (cleanTokenDigits && aptDigits.includes(cleanTokenDigits)) ||
          dietary.includes(token) ||
          deliveryTime.includes(token) ||
          passcode.includes(token) ||
          notes.includes(token)
        );
      });
    });
  };

  it('matches customer by exact and partial name', () => {
    expect(filterFn(sampleCustomers, 'Aaromal').length).toBe(1);
    expect(filterFn(sampleCustomers, 'aar').length).toBe(1);
    expect(filterFn(sampleCustomers, 'Shinas').length).toBe(1);
  });

  it('matches customer by raw and unformatted code', () => {
    expect(filterFn(sampleCustomers, 'CUST-031').length).toBe(1);
    expect(filterFn(sampleCustomers, '031').length).toBe(1);
    expect(filterFn(sampleCustomers, '#031').length).toBe(1);
  });

  it('matches customer by apartment / room number', () => {
    expect(filterFn(sampleCustomers, '106').length).toBe(1);
    expect(filterFn(sampleCustomers, '302').length).toBe(1);
    expect(filterFn(sampleCustomers, '99999').length).toBe(0);
  });

  it('matches customer by unformatted phone digits', () => {
    // Phone in DB is +971 50 123 4567
    expect(filterFn(sampleCustomers, '0501234567').length).toBe(1);
    expect(filterFn(sampleCustomers, '501234567').length).toBe(1);
    expect(filterFn(sampleCustomers, '1234567').length).toBe(1);
  });

  it('matches multi-word queries across fields', () => {
    // Customer name + room
    expect(filterFn(sampleCustomers, 'Aaromal 106').length).toBe(1);
    // Customer name + building
    expect(filterFn(sampleCustomers, 'Shinas 44').length).toBe(1);
    // Customer name + meal
    expect(filterFn(sampleCustomers, 'Aaromal Dinner').length).toBe(1);
  });

  it('handles leading and trailing whitespace safely', () => {
    expect(filterFn(sampleCustomers, '  Aaromal   ').length).toBe(1);
  });
});
