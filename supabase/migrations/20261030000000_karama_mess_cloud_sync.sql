-- ==============================================================================
-- KARAMA MESS MANAGEMENT SOFTWARE - COMPLETE CLOUD SYNCHRONIZATION MIGRATION
-- Database: PostgreSQL (Supabase)
-- Multi-PC Synchronization with Row-Level Security (RLS) & Real-time Replication
-- Currency: AED (United Arab Emirates Dirham)
-- Timezone: Asia/Dubai
-- Safe & Idempotent: Can be executed multiple times without errors or duplicates.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS & DOMAIN TYPES (Safe idempotence)
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('owner', 'manager', 'staff');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE customer_status_enum AS ENUM ('active', 'inactive', 'paused', 'left', 'trial');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status_enum AS ENUM ('present', 'absent', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status_enum AS ENUM ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('cash', 'bank_transfer', 'card', 'cheque', 'online', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TENANT & BUSINESSES
CREATE TABLE IF NOT EXISTS public.businesses (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    trade_license_no TEXT,
    owner_id TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 4. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS public.business_settings (
    business_id TEXT PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL DEFAULT 'AED',
    timezone TEXT NOT NULL DEFAULT 'Asia/Dubai',
    contact_person TEXT,
    phone TEXT,
    emergency_contact TEXT,
    email TEXT,
    address TEXT,
    city TEXT DEFAULT 'Dubai',
    country TEXT DEFAULT 'United Arab Emirates',
    logo_url TEXT,
    invoice_prefix TEXT NOT NULL DEFAULT 'INV-2026-',
    next_invoice_number INTEGER NOT NULL DEFAULT 1001,
    default_payment_terms_days INTEGER NOT NULL DEFAULT 7,
    tax_enabled BOOLEAN NOT NULL DEFAULT false,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    tax_number TEXT,
    business_notes TEXT DEFAULT 'Good Food. Happy People.',
    due_reminder_days INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 5. APPLICATION USERS & SESSIONS (For multi-PC staff accounts)
CREATE TABLE IF NOT EXISTS public.auth_users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    username TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff',
    role_title TEXT NOT NULL DEFAULT 'Staff Member',
    password_hash TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 6. BUILDINGS & ACCOMMODATION
CREATE TABLE IF NOT EXISTS public.buildings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    name TEXT NOT NULL,
    area TEXT DEFAULT 'Karama',
    address TEXT,
    total_floors INTEGER DEFAULT 1,
    door_passcode TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, name)
);

-- 7. ROOMS & APARTMENTS
CREATE TABLE IF NOT EXISTS public.rooms (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    building_id TEXT REFERENCES public.buildings(id) ON DELETE SET NULL,
    room_number TEXT NOT NULL,
    floor_number INTEGER,
    capacity INTEGER DEFAULT 1,
    delivery_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 8. MEAL PLANS
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    name TEXT NOT NULL,
    description TEXT,
    monthly_price NUMERIC(10, 2) NOT NULL DEFAULT 380.00,
    per_meal_price NUMERIC(10, 2) NOT NULL DEFAULT 13.00,
    includes_breakfast BOOLEAN NOT NULL DEFAULT true,
    includes_lunch BOOLEAN NOT NULL DEFAULT true,
    includes_dinner BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, name)
);

-- 9. CUSTOMERS DIRECTORY
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    customer_code TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    emergency_contact TEXT,
    email TEXT,
    building_id TEXT REFERENCES public.buildings(id) ON DELETE SET NULL,
    room_id TEXT REFERENCES public.rooms(id) ON DELETE SET NULL,
    building_name_cache TEXT,
    apartment_cache TEXT,
    meal_plan_id TEXT REFERENCES public.meal_plans(id) ON DELETE SET NULL,
    has_breakfast BOOLEAN NOT NULL DEFAULT false,
    has_lunch BOOLEAN NOT NULL DEFAULT true,
    has_dinner BOOLEAN NOT NULL DEFAULT true,
    monthly_rate NUMERIC(10, 2) NOT NULL DEFAULT 380.00,
    dietary_preferences TEXT,
    delivery_time TEXT,
    door_passcode TEXT,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    billing_start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    billing_end_date DATE,
    payment_made_up_to_date DATE,
    billed_up_to_date DATE,
    status TEXT NOT NULL DEFAULT 'active',
    payment_rating TEXT DEFAULT 'Good',
    total_overdue NUMERIC(10, 2) DEFAULT 0.00,
    managed_by TEXT DEFAULT 'customer',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, customer_code)
);

-- 10. MEAL ATTENDANCE
CREATE TABLE IF NOT EXISTS public.meal_attendance (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    customer_id TEXT NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type VARCHAR(20) NOT NULL,
    status TEXT NOT NULL DEFAULT 'present',
    marked_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, customer_id, attendance_date, meal_type)
);

