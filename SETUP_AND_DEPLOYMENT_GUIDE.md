# 📖 Karama Mess Management Software — Setup & Deployment Guide

This guide provides instructions for setting up the central Supabase PostgreSQL cloud database, configuring multi-tenant Row Level Security (RLS), deploying to multiple desktop PCs, and managing data backups.

---

## 1. Cloud Database Setup (Supabase PostgreSQL)

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project**.
3. Choose a project name (e.g. `karama-mess-central`), database password, and select region **Middle East (UAE / Bahrain)** or Europe for lowest latency from Dubai.
4. Note your **Project URL** (`https://<project-ref>.supabase.co`) and **anon public key** from **Project Settings > API**.

### Step 2: Apply Database Schema & RLS Migrations
1. In your Supabase dashboard, go to the **SQL Editor**.
2. Open the file [`supabase/migrations/20261025000000_karama_mess_schema.sql`](./supabase/migrations/20261025000000_karama_mess_schema.sql).
3. Copy the entire SQL content and paste it into the SQL Editor.
4. Click **Run**.
5. This creates:
   - Multi-tenant tables (`businesses`, `profiles`, `business_members`, `customers`, `buildings`, `rooms`, `meal_plans`, `meal_attendance`, `invoices`, `payments`, `business_settings`, `audit_logs`).
   - Performance indexes.
   - Row-Level Security (RLS) policies on all tables ensuring Business A can never access Business B records.

---

## 2. Multi-PC Cloud Synchronization

To connect multiple computers (e.g. Counter PC, Kitchen Tablet, Owner Laptop) to the same live database:

1. On **Computer 1** (e.g. Counter):
   - Open **Karama Mess Management Software**.
   - Navigate to **Settings > Cloud Synchronization**.
   - Paste your **Supabase URL** and **Anon Key**.
   - Click **Save Cloud Configuration**.
2. On **Computer 2** (e.g. Kitchen or Owner Laptop):
   - Open the software.
   - Enter the identical **Supabase URL** and **Anon Key**.
   - Click **Save Cloud Configuration**.
3. **Verify Synchronization:**
   - On Computer 1: Add a new customer or record a payment.
   - On Computer 2: Click the **Refresh** button or view the customer list. The new record appears instantly.

---

## 3. Inviting Authorized Staff & Assigning Roles

1. In Supabase Dashboard > **Authentication > Users**, invite your staff member's email address.
2. Once the user signs up, insert a row in the `business_members` table assigning their role:
   - `owner`: Full access to business profile, settings, staff management, financials.
   - `manager`: Full customer, attendance, billing, and payment management.
   - `staff`: Attendance marking and viewing assigned customer details.

---

## 4. Backups and Disaster Recovery

### Automated Cloud Backups
- Supabase automatically takes daily backups of your PostgreSQL database.
- For point-in-time recovery (PITR), enable WAL archiving in Supabase Database Settings.

### Manual Data Export
- In the desktop application, click **Export CSV** in **Customers** and **Reports** to save local snapshots of all customer records and billing data in standard spreadsheet format.

---

## 5. Security & Tenant Isolation Checklist

- [x] **Row-Level Security (RLS)** enabled on all database tables.
- [x] **No Service Role Key** is ever stored or bundled in the desktop application client.
- [x] **Electron Security:** `contextIsolation: true`, `nodeIntegration: false`, secure preload script via `contextBridge`.
- [x] **Content Security Policy (CSP)** strictly restricts remote resource execution.
- [x] **AED Currency Display:** Formatted consistently as `AED 1,250.00`. No Indian Rupee (₹) or foreign symbols.
- [x] **Zero Software Subscriptions:** No software activation codes, license expiry, or feature blocking.
