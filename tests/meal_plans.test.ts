import { describe, it, expect, beforeEach } from 'vitest';
import { OfflineStorage } from '../src/api/offlineStorage';
import { MealPlan } from '../src/types';

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

describe('Meal Plan CRUD Operations', () => {
  beforeEach(() => {
    localStorage.clear();
    OfflineStorage.init();
  });

  it('can create, update, and delete a meal plan', () => {
    // 1. Create a new plan
    const created = OfflineStorage.saveMealPlan({
      name: 'Executive 3-Time VIP Plan',
      description: 'Special breakfast, executive lunch, gourmet dinner',
      monthly_price: 450,
      per_meal_price: 15,
      includes_breakfast: true,
      includes_lunch: true,
      includes_dinner: true,
      is_active: true,
    });

    expect(created.id).toBeDefined();
    expect(created.name).toBe('Executive 3-Time VIP Plan');
    expect(created.monthly_price).toBe(450);

    const plansAfterAdd = OfflineStorage.getMealPlans();
    expect(plansAfterAdd.some((p) => p.id === created.id)).toBe(true);

    // 2. Edit the meal plan
    const updated = OfflineStorage.saveMealPlan({
      id: created.id,
      name: 'Executive 3-Time VIP Plan (Updated)',
      monthly_price: 480,
      per_meal_price: 16,
    });

    expect(updated.id).toBe(created.id);
    expect(updated.name).toBe('Executive 3-Time VIP Plan (Updated)');
    expect(updated.monthly_price).toBe(480);

    const plansAfterUpdate = OfflineStorage.getMealPlans();
    const foundUpdated = plansAfterUpdate.find((p) => p.id === created.id);
    expect(foundUpdated?.name).toBe('Executive 3-Time VIP Plan (Updated)');
    expect(foundUpdated?.monthly_price).toBe(480);

    // 3. Delete the meal plan
    const deleted = OfflineStorage.deleteMealPlan(created.id);
    expect(deleted).toBe(true);

    const plansAfterDelete = OfflineStorage.getMealPlans();
    expect(plansAfterDelete.some((p) => p.id === created.id)).toBe(false);
  });
});