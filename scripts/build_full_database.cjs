const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

// Robust CSV Line Parser handling quotes and newlines within quotes
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // ignore CR
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  return rows;
}

const BUSINESS_ID = 'b0000000-0000-0000-0000-000000000001';

function cleanAmount(val) {
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
}

function run() {
  console.log('=== Building Complete Karama Mess Database ===');

  const part1Text = fs.readFileSync(path.join(__dirname, '../data/part1.csv'), 'utf8');
  const part2Text = fs.readFileSync(path.join(__dirname, '../data/part2.csv'), 'utf8');
  const part3Text = fs.readFileSync(path.join(__dirname, '../data/part3.csv'), 'utf8');

  const part1Rows = parseCSV(part1Text);
  const part2Rows = parseCSV(part2Text);
  const part3Rows = parseCSV(part3Text);

  const buildingsMap = new Map();
  const customers = [];
  const invoices = [];
  const payments = [];
  const ledgerRecords = [];
  const corporateAccounts = [];

  let custSeq = 100;
  let invSeq = 1000;
  let paySeq = 2000;

  function getBuildingId(name, area) {
    if (!name) name = 'Karama General';
    const cleanName = name.replace(/^["'\s]+|["'\s]+$/g, '').trim();
    const cleanArea = (area || 'Karama Central').replace(/^["'\s]+|["'\s]+$/g, '').trim();
    const key = `${cleanName}__${cleanArea}`.toLowerCase();
    
    if (!buildingsMap.has(key)) {
      const bldId = `bld-${buildingsMap.size + 1}`;
      buildingsMap.set(key, {
        id: bldId,
        business_id: BUSINESS_ID,
        name: cleanName,
        area: cleanArea,
        address: `${cleanName}, ${cleanArea}, Dubai`,
        total_floors: 5,
        created_at: '2026-01-01T00:00:00Z'
      });
    }
    return buildingsMap.get(key);
  }

  // --- 1. Parse Active / Running Customers (Part 1) ---
  console.log(`Parsing active customers (Part 1)... Total raw rows: ${part1Rows.length}`);
  
  for (let i = 1; i < part1Rows.length; i++) {
    const row = part1Rows[i];
    if (row.length < 5 || !row[3] || row[0] === 'TOTAL') continue;

    const area = row[0] || 'Karama Central';
    const buildingName = row[1] || 'General Building';
    const apt = row[2] || '';
    const name = row[3];
    const rawStatus = row[4];
    const bf = Boolean(row[5] && row[5].trim().length > 0);
    const ln = Boolean(row[6] && row[6].trim().length > 0);
    const dn = Boolean(row[7] && row[7].trim().length > 0);
    const label = row[8] || '';
    const remarks = row[9] || '';
    const paidUpTo = row[10] || '';
    const billedUpTo = row[11] || '';
    const overdue = cleanAmount(row[12]);
    const payRemarks = row[13] || '';
    const ratingRaw = row[14] || '';

    let status = 'active';
    if (rawStatus && rawStatus.toLowerCase().includes('notice')) status = 'paused';
    if (rawStatus && rawStatus.toLowerCase().includes('trial')) status = 'active';
    if (rawStatus && (rawStatus.toLowerCase().includes('cancelled') || rawStatus.toLowerCase().includes('stopped'))) status = 'left';

    let rating = 'Good';
    if (ratingRaw.toLowerCase().includes('bad')) rating = 'Bad';
    else if (ratingRaw.toLowerCase().includes('late') || overdue > 0) rating = 'Late payer';

    // Calculate monthly rate based on meals
    const mealCount = (bf ? 1 : 0) + (ln ? 1 : 0) + (dn ? 1 : 0);
    let monthlyRate = 380.00;
    let mealPlanId = 'mp-3-times';
    if (mealCount === 2) {
      if (bf && dn) {
        monthlyRate = 300.00;
        mealPlanId = 'mp-2-times-bd';
      } else {
        monthlyRate = 310.00;
        mealPlanId = 'mp-2-times-ld';
      }
    } else if (mealCount === 1) {
      if (ln) {
        monthlyRate = 186.00;
        mealPlanId = 'mp-1-time-lunch';
      } else if (dn) {
        monthlyRate = 150.00;
        mealPlanId = 'mp-1-time-dinner';
      } else {
        monthlyRate = 120.00;
        mealPlanId = 'mp-1-time-bf';
      }
    }

    const bldObj = getBuildingId(buildingName, area);
    const custId = `c-${++custSeq}`;
    const custCode = `CUST-${String(custSeq).padStart(3, '0')}`;

    // Combine dietary notes
    const dietaryNotes = [label, remarks].filter(Boolean).join(' | ').trim() || 'Standard Menu';

    const customer = {
      id: custId,
      business_id: BUSINESS_ID,
      customer_code: custCode,
      full_name: name,
      phone: `+971 50 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.ae`,
      building_id: bldObj.id,
      building_name_cache: bldObj.name,
      apartment_cache: apt,
      meal_plan_id: mealPlanId,
      has_breakfast: bf,
      has_lunch: ln,
      has_dinner: dn,
      monthly_rate: monthlyRate,
      dietary_preferences: dietaryNotes,
      joining_date: paidUpTo || '2026-09-01',
      billing_start_date: paidUpTo || '2026-10-01',
      billing_end_date: billedUpTo || '2026-10-31',
      status: status,
      payment_rating: rating,
      total_overdue: overdue,
      notes: payRemarks || remarks || 'Active customer',
      created_at: '2026-09-01T00:00:00Z',
      updated_at: '2026-10-25T00:00:00Z'
    };

    customers.push(customer);

    // If overdue, generate invoice record
    if (overdue > 0) {
      const invId = `inv-${++invSeq}`;
      invoices.push({
        id: invId,
        business_id: BUSINESS_ID,
        invoice_number: `INV-2026-${invSeq}`,
        customer_id: custId,
        issue_date: '2026-10-01',
        due_date: '2026-10-15',
        period_start: '2026-10-01',
        period_end: '2026-10-31',
        subtotal: overdue,
        discount_amount: 0.00,
        tax_amount: 0.00,
        total_amount: overdue,
        amount_paid: 0.00,
        balance_due: overdue,
        paid_amount: 0.00,
        balance_amount: overdue,
        status: 'overdue',
        notes: payRemarks ? `Payment remark: ${payRemarks}` : 'Monthly mess dues',
        customer_name_cache: name,
        building_cache: bldObj.name,
        created_at: '2026-10-01T00:00:00Z',
        updated_at: '2026-10-25T00:00:00Z',
        items: [
          {
            id: `item-${invId}-1`,
            invoice_id: invId,
            business_id: BUSINESS_ID,
            description: `Mess subscription dues - ${customer.dietary_preferences.slice(0, 40)}`,
            quantity: 1,
            unit_price: overdue,
            amount: overdue
          }
        ]
      });
    }
  }

  console.log(`Parsed ${customers.length} active/notice customers. Generated ${invoices.length} overdue invoices.`);

  // --- 2. Parse Historical & Cancelled Customers from Part 3 ---
  console.log(`Parsing historical/cancelled customers (Part 3)... Total raw rows: ${part3Rows.length}`);
  
  for (let i = 0; i < part3Rows.length; i++) {
    const row = part3Rows[i];
    if (row.length < 3) continue;

    // Check if it's the customer table in part 3: Area/Building, Apt, Name, Status, BF, LN, DN, ...
    if (row[0] && row[0].includes('Name,Building,Status')) continue;
    if (row[0] && row[0].includes('Starting Date')) continue;

    let bldName = row[0] || '';
    let apt = row[1] || '';
    let name = row[2] || '';
    let area = 'Karama Central';

    // Check if row[0] has emoji or zone
    if (bldName.includes('Burjman') || bldName.includes('Mankhool')) area = '🟠 Burjman & Mankhool';
    else if (bldName.includes('Park') || bldName.includes('Pioneer') || bldName.includes('ADCB')) area = '🟡 Park, Pioneer & ADCB';
    else if (bldName.includes('Pyramid') || bldName.includes('Center')) area = '🟢 Karama Center - Pyramid';
    else if (bldName.includes('Hamdan') || bldName.includes('Post')) area = '🟣 Hamdan Colony & Post';

    // Sometimes row[0] is Area and row[1] is Building Name
    if (row.length >= 5 && (row[0].includes('🟠') || row[0].includes('🟡') || row[0].includes('🟢') || row[0].includes('🟣'))) {
      area = row[0];
      bldName = row[1];
      apt = row[2];
      name = row[3];
    }

    if (!name || name === 'Customer Name' || name === 'TOTAL' || name === 'Name') continue;

    // Avoid duplicate names if already parsed
    if (customers.some(c => c.full_name.toLowerCase() === name.toLowerCase())) {
      continue;
    }

    const bldObj = getBuildingId(bldName, area);
    const custId = `c-${++custSeq}`;
    const custCode = `CUST-${String(custSeq).padStart(3, '0')}`;

    // Read meals or dues
    const notes = row.slice(4).filter(Boolean).join(' | ').trim();
    const overdue = cleanAmount(row[row.length - 2] || row[row.length - 1]);

    const customer = {
      id: custId,
      business_id: BUSINESS_ID,
      customer_code: custCode,
      full_name: name,
      phone: `+971 50 ${Math.floor(1000000 + Math.random() * 9000000)}`,
      email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.ae`,
      building_id: bldObj.id,
      building_name_cache: bldObj.name,
      apartment_cache: apt,
      meal_plan_id: 'mp-3-times',
      has_breakfast: true,
      has_lunch: true,
      has_dinner: true,
      monthly_rate: 380.00,
      dietary_preferences: notes || 'Historical / Left',
      joining_date: '2026-07-01',
      billing_start_date: '2026-07-01',
      billing_end_date: '2026-08-31',
      status: 'left',
      payment_rating: overdue > 0 ? 'Late payer' : 'Good',
      total_overdue: overdue,
      notes: notes || 'Account closed / Cancelled',
      created_at: '2026-07-01T00:00:00Z',
      updated_at: '2026-08-31T00:00:00Z'
    };

    customers.push(customer);

    if (overdue > 0) {
      const invId = `inv-${++invSeq}`;
      invoices.push({
        id: invId,
        business_id: BUSINESS_ID,
        invoice_number: `INV-2026-${invSeq}`,
        customer_id: custId,
        issue_date: '2026-08-01',
        due_date: '2026-08-15',
        period_start: '2026-08-01',
        period_end: '2026-08-31',
        subtotal: overdue,
        discount_amount: 0.00,
        tax_amount: 0.00,
        total_amount: overdue,
        amount_paid: 0.00,
        balance_due: overdue,
        paid_amount: 0.00,
        balance_amount: overdue,
        status: 'overdue',
        notes: `Pending settlement: ${notes.slice(0, 50)}`,
        customer_name_cache: name,
        building_cache: bldObj.name,
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-31T00:00:00Z',
        items: [
          {
            id: `item-${invId}-1`,
            invoice_id: invId,
            business_id: BUSINESS_ID,
            description: `Settlement balance - ${bldObj.name}`,
            quantity: 1,
            unit_price: overdue,
            amount: overdue
          }
        ]
      });
    }
  }

  // --- 3. Parse Thahir Corporate Group Accounts ---
  console.log('Parsing Thahir Corporate Accounts...');
  const thahirAccounts = [
    { name: 'Thahir A', building: 'Star of Karama', start: '2026-09-18', end: '2026-10-06', days: 19, amount: 247.00 },
    { name: 'Thahir B', building: 'Dhe Fish', start: '2026-09-18', end: '2026-09-22', days: 5, amount: 65.00 },
    { name: 'Thahir C', building: 'Star of Karama', start: '2026-09-21', end: '2026-10-03', days: 13, amount: 169.00 },
    { name: 'Thahir D', building: 'Star of Karama', start: '2026-09-21', end: '2026-10-06', days: 16, amount: 208.00 },
    { name: 'Thahir E', building: 'Dhe Fish, 103', start: '2026-09-21', end: '2026-10-21', days: 31, amount: 403.00 },
    { name: 'Thahir F', building: 'Dhe Fish, 204', start: '2026-09-21', end: '2026-10-21', days: 31, amount: 403.00 },
    { name: 'Thahir G', building: 'Dhe Fish, 204', start: '2026-09-21', end: '2026-10-10', days: 20, amount: 260.00 },
    { name: 'Thahir H', building: 'Dhe Fish', start: '2026-09-26', end: '2026-10-01', days: 6, amount: 78.00 },
    { name: 'Thahir I', building: 'Dhe Fish', start: '2026-09-26', end: '2026-10-01', days: 6, amount: 78.00 },
    { name: 'Thahir J', building: 'Dhe Fish', start: '2026-09-28', end: '2026-10-06', days: 9, amount: 117.00 },
    { name: 'Thahir K', building: 'A9, 33', start: '2026-10-07', end: '2026-10-14', days: 8, amount: 104.00 }
  ];

  const thahirBld = getBuildingId('Star of Karama', '🟢 Karama Center - Pyramid');
  const thahirCustId = `c-thahir-corp`;
  customers.push({
    id: thahirCustId,
    business_id: BUSINESS_ID,
    customer_code: 'CORP-THAHIR',
    full_name: 'Thahir Group Corporate Account',
    phone: '+971 50 999 8877',
    email: 'thahir.corp@karamamess.ae',
    building_id: thahirBld.id,
    building_name_cache: 'Star of Karama / Dhe Fish',
    apartment_cache: 'Multiple',
    meal_plan_id: 'mp-3-times',
    has_breakfast: true,
    has_lunch: true,
    has_dinner: true,
    monthly_rate: 2203.00,
    dietary_preferences: 'Corporate Group Catering (11 staff members: Thahir A - K)',
    joining_date: '2026-09-18',
    billing_start_date: '2026-09-18',
    billing_end_date: '2026-10-21',
    status: 'active',
    payment_rating: 'Late payer',
    total_overdue: 903.00,
    notes: 'Total: AED 2,203 | Paid: AED 1,300 (4 installments) | Overdue Balance: AED 903',
    created_at: '2026-09-18T00:00:00Z',
    updated_at: '2026-10-25T00:00:00Z'
  });

  invoices.push({
    id: `inv-${++invSeq}`,
    business_id: BUSINESS_ID,
    invoice_number: `INV-2026-${invSeq}`,
    customer_id: thahirCustId,
    issue_date: '2026-10-06',
    due_date: '2026-10-20',
    period_start: '2026-09-18',
    period_end: '2026-10-21',
    subtotal: 2203.00,
    discount_amount: 0.00,
    tax_amount: 0.00,
    total_amount: 2203.00,
    amount_paid: 1300.00,
    balance_due: 903.00,
    paid_amount: 1300.00,
    balance_amount: 903.00,
    status: 'partially_paid',
    notes: 'Thahir Corporate account: 11 staff catering. AED 1,300 paid in 4 parts. Overdue AED 903.',
    customer_name_cache: 'Thahir Group Corporate Account',
    building_cache: 'Star of Karama / Dhe Fish',
    created_at: '2026-10-06T00:00:00Z',
    updated_at: '2026-10-25T00:00:00Z',
    items: thahirAccounts.map((t, idx) => ({
      id: `item-thahir-${idx + 1}`,
      invoice_id: `inv-${invSeq}`,
      business_id: BUSINESS_ID,
      description: `${t.name} (${t.building}) - ${t.days} days @ AED 13/day`,
      quantity: t.days,
      unit_price: 13.00,
      amount: t.amount
    }))
  });

  // Add payments for Thahir (4 payments: 300, 300, 400, 300)
  [300, 300, 400, 300].forEach((amt, idx) => {
    payments.push({
      id: `pay-${++paySeq}`,
      business_id: BUSINESS_ID,
      invoice_id: `inv-${invSeq}`,
      customer_id: thahirCustId,
      payment_number: `REC-2026-${paySeq}`,
      amount: amt,
      payment_date: `2026-10-${10 + idx * 3}`,
      payment_method: 'cash',
      reference_number: `THAHIR-PART-${idx + 1}`,
      notes: `Installment ${idx + 1} of AED ${amt} received for Thahir group`,
      created_at: `2026-10-${10 + idx * 3}T10:00:00Z`
    });
  });

  // --- 4. Parse Daily Ledger (Part 2) ---
  console.log(`Parsing 365 daily ledger records (Part 2)... Total rows: ${part2Rows.length}`);
  
  for (let i = 1; i < part2Rows.length; i++) {
    const row = part2Rows[i];
    if (row.length < 5 || !row[0] || !row[0].startsWith('2026-')) continue;

    const date = row[0];
    const day = row[1];
    const bf = cleanAmount(row[2]);
    const ln = cleanAmount(row[3]);
    const dn = cleanAmount(row[4]);
    const charges = cleanAmount(row[6]);
    const paid = cleanAmount(row[7]);
    const balance = cleanAmount(row[8]);
    const remarks = row[9] || '';

    ledgerRecords.push({
      date,
      day,
      bf_count: bf,
      ln_count: ln,
      dn_count: dn,
      total_meals: bf + ln + dn,
      charges,
      amount_paid: paid,
      balance,
      remarks
    });

    if (paid > 0) {
      payments.push({
        id: `pay-ledger-${date}`,
        business_id: BUSINESS_ID,
        invoice_id: invoices[0] ? invoices[0].id : '',
        customer_id: customers[0] ? customers[0].id : '',
        payment_number: `REC-LEDGER-${date}`,
        amount: paid,
        payment_date: date,
        payment_method: 'cash',
        reference_number: `DAILY-COLLECTION-${date}`,
        notes: `Daily collection on ${date} (${day}): AED ${paid.toFixed(2)}`,
        created_at: `${date}T18:00:00Z`
      });
    }
  }

  console.log(`Parsed ${ledgerRecords.length} daily ledger records.`);

  const buildingsArray = Array.from(buildingsMap.values());
  console.log(`Total Buildings mapped: ${buildingsArray.length}`);
  console.log(`Total Customers mapped: ${customers.length}`);
  console.log(`Total Invoices mapped: ${invoices.length}`);
  console.log(`Total Payments mapped: ${payments.length}`);

  // Summary statistics
  const activeCustomers = customers.filter(c => c.status === 'active');
  const totalOverdue = invoices.reduce((acc, inv) => acc + (inv.balance_due || 0), 0);
  console.log(`Active Customers: ${activeCustomers.length}`);
  console.log(`Total Overdue in system: AED ${totalOverdue.toFixed(2)}`);

  // Write structured JSON
  const outputData = {
    buildings: buildingsArray,
    customers,
    invoices,
    payments,
    ledger: ledgerRecords,
    summary: {
      total_customers: customers.length,
      active_customers: activeCustomers.length,
      inactive_customers: customers.length - activeCustomers.length,
      total_overdue: Math.round(totalOverdue * 100) / 100,
      total_buildings: buildingsArray.length,
      ledger_days: ledgerRecords.length
    }
  };

  fs.writeFileSync(path.join(__dirname, '../src/api/fullInitialData.json'), JSON.stringify(outputData, null, 2), 'utf8');
  console.log('Saved src/api/fullInitialData.json successfully!');

  // Sync to SQLite mess.db
  const dbPath = path.join(__dirname, '../mess.db');
  const db = new DatabaseSync(dbPath);
  console.log('Syncing data to SQLite mess.db...');

  // Update customers in SQLite
  db.exec('DROP TABLE IF EXISTS customers_v2;');
  db.exec(`
    CREATE TABLE customers_v2 (
      id TEXT PRIMARY KEY,
      code TEXT,
      name TEXT,
      phone TEXT,
      building TEXT,
      apartment TEXT,
      area TEXT,
      meal_plan TEXT,
      bf INTEGER,
      ln INTEGER,
      dn INTEGER,
      monthly_rate REAL,
      dietary_notes TEXT,
      status TEXT,
      payment_rating TEXT,
      total_overdue REAL,
      notes TEXT
    );
  `);

  const insertCust = db.prepare(`
    INSERT INTO customers_v2 (id, code, name, phone, building, apartment, area, meal_plan, bf, ln, dn, monthly_rate, dietary_notes, status, payment_rating, total_overdue, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  for (const c of customers) {
    const bld = buildingsArray.find(b => b.id === c.building_id);
    insertCust.run(
      c.id,
      c.customer_code,
      c.full_name,
      c.phone,
      c.building_name_cache,
      c.apartment_cache,
      bld ? bld.area : 'Karama',
      c.meal_plan_id,
      c.has_breakfast ? 1 : 0,
      c.has_lunch ? 1 : 0,
      c.has_dinner ? 1 : 0,
      c.monthly_rate,
      c.dietary_preferences,
      c.status,
      c.payment_rating,
      c.total_overdue,
      c.notes
    );
  }

  // Update daily ledger in SQLite
  db.exec('DROP TABLE IF EXISTS daily_ledger_v2;');
  db.exec(`
    CREATE TABLE daily_ledger_v2 (
      date TEXT PRIMARY KEY,
      day TEXT,
      bf INTEGER,
      ln INTEGER,
      dn INTEGER,
      charges REAL,
      amount_paid REAL,
      balance REAL,
      remarks TEXT
    );
  `);

  const insertLedger = db.prepare(`
    INSERT INTO daily_ledger_v2 (date, day, bf, ln, dn, charges, amount_paid, balance, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  for (const l of ledgerRecords) {
    insertLedger.run(l.date, l.day, l.bf_count, l.ln_count, l.dn_count, l.charges, l.amount_paid, l.balance, l.remarks);
  }

  console.log('SQLite mess.db synced successfully!');
  console.log('=== Complete Data Build Finished ===');
}

run();
