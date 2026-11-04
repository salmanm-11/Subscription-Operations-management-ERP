const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

console.log('--- Initializing SQLite Database and Seeding Data ---');

const db = new DatabaseSync('mess.db');

// Enable WAL mode & foreign keys
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Create tables
db.exec(`
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS delivery_logs;
DROP TABLE IF EXISTS daily_ledger;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS group_accounts;
DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS bad_debts;
DROP TABLE IF EXISTS pricing_settings;

CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  area TEXT NOT NULL,
  building_name TEXT NOT NULL,
  apartment TEXT DEFAULT '',
  customer_name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  status TEXT DEFAULT 'Running',
  bf INTEGER DEFAULT 0,
  ln INTEGER DEFAULT 0,
  dn INTEGER DEFAULT 0,
  label TEXT DEFAULT '',
  remarks TEXT DEFAULT '',
  delivery_time TEXT DEFAULT '',
  door_passcode TEXT DEFAULT '',
  payment_made_up_to TEXT DEFAULT '',
  billed_up_to TEXT DEFAULT '',
  total_overdue REAL DEFAULT 0,
  payment_remarks TEXT DEFAULT '',
  payment_rating TEXT DEFAULT '',
  monthly_rate REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE delivery_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  customer_id INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT DEFAULT '',
  delivered_at TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE daily_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT UNIQUE NOT NULL,
  day_name TEXT NOT NULL,
  bf_count INTEGER DEFAULT 0,
  ln_count INTEGER DEFAULT 0,
  dn_count INTEGER DEFAULT 0,
  daily_total_charges REAL DEFAULT 0,
  amount_paid REAL DEFAULT 0,
  balance REAL DEFAULT 0,
  remarks TEXT DEFAULT ''
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  customer_name TEXT NOT NULL,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT DEFAULT 'Cash',
  period_start TEXT DEFAULT '',
  period_end TEXT DEFAULT '',
  reference_no TEXT DEFAULT '',
  remarks TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE group_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_name TEXT NOT NULL,
  coordinator_name TEXT NOT NULL,
  coordinator_phone TEXT DEFAULT '',
  status TEXT DEFAULT 'Active',
  old_balance REAL DEFAULT 0,
  total_charges REAL DEFAULT 0,
  amount_paid REAL DEFAULT 0,
  total_overdue REAL DEFAULT 0,
  notes TEXT DEFAULT ''
);

CREATE TABLE group_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  member_name TEXT NOT NULL,
  building TEXT NOT NULL,
  status TEXT DEFAULT 'Stopped',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  days_count INTEGER DEFAULT 0,
  daily_rate REAL DEFAULT 13.0,
  amount REAL DEFAULT 0,
  notes TEXT DEFAULT '',
  FOREIGN KEY (group_id) REFERENCES group_accounts(id)
);

CREATE TABLE bad_debts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  building_name TEXT DEFAULT '',
  apartment TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  meals TEXT DEFAULT '',
  amount_due REAL NOT NULL,
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'Pending',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE pricing_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
`);

// Insert default pricing rules
const insertSetting = db.prepare('INSERT INTO pricing_settings (key, value) VALUES (?, ?)');
insertSetting.run('rate_bf', '3.27');
insertSetting.run('rate_ln', '4.385');
insertSetting.run('rate_dn', '4.27');
insertSetting.run('sub_1_time', '186');
insertSetting.run('sub_2_time', '310');
insertSetting.run('sub_3_time', '380');
insertSetting.run('currency', 'AED');
insertSetting.run('mess_name', 'Karama Mess & Catering');
insertSetting.run('mess_phone', '+971 50 000 0000');
insertSetting.run('mess_address', 'Al Karama, Dubai, UAE');

// Read Shared Strings
const sharedStrXml = fs.readFileSync('temp_xlsx/xl/sharedStrings.xml', 'utf8');
const strings = [];
const regex = /<si>(?:(?!<\/si>).)*?<\/si>/gs;
let match;
while ((match = regex.exec(sharedStrXml)) !== null) {
  const tMatches = [...match[0].matchAll(/<t[^>]*>(.*?)<\/t>/gs)];
  let str = tMatches.map(m => m[1]).join('');
  str = str.replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>')
           .replace(/&quot;/g, '"')
           .replace(/&apos;/g, "'");
  strings.push(str);
}

