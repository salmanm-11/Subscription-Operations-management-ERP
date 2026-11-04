const fs = require('fs');
const path = require('path');

const fullData = require('../src/api/fullInitialData.json');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function run() {
  console.log('Generating supabase/seed_full_data.sql...');
  const lines = [];

  lines.push('-- ==============================================================================');
  lines.push('-- KARAMA MESS MANAGEMENT - FULL SEED DATA');
  lines.push('-- Includes 310 Buildings, 436 Customers, 87 Overdue Invoices, and 365 Ledger Days');
  lines.push('-- Currency: AED');
  lines.push('-- ==============================================================================\n');

  lines.push('BEGIN;\n');

  // Buildings
  lines.push('-- 1. BUILDINGS');
  for (const b of fullData.buildings) {
    lines.push(`INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES (${escapeSql(b.id)}, 'b0000000-0000-0000-0000-000000000001', ${escapeSql(b.name)}, ${escapeSql(b.area)}, ${escapeSql(b.address)}, ${b.total_floors || 1})
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;\n`);
  }

  // Customers
  lines.push('\n-- 2. CUSTOMERS');
  for (const c of fullData.customers) {
    const status = c.status === 'paused' ? 'paused' : (c.status === 'left' ? 'left' : 'active');
    lines.push(`INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES (${escapeSql(c.id)}, 'b0000000-0000-0000-0000-000000000001', ${escapeSql(c.customer_code)}, ${escapeSql(c.full_name)}, ${escapeSql(c.phone)}, ${escapeSql(c.email)}, ${escapeSql(c.building_id)}, ${escapeSql(c.apartment_cache)}, ${escapeSql(c.meal_plan_id)}, ${c.has_breakfast ? 'true' : 'false'}, ${c.has_lunch ? 'true' : 'false'}, ${c.has_dinner ? 'true' : 'false'}, ${c.monthly_rate || 380}, ${escapeSql(c.dietary_preferences)}, ${escapeSql(c.joining_date || '2026-09-01')}, ${escapeSql(c.billing_start_date || '2026-10-01')}, ${escapeSql(status)}, ${escapeSql(c.payment_rating || 'Good')}, ${escapeSql(c.notes)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  // Invoices
  lines.push('\n-- 3. INVOICES');
  for (const inv of fullData.invoices) {
    lines.push(`INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES (${escapeSql(inv.id)}, 'b0000000-0000-0000-0000-000000000001', ${escapeSql(inv.invoice_number)}, ${escapeSql(inv.customer_id)}, ${escapeSql(inv.issue_date)}, ${escapeSql(inv.due_date)}, ${escapeSql(inv.period_start)}, ${escapeSql(inv.period_end)}, ${inv.subtotal}, ${inv.total_amount}, ${inv.paid_amount || 0}, ${inv.balance_amount || inv.total_amount}, ${escapeSql(inv.status)}, ${escapeSql(inv.notes)})
ON CONFLICT (id) DO NOTHING;\n`);
  }

  lines.push('\nCOMMIT;\n');

  fs.writeFileSync(path.join(__dirname, '../supabase/seed_full_data.sql'), lines.join(''), 'utf8');
  console.log('Generated supabase/seed_full_data.sql successfully!');
}

run();
