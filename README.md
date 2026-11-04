# 🥘 Karama Mess Management & Catering System

A full-stack, local-first web application designed specifically for **Karama Mess** (Dubai, UAE) to streamline subscription management, daily kitchen preparation, delivery route dispatching, billing follow-ups with 1-click WhatsApp reminders, pro-rata days calculation, and financial bookkeeping.

---

## 🚀 Quick Start

### 1. Launch the System
Double-click **`start.bat`** or run in your terminal:
```bash
node server.js
```

### 2. Access the Application
- **On this PC (Admin):** Open [http://localhost:3000](http://localhost:3000)
- **On Mobile Phones (Drivers & Kitchen):** Open `http://<your-local-ip>:3000` (e.g. `http://192.168.0.106:3000`) on any smartphone connected to the same Wi-Fi.

---

## 🌟 Key Features & Operational Modules

### 1. 👥 Customers & Subscriptions Hub
- **168 Pre-loaded Active Customers** categorized across the 4 primary delivery zones:
  - 🟠 **Burjman & Mankhool**
  - 🟡 **Park, Pioneer & ADCB**
  - 🟢 **Karama Center - Pyramid**
  - 🟣 **Hamdan Colony & Post**
- Multi-filter directory: Live search by name, building, apartment, meal combination (1, 2, or 3 times/day), status (`Running`, `Trial`, `Under Notice`, `Paused`, `Cancelled`), payment rating (`Good`, `Late payer`, `Bad`), and pending dues.
- Detailed customer profiles with dietary tags (*No fish curry*, *Barik rice*, *Handmade chapati*, *Pure veg*, *No beef*), door passcodes (*4695#*, *7580#*), and delivery timing targets (*5:45 AM*, *6:00 AM*, *12:00 PM Noon*).

### 2. 🍳 Kitchen Preparation Board
- High-contrast display optimized for tablets or kitchen wall monitors.
- Big-number batch meal counters: Total Breakfasts (BF), Lunches (LN), and Dinners (DN) to prepare today.
- Granular dietary breakdown counters:
  - 🍚 **Barik Rice** vs. **Normal Kerala Meal Rice**
  - 🫓 **Chapati Sets** vs. **Normal Rice Meals**
  - 👨‍🍳 **Handmade Chapati** (strictly no machine)
  - 🥦 **Pure Veg Only**
  - 🐟 **No Fish Curry** (substitute egg omelette or fish fry)
  - 🥩 **No Beef**
  - 🥚 **Egg Substitute Required**
- One-click **Printable Kitchen Sheet** formatted for clean paper or clipboard packing slips.

### 3. 🛵 Delivery Boy Dispatch Run Sheet
- Built for motorcycle and van drivers navigating Dubai streets.
- Organized by **Area** and grouped by **Building Name** & **Apartment / Room #** for the most efficient drop-off sequence.
- Prominently surfaces **Door Passcodes** (e.g. `4695#`), exact drop locations (*Inside kitchen*, *Top of refrigerator*, *Shoe rack*), delivery time, and dietary box labels.
- Interactive **"Mark Delivered"** button that changes color to green and records delivery timestamps.
- Tap-to-Call and Tap-to-WhatsApp direct links so drivers can instantly reach customers if building doors are locked.

### 4. 💰 Billing, Overdue Dues & 1-Click WhatsApp Reminders
- Complete tracking of outstanding balances (Totaling **AED 22,193** matching the original spreadsheet).
- **1-Click WhatsApp Reminder**: Constructs customized polite reminder messages in WhatsApp with customer name, exact dues amount, billed date, and payment instructions.
- Payment recording dialog: Logs payments, automatically reduces overdue balances, extends subscription dates, and records the receipt into daily ledger accounts.

### 5. 🧮 Pro-Rata Days & Partial Month Calculator
- Implements the exact pricing formulas of Karama Mess:
  - **3 Times/day:** ~13.0 AED/day (e.g. 10 days = 130 AED)
  - **2 Times/day:** ~10.0 AED/day (e.g. 13 days = 130 AED)
  - **1 Time/day:** ~6.2 AED/day
- Select start and end date, choose meal frequency, apply discounts/deductions, and calculate final charges with a 1-click button to apply directly to a customer's bill.

### 6. 📖 Moms Accounts (Daily Financial Ledger)
- 365 days of historical accounting pre-loaded (from Jan 1, 2026 through year-end).
- Accurate meal revenue calculation:
  $$\text{Daily Charges} = (\text{BF} \times 3.27) + (\text{LN} \times 4.385) + (\text{DN} \times 4.27)$$
- Daily collection tracking, daily net difference, and cumulative running mess balance.
- Monthly filtering and CSV export.

### 7. 🏢 Corporate & Group Accounts (Thahir Group)
- Multi-member corporate contracts (e.g., Thahir Group staff accommodation across Star of Karama, Dhe Fish, and A9).
- Roster tracking of member headcounts, start/stop dates, and amounts.
- Group ledger tracking: Old balance, total member charges, installment payments, and net overdue.
- 1-Click WhatsApp Corporate Statement generator.

### 8. ⚠️ Bad Debts Register
- 22 pre-loaded accounts of vacated or stopped customers with unpaid debts (Totaling **AED 2,592**).
- Status tracking (`Pending` vs. `Recovered`).

---

## 🗄️ Database & Architecture

- **Backend:** Node.js (built-in `node:http` & native `node:sqlite`). Zero external npm dependency overhead.
- **Database:** SQLite (`mess.db`) with Write-Ahead Logging (WAL) and ACID transactions.
- **Frontend:** Responsive HTML5 / CSS3 / Vanilla JavaScript SPA with print media queries and mobile responsive touch controls.
- **Seeder:** `seed_database.js` reads and loads Excel/CSV data with 100% data integrity.