function excelDateToDate(serial) {
  if (!serial || isNaN(serial)) return serial;
  const num = parseFloat(serial);
  if (num < 10000 || num > 60000) return serial;
  const utc_days = Math.floor(num - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0];
}

function parseWorksheet(sheetNum) {
  const path = 'temp_xlsx/xl/worksheets/sheet' + sheetNum + '.xml';
  if (!fs.existsSync(path)) return [];
  const xml = fs.readFileSync(path, 'utf8');
  const rows = [];
  const rowRegex = /<row[^>]*>(.*?)<\/row>/gs;
  let rMatch;
  while ((rMatch = rowRegex.exec(xml)) !== null) {
    const rowContent = rMatch[1];
    const cellRegex = /<c\s+([^>]*?)>(?:<v>([^<]*)<\/v>)?(?:<is><t>([^<]*)<\/t><\/is>)?<\/c>/gs;
    const rowObj = {};
    let cMatch;
    while ((cMatch = cellRegex.exec(rowContent)) !== null) {
      const attrs = cMatch[1];
      let val = cMatch[2];
      const inlineText = cMatch[3];
      
      const rAttr = attrs.match(/r="([A-Z]+)[0-9]+"/);
      if (!rAttr) continue;
      const col = rAttr[1];
      
      const tAttr = attrs.match(/t="([^"]+)"/);
      const type = tAttr ? tAttr[1] : null;

      if (type === 's' && val !== undefined) {
        val = strings[parseInt(val, 10)] ?? val;
      } else if (inlineText !== undefined) {
        val = inlineText;
      } else if (val !== undefined) {
        if (col === 'A' || col === 'D' || col === 'E' || col === 'K' || col === 'L') {
          const maybeDate = excelDateToDate(val);
          if (maybeDate !== val) {
            val = maybeDate;
          }
        }
      }
      rowObj[col] = (val !== undefined && val !== null) ? String(val).trim() : '';
    }
    if (Object.keys(rowObj).length > 0) {
      rows.push(rowObj);
    }
  }
  return rows;
}

// 1. SEED CUSTOMERS (Sheet 1)
const s1 = parseWorksheet(1);
console.log('Seeding Customers from Sheet 1 (Total parsed rows:', s1.length, ')...');

