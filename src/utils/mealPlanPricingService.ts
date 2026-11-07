import { Customer, MealPlan } from '../types';

/**
 * Finds the matching meal plan for a customer based on meal_plan_id or active meal flags.
 */
export function getMatchingMealPlan(
  customer: Partial<Customer>,
  mealPlans: MealPlan[] = []
): MealPlan | undefined {
  // 1. Match by explicit meal_plan_id if present
  if (customer.meal_plan_id) {
    const found = mealPlans.find((p) => p.id === customer.meal_plan_id);
    if (found) return found;
  }

  const hasBf = Boolean(customer.has_breakfast);
  const hasLn = customer.has_lunch !== undefined ? Boolean(customer.has_lunch) : true;
  const hasDn = customer.has_dinner !== undefined ? Boolean(customer.has_dinner) : true;

  // 2. Match by exact meal combination (Breakfast, Lunch, Dinner)
  const exact = mealPlans.find(
    (p) =>
      Boolean(p.includes_breakfast) === hasBf &&
      Boolean(p.includes_lunch) === hasLn &&
      Boolean(p.includes_dinner) === hasDn
  );
  if (exact) return exact;

  // 3. Match by meal count (3 meals, 2 meals, 1 meal)
  const mealCount = (hasBf ? 1 : 0) + (hasLn ? 1 : 0) + (hasDn ? 1 : 0);
  const byCount = mealPlans.find((p) => {
    const pCount =
      (p.includes_breakfast ? 1 : 0) +
      (p.includes_lunch ? 1 : 0) +
      (p.includes_dinner ? 1 : 0);
    return pCount === mealCount;
  });
  if (byCount) return byCount;

  return undefined;
}

/**
 * Resolves the standard expected monthly rate for a customer based on their meal plan or meals.
 * Falls back to standard Dubai mess tiers (380 for 3 meals, 300 for 2 meals, 180 for 1 meal).
 */
export function resolveExpectedMonthlyRate(
  customer: Partial<Customer>,
  mealPlans: MealPlan[] = []
): number {
  const plan = getMatchingMealPlan(customer, mealPlans);
  if (plan && plan.monthly_price !== undefined && plan.monthly_price > 0) {
    return Number(plan.monthly_price);
  }

  const hasBf = Boolean(customer.has_breakfast);
  const hasLn = customer.has_lunch !== undefined ? Boolean(customer.has_lunch) : true;
  const hasDn = customer.has_dinner !== undefined ? Boolean(customer.has_dinner) : true;
  const mealCount = (hasBf ? 1 : 0) + (hasLn ? 1 : 0) + (hasDn ? 1 : 0);

  if (mealCount === 1) return 180;
  if (mealCount === 2) return 300;
  return 380;
}

/**
 * Checks if a customer's monthly rate is out of sync with their meal plan.
 * E.g., customer has 1 meal (Lunch only) or 2 meals, but has rate 380 AED due to default import.
 */
export function isCustomerRateMismatched(
  customer: Customer,
  mealPlans: MealPlan[] = []
): boolean {
  const expected = resolveExpectedMonthlyRate(customer, mealPlans);
  const current = Number(customer.monthly_rate) || 0;
  const mealCount =
    (customer.has_breakfast ? 1 : 0) +
    (customer.has_lunch ? 1 : 0) +
    (customer.has_dinner ? 1 : 0);

  // If customer has 1 or 2 meals but current rate is 380 (the default 3-meal rate), it is a known mismatch
  if (mealCount < 3 && current === 380) {
    return true;
  }

  // If difference is significant and customer has no custom note indicating custom rate
  if (current !== expected && current === 380 && expected !== 380) {
    return true;
  }

  return false;
}

/**
 * Batch synchronizes customer rates to match their active meal plans.
 */
export function syncCustomersWithMealPlans(
  customers: Customer[],
  mealPlans: MealPlan[] = [],
  forceAll: boolean = false
): { updatedCustomers: Customer[]; changedCount: number } {
  let changedCount = 0;

  const updatedCustomers = customers.map((c) => {
    const expectedRate = resolveExpectedMonthlyRate(c, mealPlans);
    const matchingPlan = getMatchingMealPlan(c, mealPlans);
    const currentRate = Number(c.monthly_rate) || 0;

    const shouldUpdate =
      forceAll ||
      isCustomerRateMismatched(c, mealPlans) ||
      (c.meal_plan_id && matchingPlan && c.meal_plan_id === matchingPlan.id && currentRate !== expectedRate);

    if (shouldUpdate && currentRate !== expectedRate) {
      changedCount++;
      return {
        ...c,
        meal_plan_id: matchingPlan?.id || c.meal_plan_id,
        monthly_rate: expectedRate,
        updated_at: new Date().toISOString(),
      };
    }

    if (!c.meal_plan_id && matchingPlan) {
      return {
        ...c,
        meal_plan_id: matchingPlan.id,
      };
    }

    return c;
  });

  return { updatedCustomers, changedCount };
}