-- 11. INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    invoice_number TEXT NOT NULL,
    customer_id TEXT NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    customer_name_cache TEXT,
    building_cache TEXT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'issued',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, invoice_number)
);

-- 12. INVOICE ITEMS
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    invoice_id TEXT NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 13. PAYMENTS & COLLECTIONS
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    payment_number TEXT NOT NULL,
    customer_id TEXT NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    invoice_id TEXT REFERENCES public.invoices(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL DEFAULT 'cash',
    reference_number TEXT,
    notes TEXT,
    is_reversed BOOLEAN NOT NULL DEFAULT false,
    reversal_reason TEXT,
    reversed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, payment_number)
);

-- 14. VENDOR ACCOUNTS MANAGEMENT MODULE
CREATE TABLE IF NOT EXISTS public.vendors (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    vendor_code TEXT NOT NULL,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    address TEXT,
    category TEXT NOT NULL DEFAULT 'Meal Catering / Kitchen',
    breakfast_rate NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    lunch_rate NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    dinner_rate NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    service_charge_config JSONB NOT NULL DEFAULT '{"type":"fixed","value":0,"is_enabled":false}'::jsonb,
    delivery_charge_config JSONB NOT NULL DEFAULT '{"type":"fixed","value":0,"is_enabled":false}'::jsonb,
    packing_charge_config JSONB NOT NULL DEFAULT '{"type":"fixed","value":0,"is_enabled":false}'::jsonb,
    other_charges_config JSONB NOT NULL DEFAULT '{"type":"fixed","value":0,"is_enabled":false}'::jsonb,
    opening_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_terms TEXT NOT NULL DEFAULT 'Daily',
    status TEXT NOT NULL DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, vendor_code)
);

-- 15. VENDOR TRANSACTIONS & DAILY MEAL ENTRIES
CREATE TABLE IF NOT EXISTS public.vendor_transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    vendor_id TEXT NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    vendor_name_cache TEXT,
    transaction_type TEXT NOT NULL DEFAULT 'daily_meal_entry',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    day_name TEXT,
    description TEXT,
    breakfast_qty NUMERIC(10, 2) NOT NULL DEFAULT 0,
    lunch_qty NUMERIC(10, 2) NOT NULL DEFAULT 0,
    dinner_qty NUMERIC(10, 2) NOT NULL DEFAULT 0,
    breakfast_rate NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    lunch_rate NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    dinner_rate NUMERIC(10, 3) NOT NULL DEFAULT 0.000,
    meal_charges NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    service_charge NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    delivery_charge NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    packing_charge NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    other_charges NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_charges NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    running_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT,
    reference_no TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 16. VENDOR PAYMENTS
CREATE TABLE IF NOT EXISTS public.vendor_payments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    payment_number TEXT NOT NULL,
    vendor_id TEXT NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    vendor_name_cache TEXT,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL DEFAULT 'cash',
    reference_number TEXT,
    remarks TEXT,
    is_reversed BOOLEAN NOT NULL DEFAULT false,
    reversal_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, payment_number)
);

-- 17. VENDOR AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.vendor_audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    vendor_id TEXT,
    vendor_name TEXT,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    performed_by TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 18. SYSTEM ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    business_id TEXT NOT NULL DEFAULT 'b0000000-0000-0000-0000-000000000001',
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    user_id TEXT,
    user_name TEXT NOT NULL,
    user_role TEXT,
    module TEXT NOT NULL,
    action TEXT NOT NULL,
    title TEXT NOT NULL,
    details TEXT NOT NULL,
    entity_id TEXT,
    status TEXT DEFAULT 'info'
);

-- ==============================================================================
-- 19. IDEMPOTENT COLUMN ADDITIONS (Guarantees backward compatibility)
-- ==============================================================================
DO $$ BEGIN
    ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
    ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS managed_by TEXT DEFAULT 'customer';
    ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS payment_made_up_to_date DATE;
    ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS billed_up_to_date DATE;
    ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_overdue NUMERIC(10, 2) DEFAULT 0.00;
    ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS due_reminder_days INTEGER DEFAULT 5;
    ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
    ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS business_notes TEXT;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- ==============================================================================