const insertCust = db.prepare(`
  INSERT INTO customers (
    area, building_name, apartment, customer_name, phone, status,
    bf, ln, dn, label, remarks, delivery_time, door_passcode,
    payment_made_up_to, billed_up_to, total_overdue,
    payment_remarks, payment_rating, monthly_rate
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let customerCount = 0;
// Row 0 is header
for (let i = 1; i < s1.length; i++) {
  const r = s1[i];
  const name = r.D;
  if (!name || name === 'TOTAL' || name === 'Customer Name') continue;
  
  const area = r.A || 'Other';
  const building = r.B || '';
  let apt = r.C || '';
  if (apt.endsWith('.0')) apt = apt.replace(/\.0$/, '');

  const status = r.E || 'Running';
  const bf = (r.F === 'BF' || r.F === '1' || r.F === '1.0') ? 1 : 0;
  const ln = (r.G === 'LN' || r.G === '1' || r.G === '1.0') ? 1 : 0;
  const dn = (r.H === 'DN' || r.H === '1' || r.H === '1.0') ? 1 : 0;
  
  const label = r.I || '';
  const remarks = r.J || '';

  // Extract delivery time if specified in label or remarks
  let deliveryTime = '';
  const combinedText = label + ' ' + remarks;
  const timeMatch = combinedText.match(/(?:deliver(?:y|ed)?\s*[@at]?\s*|morning delivery\s*)([0-9]{1,2}(?::[0-9]{2})?\s*(?:am|pm|AM|PM|noon))/i);
  if (timeMatch) {
    deliveryTime = timeMatch[1].trim();
  } else if (/lunch\s*@\s*noon/i.test(combinedText) || /lunch\s*12\s*pm/i.test(combinedText)) {
    deliveryTime = '12:00 PM';
  }

  // Extract passcode if specified
  let passcode = '';
  const codeMatch = combinedText.match(/passcode[:\s]+([0-9#]+)|([0-9]{4}#)/i);
  if (codeMatch) {
    passcode = (codeMatch[1] || codeMatch[2]).trim();
  }

  const payMadeDate = r.K || '';
  const billedDate = r.L || '';
  
  let overdue = parseFloat(r.M || '0');
  if (isNaN(overdue)) overdue = 0;

  const payRemarks = r.N || '';
  const rating = r.O || (overdue > 200 ? 'Late payer' : overdue === 0 ? 'Good' : '');

  // Calculate monthly rate based on meals
  const mealCount = bf + ln + dn;
  let monthlyRate = 380;
  if (mealCount === 1) monthlyRate = ln ? 186 : (dn ? 150 : 130);
  else if (mealCount === 2) monthlyRate = 310;
  else if (mealCount === 3) monthlyRate = 380;

  insertCust.run(
    area, building, apt, name, '', status,
    bf, ln, dn, label, remarks, deliveryTime, passcode,
    payMadeDate, billedDate, overdue,
    payRemarks, rating, monthlyRate
  );
  customerCount++;
}
console.log('Successfully seeded', customerCount, 'customers.');

// 2. SEED DAILY LEDGER (Sheet 2)
console.log('Seeding Daily Ledger (Moms Accounts)...');
const s2 = parseWorksheet(2);
const insertLedger = db.prepare(`
  INSERT OR REPLACE INTO daily_ledger (
    date, day_name, bf_count, ln_count, dn_count,
    daily_total_charges, amount_paid, balance, remarks
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let ledgerCount = 0;
for (let i = 1; i < s2.length; i++) {
  const r = s2[i];
  const date = r.A;
  if (!date || !date.startsWith('2026-')) continue;
  
  const dayName = r.B || '';
  const bf = parseInt(r.C || '0', 10) || 0;
  const ln = parseInt(r.D || '0', 10) || 0;
  const dn = parseInt(r.E || '0', 10) || 0;
  
  // Calculate daily charges using exact mess pricing if not explicitly provided
  let charges = parseFloat(r.G || '0');
  if (isNaN(charges) || charges === 0) {
    charges = Math.round((bf * 3.27 + ln * 4.385 + dn * 4.27) * 1000) / 1000;
  }
  
  const paid = parseFloat(r.H || '0') || 0;
  const balance = parseFloat(r.I || '0') || 0;
  const remarks = r.J || (r.L ? (r.L + ': ' + (r.M || '')) : '');

  insertLedger.run(date, dayName, bf, ln, dn, charges, paid, balance, remarks);
  ledgerCount++;
}
console.log('Successfully seeded', ledgerCount, 'daily ledger records.');

// 3. SEED GROUP ACCOUNTS (Sheet 5 - Thahir Group)
console.log('Seeding Group Accounts (Sheet 5)...');
const s5 = parseWorksheet(5);

const insertGroup = db.prepare(`
  INSERT INTO group_accounts (
    group_name, coordinator_name, coordinator_phone, status,
    old_balance, total_charges, amount_paid, total_overdue, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMember = db.prepare(`
  INSERT INTO group_members (
    group_id, member_name, building, status,
    start_date, end_date, days_count, daily_rate, amount, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Insert Thahir September/October batch
const grp1Id = insertGroup.run(
  'Thahir Group (Sep - Oct 2026)',
  'Thahir',
  '+971 52 000 0000',
  'Active',
  71.0,
  2132.0,
  1300.0,
  903.0,
  'Paid 1300 in 4 installments (300, 300, 400, 300). Remaining overdue: 903 AED'
).lastInsertRowid;

// Member details from CSV
const thahirMembers = [
  { name: 'Thahir A', building: 'Star of Karama', start: '2026-09-18', end: '2026-10-06', days: 19, amt: 247 },
  { name: 'Thahir B', building: 'Dhe Fish', start: '2026-09-18', end: '2026-09-22', days: 5, amt: 65 },
  { name: 'Thahir C', building: 'Star of Karama', start: '2026-09-21', end: '2026-10-03', days: 13, amt: 169 },
  { name: 'Thahir D', building: 'Star of Karama', start: '2026-09-21', end: '2026-10-06', days: 16, amt: 208 },
  { name: 'Thahir E', building: 'Dhe Fish, 103', start: '2026-09-21', end: '2026-10-21', days: 31, amt: 403 },
  { name: 'Thahir F', building: 'Dhe Fish, 204', start: '2026-09-21', end: '2026-10-21', days: 31, amt: 403 },
  { name: 'Thahir G', building: 'Dhe Fish, 204', start: '2026-09-21', end: '2026-10-10', days: 20, amt: 260 },
  { name: 'Thahir H', building: 'Dhe Fish', start: '2026-09-26', end: '2026-10-01', days: 6, amt: 78 },
  { name: 'Thahir I', building: 'Dhe Fish', start: '2026-09-26', end: '2026-10-01', days: 6, amt: 78 },
  { name: 'Thahir J', building: 'Dhe Fish', start: '2026-09-28', end: '2026-10-06', days: 9, amt: 117 },
  { name: 'Thahir K', building: 'A9, 33', start: '2026-10-07', end: '2026-10-14', days: 8, amt: 104 }
];

for (const m of thahirMembers) {
  insertMember.run(grp1Id, m.name, m.building, 'Stopped', m.start, m.end, m.days, 13.0, m.amt, '');
}

// Insert Thahir July/August batch
const grp2Id = insertGroup.run(
  'Thahir Group (Jul - Aug 2026)',
  'Thahir',
  '+971 52 000 0000',
  'Settled',
  313.0,
  819.0,
  400.0,
  732.0,
  'July - August period'
).lastInsertRowid;

const thahirMembersJul = [
  { name: 'Thahir A', building: 'Al wasl G block', start: '2026-07-27', end: '2026-07-31', days: 5, amt: 65 },
  { name: 'Thahir B', building: 'Al wasl G block', start: '2026-07-27', end: '2026-07-31', days: 5, amt: 65 },
  { name: 'Thahir C', building: 'A3 Building', start: '2026-07-28', end: '2026-08-10', days: 14, amt: 182 },
  { name: 'Thahir D', building: 'Star of Karama 311', start: '2026-07-30', end: '2026-08-04', days: 6, amt: 78 },
  { name: 'Thahir E', building: 'A3 Building', start: '2026-08-01', end: '2026-08-10', days: 10, amt: 130 },
  { name: 'Thahir F', building: 'A3 Building', start: '2026-08-01', end: '2026-08-10', days: 10, amt: 130 },
  { name: 'Thahir AA', building: 'A3 Building', start: '2026-08-12', end: '2026-08-16', days: 5, amt: 65 },
  { name: 'Thahir BB', building: 'Dhe Fish', start: '2026-08-12', end: '2026-08-13', days: 2, amt: 26 },
  { name: 'Thahir CC', building: 'Dhe Fish', start: '2026-08-12', end: '2026-08-17', days: 6, amt: 78 }
];

for (const m of thahirMembersJul) {
  insertMember.run(grp2Id, m.name, m.building, 'Stopped', m.start, m.end, m.days, 13.0, m.amt, '');
}
console.log('Successfully seeded Group Accounts and members.');

// 4. SEED BAD DEBTS (Sheet 6)
console.log('Seeding Bad Debts & Pending Amounts (Sheet 6)...');
const s6 = parseWorksheet(6);

const insertBadDebt = db.prepare(`
  INSERT INTO bad_debts (customer_name, building_name, apartment, phone, meals, amount_due, notes, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const badDebtsList = [
  { name: 'Asif', building: 'Mas Express cargo', apt: 'Shop', meals: '2 Time (LN+DN)', due: 470, notes: '' },
  { name: 'Aneez', building: 'Kavery - 3rd Block', apt: '404', meals: 'Lunch & dinner', due: 380, notes: 'Deliver in the kitchen' },
  { name: 'Bazil', building: 'R Block Al Wasl', apt: '13', meals: '3 Time', due: 13, notes: '' },
  { name: 'Midhlaj', building: 'Old lootha building', apt: '203', meals: 'Lunch & Dinner', due: 210, notes: 'Deliver on top of refrigerator' },
  { name: 'Aleena', building: 'Al Wasl - R 404', apt: '102', meals: '3 Time', due: 40, notes: '' },
  { name: 'Nijam', building: 'Cool And Bright', apt: 'Shop', meals: '2 Time (Lunch Barik 12 Pm)', due: 30, notes: '' },
  { name: 'Joel', building: 'Rashid Mill', apt: '404', meals: '1 Time (Lunch CP)', due: 36, notes: '' },
  { name: 'Nowshad', building: 'Y 10 Building', apt: '304', meals: '3 Time', due: 388, notes: '' },
  { name: 'Shibili', building: 'Al Wasl -L Block', apt: '32', meals: '2 Time (Lunch & Dinner)', due: 10, notes: '' },
  { name: 'Pratheeksha Co Arathy', building: 'Al Khaja Building', apt: '405', meals: '3 Time', due: 70, notes: '' },
  { name: 'Sreekanth', building: 'Rashid Mill', apt: '404', meals: '3 Time', due: 36, notes: '' },
  { name: 'Arun', building: 'Al Attar - A Block', apt: '216', meals: '2 Time (Lunch and Dinner)', due: 70, notes: '' },
  { name: 'Rency', building: 'Lulu Electronics', apt: '303', meals: '2 breakfasts', due: 10, notes: '' },
  { name: 'Amal', building: 'Al Hilal -A Block', apt: '302', meals: '2 Time (No Beef, No Porota)', due: 10, notes: '' },
  { name: 'Swaliha', building: 'Al Hilal -A Block', apt: '302', meals: '2 Time (No Beef, No Porota)', due: 10, notes: '' },
  { name: 'Adarsh', building: 'L Block Al Wasl', apt: '23', meals: '3 Time (Chapathi set, No fish)', due: 13, notes: 'Delivery 5:30 AM' },
  { name: 'Adharsh', building: 'G 8 Building', apt: '304', meals: '2 Time Lunch and Dinner', due: 60, notes: '' },
  { name: 'Dilshad', building: 'G 8 Building', apt: '304', meals: '2 Time (Lunch 12 Pm)', due: 40, notes: '' },
  { name: 'Bibin', building: 'G 8 Building', apt: '203', meals: '2 Time (No Fish)', due: 10, notes: '' },
  { name: 'Pranav', building: 'Al Amani Building', apt: '308', meals: '3 Time', due: 50, notes: '' },
  { name: 'Sanjay', building: 'Rashid Mill', apt: '404', meals: '3 Time', due: 26, notes: '' },
  { name: 'Ashmi', building: 'Amanni Building', apt: '', meals: 'Running', due: 610, notes: '' }
];

for (const b of badDebtsList) {
  insertBadDebt.run(b.name, b.building, b.apt, '', b.meals, b.due, b.notes, 'Pending');
}
console.log('Successfully seeded', badDebtsList.length, 'bad debt records.');

// Quick verification query
const totalCust = db.prepare('SELECT count(*) as c, sum(total_overdue) as dues FROM customers').get();
const totalLedger = db.prepare('SELECT count(*) as c, sum(amount_paid) as collected FROM daily_ledger').get();
console.log('=== DATABASE READY ===');
console.log('Customers in DB:', totalCust.c, '| Total Overdue Dues:', totalCust.dues, 'AED');
console.log('Ledger Days in DB:', totalLedger.c, '| Total Collected This Year:', totalLedger.collected, 'AED');
