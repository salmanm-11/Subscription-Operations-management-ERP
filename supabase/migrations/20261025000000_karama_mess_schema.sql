-- ==============================================================================
-- KARAMA MESS MANAGEMENT SOFTWARE - DATABASE SCHEMA & MIGRATIONS
-- Database: PostgreSQL (Supabase)
-- Multi-Tenant with strict Row-Level Security (RLS)
-- Default Currency: AED (United Arab Emirates Dirham)
-- Timezone: Asia/Dubai
-- NO SOFTWARE LICENSING / NO SOFTWARE SUBSCRIPTIONS TABLES
-- ==============================================================================

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'manager', 'staff');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE customer_status AS ENUM ('active', 'inactive', 'paused', 'left');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status AS ENUM ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_enum AS ENUM ('cash', 'bank_transfer', 'card', 'cheque', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 3. BUSINESSES TABLE (Tenants)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    trade_license_no TEXT,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 4. BUSINESS MEMBERS (Users authorized for a business)
CREATE TABLE IF NOT EXISTS public.business_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role user_role NOT NULL DEFAULT 'staff',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, user_id)
);

-- 5. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS public.business_settings (
    business_id UUID PRIMARY KEY REFERENCES public.businesses(id) ON DELETE CASCADE,
    currency VARCHAR(10) NOT NULL DEFAULT 'AED',
    timezone TEXT NOT NULL DEFAULT 'Asia/Dubai',
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT DEFAULT 'Dubai',
    country TEXT DEFAULT 'United Arab Emirates',
    logo_url TEXT,
    invoice_prefix TEXT NOT NULL DEFAULT 'INV-',
    next_invoice_number INTEGER NOT NULL DEFAULT 1001,
    default_payment_terms_days INTEGER NOT NULL DEFAULT 7,
    tax_enabled BOOLEAN NOT NULL DEFAULT false,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    tax_number TEXT,
    business_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 6. BUILDINGS
CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    area TEXT,
    address TEXT,
    total_floors INTEGER,
    door_passcode TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, name)
);

-- 7. ROOMS / APARTMENTS
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    building_id UUID REFERENCES public.buildings(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    floor_number INTEGER,
    capacity INTEGER DEFAULT 1,
    delivery_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(building_id, room_number)
);

-- 8. MEAL PLANS
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
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

-- 9. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_code TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    building_id UUID REFERENCES public.buildings(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    building_name_cache TEXT,
    apartment_cache TEXT,
    meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE SET NULL,
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
    status customer_status NOT NULL DEFAULT 'active',
    payment_rating TEXT DEFAULT 'Good',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, customer_code)
);

-- 10. MEAL ATTENDANCE
CREATE TABLE IF NOT EXISTS public.meal_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    marked_by UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, customer_id, attendance_date, meal_type)
);

-- 11. INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
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
    status invoice_status NOT NULL DEFAULT 'issued',
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, invoice_number)
);

-- 12. INVOICE ITEMS
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 13. PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    payment_number TEXT NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method payment_method_enum NOT NULL DEFAULT 'cash',
    reference_number TEXT,
    notes TEXT,
    recorded_by UUID,
    is_reversed BOOLEAN NOT NULL DEFAULT false,
    reversal_reason TEXT,
    reversed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW()),
    UNIQUE(business_id, payment_number)
);

-- 14. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID,
    action TEXT NOT NULL,
    entity_table TEXT NOT NULL,
    entity_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Dubai', NOW())
);

-- 15. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_customers_business ON public.customers(business_id, status);
CREATE INDEX IF NOT EXISTS idx_buildings_business ON public.buildings(business_id);
CREATE INDEX IF NOT EXISTS idx_rooms_building ON public.rooms(building_id);
CREATE INDEX IF NOT EXISTS idx_attendance_lookup ON public.meal_attendance(business_id, attendance_date, meal_type);
CREATE INDEX IF NOT EXISTS idx_invoices_business ON public.invoices(business_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_payments_business ON public.payments(business_id, payment_date);

-- 16. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_business_member(b_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.business_members
        WHERE business_id = b_id 
          AND user_id = auth.uid()
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_business_owner(b_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.business_members
        WHERE business_id = b_id 
          AND user_id = auth.uid()
          AND role = 'owner'
          AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for public data access
DO $$ BEGIN
    CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Members can view authorized business" ON public.businesses FOR SELECT USING (public.is_business_member(id) OR auth.uid() = owner_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create business" ON public.businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Business members access buildings" ON public.buildings FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Business members access rooms" ON public.rooms FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Business members access meal plans" ON public.meal_plans FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Business members access customers" ON public.customers FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Business members access meal attendance" ON public.meal_attendance FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Business members access invoices" ON public.invoices FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Business members access invoice items" ON public.invoice_items FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Business members access payments" ON public.payments FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Members can view settings" ON public.business_settings FOR ALL USING (public.is_business_member(business_id));
EXCEPTION WHEN duplicate_object THEN null; END $$;