-- 20. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_lookup ON public.customers(business_id, status);
CREATE INDEX IF NOT EXISTS idx_customers_code ON public.customers(customer_code);
CREATE INDEX IF NOT EXISTS idx_buildings_lookup ON public.buildings(business_id);
CREATE INDEX IF NOT EXISTS idx_invoices_lookup ON public.invoices(business_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_payments_lookup ON public.payments(business_id, payment_date);
CREATE INDEX IF NOT EXISTS idx_vendors_lookup ON public.vendors(business_id, status);
CREATE INDEX IF NOT EXISTS idx_vendor_tx_lookup ON public.vendor_transactions(vendor_id, date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_lookup ON public.activity_logs(business_id, timestamp DESC);

-- ==============================================================================
-- 21. ROW LEVEL SECURITY (RLS) POLICIES FOR MULTI-PC AUTHORIZED ACCESS
-- ==============================================================================
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Cleanly drop any existing conflicting policies
DO $$ DECLARE
    tbl text;
    pol text;
BEGIN
    FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
        FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol, tbl);
        END LOOP;
    END LOOP;
END $$;

-- Create policies allowing authorized desktop applications (using project Anon/Authenticated key)
CREATE POLICY "Allow authorized application access to businesses" ON public.businesses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to business_settings" ON public.business_settings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to auth_users" ON public.auth_users FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to buildings" ON public.buildings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to rooms" ON public.rooms FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to meal_plans" ON public.meal_plans FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to customers" ON public.customers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to meal_attendance" ON public.meal_attendance FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to invoices" ON public.invoices FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to invoice_items" ON public.invoice_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to payments" ON public.payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to vendors" ON public.vendors FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to vendor_transactions" ON public.vendor_transactions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to vendor_payments" ON public.vendor_payments FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to vendor_audit_logs" ON public.vendor_audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authorized application access to activity_logs" ON public.activity_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- 22. REAL-TIME REPLICATION (Instant Multi-PC Synchronization)
-- ==============================================================================
DO $$ BEGIN
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.customers; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.payments; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_transactions; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.vendor_payments; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.business_settings; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.buildings; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.meal_plans; EXCEPTION WHEN OTHERS THEN NULL; END;
    BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_logs; EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;

-- ==============================================================================
-- 23. SEED DEFAULT BUSINESS, SETTINGS, USERS & MEAL PLANS
-- ==============================================================================

-- Default Business
INSERT INTO public.businesses (id, name, trade_license_no, owner_id)
VALUES ('b0000000-0000-0000-0000-000000000001', 'Karama Mess & Catering', 'DXB-MESS-2026-889', 'u0000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Default Settings
INSERT INTO public.business_settings (business_id, currency, timezone, contact_person, phone, email, address, city, country, invoice_prefix, next_invoice_number, default_payment_terms_days, business_notes, due_reminder_days)
VALUES ('b0000000-0000-0000-0000-000000000001', 'AED', 'Asia/Dubai', 'Admin Manager', '+971 50 123 4567', 'admin@karamamess.ae', 'Al Karama, Opposite Karama Center, Dubai', 'Dubai', 'United Arab Emirates', 'INV-2026-', 1001, 7, 'Good Food. Happy People.', 5)
ON CONFLICT (business_id) DO NOTHING;

-- Default Admin and Manager Users
INSERT INTO public.auth_users (id, business_id, username, full_name, role, role_title, password_hash, email, phone)
VALUES 
  ('user-admin-1', 'b0000000-0000-0000-0000-000000000001', 'admin', 'System Administrator', 'admin', 'Administrator', 'admin123', 'admin@karamamess.ae', '+971 50 123 4567'),
  ('user-manager-2', 'b0000000-0000-0000-0000-000000000001', 'manager', 'Mess Operations Manager', 'manager', 'Operations Manager', 'manager123', 'manager@karamamess.ae', '+971 50 998 8776')
ON CONFLICT (username) DO NOTHING;

-- Default Standard Meal Plans
INSERT INTO public.meal_plans (id, business_id, name, description, monthly_price, per_meal_price, includes_breakfast, includes_lunch, includes_dinner, is_active)
VALUES
  ('mp-3-times-bld', 'b0000000-0000-0000-0000-000000000001', '3 Time (Full Package - BF, LN & DN)', 'Complete daily catering: Breakfast, Lunch, and Dinner', 380.00, 13.00, true, true, true, true),
  ('mp-2-times-ld', 'b0000000-0000-0000-0000-000000000001', '2 Time (Lunch & Dinner Only)', 'Regular meal service: Afternoon Lunch and Evening Dinner', 310.00, 10.33, false, true, true, true),
  ('mp-2-times-bd', 'b0000000-0000-0000-0000-000000000001', '2 Time (Breakfast & Dinner Only)', 'Morning Breakfast and Evening Dinner service', 280.00, 9.33, true, false, true, true),
  ('mp-2-times-bl', 'b0000000-0000-0000-0000-000000000001', '2 Time (Breakfast & Lunch Only)', 'Morning Breakfast and Office Lunch service', 280.00, 9.33, true, true, false, true),
  ('mp-1-time-breakfast', 'b0000000-0000-0000-0000-000000000001', '1 Time (Breakfast Only)', 'Early morning breakfast delivered to room', 130.00, 4.33, true, false, false, true),
  ('mp-1-time-lunch', 'b0000000-0000-0000-0000-000000000001', '1 Time (Lunch Only)', 'Office or Room lunch delivery', 186.00, 6.20, false, true, false, true),
  ('mp-1-time-dinner', 'b0000000-0000-0000-0000-000000000001', '1 Time (Dinner Only)', 'Evening dinner delivery', 150.00, 5.00, false, false, true, true)
ON CONFLICT (id) DO NOTHING;
