import { describe, it, expect } from 'vitest';
import {
  getMatchingMealPlan,
  resolveExpectedMonthlyRate,
  isCustomerRateMismatched,
  syncCustomersWithMealPlans,
} from '../src/utils/mealPlanPricingService';
import { Customer, MealPlan } from '../src/types';

describe('Meal Plan Pricing & Auto-Synchronization Service', () => {
  const samplePlans: MealPlan[] = [
    {
      id: 'mp-3-times',
      business_id: 'biz-1',
      name: '3 Times Full',
      monthly_price: 380,
      per_meal_price: 13,
      includes_breakfast: true,
      includes_lunch: true,
      includes_dinner: true,
      is_active: true,
      created_at: '2026-01-01',
    },
    {
      id: 'mp-2-times-ld',
      business_id: 'biz-1',
      name: '2 Times Lunch & Dinner',
      monthly_price: 300,
      per_meal_price: 10,
      includes_breakfast: false,
      includes_lunch: true,
      includes_dinner: true,
      is_active: true,
      created_at: '2026-01-01',
    },
    {
      id: 'mp-1-time-l',
      business_id: 'biz-1',
      name: '1 Time Lunch Only',
      monthly_price: 180,
      per_meal_price: 6,
      includes_breakfast: false,
      includes_lunch: true,
      includes_dinner: false,
      is_active: true,
      created_at: '2026-01-01',
    },
  ];

  it('correctly matches customers by meal flags', () => {
    // 1-meal customer (e.g. Rejeesh)
    const rejeesh: Partial<Customer> = {
      full_name: 'Rejeesh',
      has_breakfast: false,
      has_lunch: true,
      has_dinner: false,
    };
    const matched = getMatchingMealPlan(rejeesh, samplePlans);
    expect(matched?.id).toBe('mp-1-time-l');
    expect(resolveExpectedMonthlyRate(rejeesh, samplePlans)).toBe(180);

    // 2-meal customer (e.g. Rashid)
    const rashid: Partial<Customer> = {
      full_name: 'Rashid',
      has_breakfast: false,
      has_lunch: true,
      has_dinner: true,
    };
    const matchedRashid = getMatchingMealPlan(rashid, samplePlans);
    expect(matchedRashid?.id).toBe('mp-2-times-ld');
    expect(resolveExpectedMonthlyRate(rashid, samplePlans)).toBe(300);
  });

  it('detects mismatched rates when 1-meal or 2-meal customers have 380 AED rate', () => {
    const mismatchedCustomer: Customer = {
      id: 'c-1',
      business_id: 'b-1',
      customer_code: 'CUST-011',
      full_name: 'Rejeesh',
      has_breakfast: false,
      has_lunch: true,
      has_dinner: false,
      monthly_rate: 380, // Defaulted by old import
      status: 'active',
      joining_date: '2026-01-01',
      billing_start_date: '2026-01-01',
      created_at: '2026-01-01',
      updated_at: '2026-01-01',
    };

    expect(isCustomerRateMismatched(mismatchedCustomer, samplePlans)).toBe(true);
  });

  it('batch synchronizes mismatched customer rates to their active meal plan price', () => {
    const customers: Customer[] = [
      {
        id: 'c-1',
        business_id: 'b-1',
        customer_code: 'CUST-011',
        full_name: 'Rejeesh',
        has_breakfast: false,
        has_lunch: true,
        has_dinner: false,
        monthly_rate: 380, // Mismatched 1-meal customer
        status: 'active',
        joining_date: '2026-01-01',
        billing_start_date: '2026-01-01',
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      },
      {
        id: 'c-2',
        business_id: 'b-1',
        customer_code: 'CUST-037',
        full_name: 'Rashid',
        has_breakfast: false,
        has_lunch: true,
        has_dinner: true,
        monthly_rate: 380, // Mismatched 2-meal customer
        status: 'active',
        joining_date: '2026-01-01',
        billing_start_date: '2026-01-01',
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      },
      {
        id: 'c-3',
        business_id: 'b-1',
        customer_code: 'CUST-001',
        full_name: 'Salman',
        has_breakfast: true,
        has_lunch: true,
        has_dinner: true,
        monthly_rate: 380, // Already correct 3-meal customer
        status: 'active',
        joining_date: '2026-01-01',
        billing_start_date: '2026-01-01',
        created_at: '2026-01-01',
        updated_at: '2026-01-01',
      },
    ];

    const { updatedCustomers, changedCount } = syncCustomersWithMealPlans(customers, samplePlans, false);
    expect(changedCount).toBe(2);

    const updatedRejeesh = updatedCustomers.find((c) => c.customer_code === 'CUST-011');
    expect(updatedRejeesh?.monthly_rate).toBe(180);
    expect(updatedRejeesh?.meal_plan_id).toBe('mp-1-time-l');

    const updatedRashid = updatedCustomers.find((c) => c.customer_code === 'CUST-037');
    expect(updatedRashid?.monthly_rate).toBe(300);
    expect(updatedRashid?.meal_plan_id).toBe('mp-2-times-ld');

    const updatedSalman = updatedCustomers.find((c) => c.customer_code === 'CUST-001');
    expect(updatedSalman?.monthly_rate).toBe(380);
  });
});
