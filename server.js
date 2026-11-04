const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { DatabaseSync } = require('node:sqlite');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'mess.db');

// Ensure database exists
if (!fs.existsSync(DB_FILE)) {
  console.log('Database file not found, running seed script...');
  require('./seed_database.js');
}

const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// Helper to get local IPv4 addresses
function getLocalIps() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips;
}

// Request body parser
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 5e6) { // 5MB limit
        req.connection.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

// Response helpers
function json(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function error(res, message, status = 400) {
  json(res, { error: message, success: false }, status);
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Router
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // ==========================================
    // API ROUTES
    // ==========================================

    // 1. STATS / DASHBOARD OVERVIEW
    if (pathname === '/api/stats' && method === 'GET') {
      const todayStr = new Date().toISOString().split('T')[0];
      
      const activeCustomers = db.prepare(`SELECT count(*) as count FROM customers WHERE status IN ('Running', 'Trial', 'Under Notice')`).get().count;
      const trialCustomers = db.prepare(`SELECT count(*) as count FROM customers WHERE status = 'Trial'`).get().count;
      const underNotice = db.prepare(`SELECT count(*) as count FROM customers WHERE status = 'Under Notice'`).get().count;
      const cancelledCustomers = db.prepare(`SELECT count(*) as count FROM customers WHERE status = 'Cancelled'`).get().count;
      
      const duesData = db.prepare(`SELECT sum(total_overdue) as totalDues, count(*) as debtorsCount FROM customers WHERE total_overdue > 0`).get();
      const badDebtsData = db.prepare(`SELECT sum(amount_due) as totalBadDebts, count(*) as count FROM bad_debts WHERE status = 'Pending'`).get();

      // Meal counts for running/trial/notice
      const meals = db.prepare(`
        SELECT 
          sum(case when bf = 1 then 1 else 0 end) as bf_count,
          sum(case when ln = 1 then 1 else 0 end) as ln_count,
          sum(case when dn = 1 then 1 else 0 end) as dn_count
        FROM customers
        WHERE status IN ('Running', 'Trial', 'Under Notice')
      `).get();

      // Today's ledger or latest entry
      const latestLedger = db.prepare(`SELECT * FROM daily_ledger ORDER BY date DESC LIMIT 1`).get();
      
      const areaStats = db.prepare(`
        SELECT area, count(*) as count, sum(case when bf = 1 then 1 else 0 end) as bf, sum(case when ln = 1 then 1 else 0 end) as ln, sum(case when dn = 1 then 1 else 0 end) as dn, sum(total_overdue) as dues
        FROM customers
        WHERE status IN ('Running', 'Trial', 'Under Notice')
        GROUP BY area
      `).all();

      return json(res, {
        success: true,
        stats: {
          activeCustomers,
          trialCustomers,
          underNotice,
          cancelledCustomers,
          totalOverdue: duesData.totalDues || 0,
          debtorsCount: duesData.debtorsCount || 0,
          badDebtsTotal: badDebtsData.totalBadDebts || 0,
          badDebtsCount: badDebtsData.count || 0,
          todayMeals: {
            bf: meals.bf_count || 0,
            ln: meals.ln_count || 0,
            dn: meals.dn_count || 0,
            total: (meals.bf_count || 0) + (meals.ln_count || 0) + (meals.dn_count || 0)
          },
          latestLedger,
          areaStats,
          localIps: getLocalIps(),
          serverPort: PORT
        }
      });
    }

    // 2. CUSTOMERS LIST & FILTER
    if (pathname === '/api/customers' && method === 'GET') {
      const search = parsedUrl.searchParams.get('search') || '';
      const area = parsedUrl.searchParams.get('area') || '';
      const status = parsedUrl.searchParams.get('status') || '';
      const rating = parsedUrl.searchParams.get('rating') || '';
      const meal = parsedUrl.searchParams.get('meal') || '';
      const hasDues = parsedUrl.searchParams.get('hasDues') === 'true';

      let query = `SELECT * FROM customers WHERE 1=1`;
      const params = [];

      if (search) {
        query += ` AND (customer_name LIKE ? OR building_name LIKE ? OR apartment LIKE ? OR label LIKE ? OR remarks LIKE ? OR phone LIKE ?)`;
        const s = `%${search}%`;
        params.push(s, s, s, s, s, s);
      }

      if (area) {
        query += ` AND area = ?`;
        params.push(area);
      }

      if (status) {
        query += ` AND status = ?`;
        params.push(status);
      }

      if (rating) {
        query += ` AND payment_rating = ?`;
        params.push(rating);
      }

      if (hasDues) {
        query += ` AND total_overdue > 0`;
      }

      if (meal === '3') {
        query += ` AND bf = 1 AND ln = 1 AND dn = 1`;
      } else if (meal === '2') {
        query += ` AND ((bf = 1 AND ln = 1 AND dn = 0) OR (bf = 0 AND ln = 1 AND dn = 1) OR (bf = 1 AND ln = 0 AND dn = 1))`;
      } else if (meal === '1') {
        query += ` AND ((bf = 1 AND ln = 0 AND dn = 0) OR (bf = 0 AND ln = 1 AND dn = 0) OR (bf = 0 AND ln = 0 AND dn = 1))`;
      }

      query += ` ORDER BY area ASC, building_name ASC, apartment ASC, customer_name ASC`;

      const stmt = db.prepare(query);
      const rows = stmt.all(...params);

      // Areas list for filter dropdown
      const areas = db.prepare(`SELECT DISTINCT area FROM customers ORDER BY area ASC`).all().map(a => a.area);

      return json(res, { success: true, count: rows.length, customers: rows, areas });
    }

    // 3. CREATE CUSTOMER
    if (pathname === '/api/customers' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.customer_name || !body.area || !body.building_name) {
        return error(res, 'Name, Area, and Building are required');
      }

      const stmt = db.prepare(`
        INSERT INTO customers (
          area, building_name, apartment, customer_name, phone, status,
          bf, ln, dn, label, remarks, delivery_time, door_passcode,
          payment_made_up_to, billed_up_to, total_overdue,
          payment_remarks, payment_rating, monthly_rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        body.area,
        body.building_name,
        body.apartment || '',
        body.customer_name,
        body.phone || '',
        body.status || 'Running',
        body.bf ? 1 : 0,
        body.ln ? 1 : 0,
        body.dn ? 1 : 0,
        body.label || '',
        body.remarks || '',
        body.delivery_time || '',
        body.door_passcode || '',
        body.payment_made_up_to || '',
        body.billed_up_to || '',
        parseFloat(body.total_overdue) || 0,
        body.payment_remarks || '',
        body.payment_rating || '',
        parseFloat(body.monthly_rate) || 380
      );

      return json(res, { success: true, id: result.lastInsertRowid, message: 'Customer created successfully' }, 201);
    }

    // 4. GET / UPDATE / DELETE CUSTOMER BY ID
    const customerMatch = pathname.match(/^\/api\/customers\/([0-9]+)$/);
    if (customerMatch) {
      const custId = parseInt(customerMatch[1], 10);

      if (method === 'GET') {
        const cust = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(custId);
        if (!cust) return error(res, 'Customer not found', 404);
        const payments = db.prepare(`SELECT * FROM payments WHERE customer_id = ? ORDER BY date DESC`).all(custId);
        return json(res, { success: true, customer: cust, payments });
      }

      if (method === 'PUT') {
        const body = await parseBody(req);
        const stmt = db.prepare(`
          UPDATE customers SET
            area = ?, building_name = ?, apartment = ?, customer_name = ?, phone = ?, status = ?,
            bf = ?, ln = ?, dn = ?, label = ?, remarks = ?, delivery_time = ?, door_passcode = ?,
            payment_made_up_to = ?, billed_up_to = ?, total_overdue = ?,
            payment_remarks = ?, payment_rating = ?, monthly_rate = ?,
            updated_at = datetime('now')
          WHERE id = ?
        `);

        stmt.run(
          body.area,
          body.building_name,
          body.apartment || '',
          body.customer_name,
          body.phone || '',
          body.status || 'Running',
          body.bf ? 1 : 0,
          body.ln ? 1 : 0,
          body.dn ? 1 : 0,
          body.label || '',
          body.remarks || '',
          body.delivery_time || '',
          body.door_passcode || '',
          body.payment_made_up_to || '',
          body.billed_up_to || '',
          parseFloat(body.total_overdue) || 0,
          body.payment_remarks || '',
          body.payment_rating || '',
          parseFloat(body.monthly_rate) || 380,
          custId
        );

        return json(res, { success: true, message: 'Customer updated successfully' });
      }

      if (method === 'DELETE') {
        db.prepare(`DELETE FROM customers WHERE id = ?`).run(custId);
        return json(res, { success: true, message: 'Customer removed successfully' });
      }
    }

    // 5. QUICK STATUS UPDATE
    const statusMatch = pathname.match(/^\/api\/customers\/([0-9]+)\/status$/);
    if (statusMatch && method === 'POST') {
      const custId = parseInt(statusMatch[1], 10);
      const body = await parseBody(req);
      if (!body.status) return error(res, 'Status required');

      let query = `UPDATE customers SET status = ?`;
      const params = [body.status];

      if (body.remarks) {
        query += `, remarks = ?`;
        params.push(body.remarks);
      }
      query += `, updated_at = datetime('now') WHERE id = ?`;
      params.push(custId);

      db.prepare(query).run(...params);
      return json(res, { success: true, message: 'Status updated' });
    }

    // 6. LOG PAYMENT FOR CUSTOMER
    const paymentMatch = pathname.match(/^\/api\/customers\/([0-9]+)\/payment$/);
    if (paymentMatch && method === 'POST') {
      const custId = parseInt(paymentMatch[1], 10);
      const body = await parseBody(req);
      const amount = parseFloat(body.amount);
      if (!amount || isNaN(amount) || amount <= 0) {
        return error(res, 'Valid payment amount is required');
      }

      const cust = db.prepare(`SELECT * FROM customers WHERE id = ?`).get(custId);
      if (!cust) return error(res, 'Customer not found', 404);

      const payDate = body.date || new Date().toISOString().split('T')[0];
      const methodStr = body.payment_method || 'Cash';
      const remarks = body.remarks || '';

      // Insert payment record
      db.prepare(`
        INSERT INTO payments (customer_id, customer_name, date, amount, payment_method, period_start, period_end, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(custId, cust.customer_name, payDate, amount, methodStr, body.period_start || '', body.period_end || '', remarks);

      // Deduct from total overdue
      let newOverdue = Math.max(0, (cust.total_overdue || 0) - amount);
      let newRating = newOverdue === 0 ? 'Good' : (newOverdue > 200 ? 'Late payer' : cust.payment_rating);
      let newPaidDate = body.payment_made_up_to || cust.payment_made_up_to;

      db.prepare(`
        UPDATE customers SET
          total_overdue = ?,
          payment_rating = ?,
          payment_made_up_to = ?,
          payment_remarks = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(newOverdue, newRating, newPaidDate, remarks || cust.payment_remarks, custId);

      // Optionally record into today's ledger
      if (body.record_in_ledger) {
        const ledgerRow = db.prepare(`SELECT * FROM daily_ledger WHERE date = ?`).get(payDate);
        if (ledgerRow) {
          const newAmtPaid = (ledgerRow.amount_paid || 0) + amount;
          const newBal = (ledgerRow.balance || 0) - amount;
          db.prepare(`UPDATE daily_ledger SET amount_paid = ?, balance = ? WHERE date = ?`).run(newAmtPaid, newBal, payDate);
        }
      }

      return json(res, { success: true, message: 'Payment recorded', newOverdue, newPaidDate });
    }

    // 7. KITCHEN PREPARATION BOARD API
    if (pathname === '/api/kitchen' && method === 'GET') {
      const date = parsedUrl.searchParams.get('date') || new Date().toISOString().split('T')[0];
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });

      // Fetch all eligible active customers
      const customers = db.prepare(`
        SELECT * FROM customers
        WHERE status IN ('Running', 'Trial', 'Under Notice')
        ORDER BY area ASC, building_name ASC, apartment ASC
      `).all();

      // Counts
      let totalBF = 0;
      let totalLN = 0;
      let totalDN = 0;

      // Dietary counters
      let barikRiceCount = 0;
      let normalRiceCount = 0;
      let chapathiSetCount = 0;
      let handmadeChapathiCount = 0;
      let pureVegCount = 0;
      let noFishCount = 0;
      let noBeefCount = 0;
      let eggSubstituteCount = 0;
      let noPorottaCount = 0;

      const specialOrders = [];

      for (const c of customers) {
        // Sunday rules: check if customer note says "No food on all Sundays" or Sunday no food
        const combined = (c.label + ' ' + c.remarks).toLowerCase();
        const isSunday = dayOfWeek === 'Sunday';
        if (isSunday && (combined.includes('no food on sunday') || combined.includes('no food on all sunday') || combined.includes('saturday and sunday no food') || combined.includes('food not required on saturday and sunday'))) {
          continue;
        }

        if (c.bf === 1) totalBF++;
        if (c.ln === 1) totalLN++;
        if (c.dn === 1) totalDN++;

        let isSpecial = false;

        if (combined.includes('barik')) {
          barikRiceCount++;
          isSpecial = true;
        } else if (c.ln === 1) {
          normalRiceCount++;
        }

        if (combined.includes('chapati set') || combined.includes('chappathi set') || combined.includes('chapathi set') || combined.includes('chappathi only') || combined.includes('chapati only')) {
          chapathiSetCount++;
          isSpecial = true;
        }

        if (combined.includes('handmade') || combined.includes('hand made')) {
          handmadeChapathiCount++;
          isSpecial = true;
        }

        if (combined.includes('veg only') || combined.includes('pure veg') || combined.includes('veg food')) {
          pureVegCount++;
          isSpecial = true;
        }

        if (combined.includes('no fish')) {
          noFishCount++;
          isSpecial = true;
        }

        if (combined.includes('no beef')) {
          noBeefCount++;
          isSpecial = true;
        }

        if (combined.includes('egg') || combined.includes('omlet') || combined.includes('omelette')) {
          eggSubstituteCount++;
          isSpecial = true;
        }

        if (combined.includes('no porota') || combined.includes('no porotta')) {
          noPorottaCount++;
          isSpecial = true;
        }

        if (c.label || isSpecial) {
          specialOrders.push({
            id: c.id,
            name: c.customer_name,
            area: c.area,
            building: c.building_name,
            apartment: c.apartment,
            bf: c.bf,
            ln: c.ln,
            dn: c.dn,
            label: c.label,
            deliveryTime: c.delivery_time,
            remarks: c.remarks
          });
        }
      }

      return json(res, {
        success: true,
        date,
        dayOfWeek,
        headcounts: {
          totalCustomers: customers.length,
          breakfast: totalBF,
          lunch: totalLN,
          dinner: totalDN,
          grandTotal: totalBF + totalLN + totalDN
        },
        dietaryBreakdown: {
          barikRiceCount,
          normalRiceCount,
          chapathiSetCount,
          handmadeChapathiCount,
          pureVegCount,
          noFishCount,
          noBeefCount,
          eggSubstituteCount,
          noPorottaCount
        },
        specialOrders
      });
    }

    // 8. DELIVERY ROUTE & RUN SHEET API
    if (pathname === '/api/delivery' && method === 'GET') {
      const date = parsedUrl.searchParams.get('date') || new Date().toISOString().split('T')[0];
      const area = parsedUrl.searchParams.get('area') || '';
      const meal = parsedUrl.searchParams.get('meal') || 'all'; // all, BF, LN, DN

      let query = `
        SELECT * FROM customers
        WHERE status IN ('Running', 'Trial', 'Under Notice')
      `;
      const params = [];

      if (area) {
        query += ` AND area = ?`;
        params.push(area);
      }

      if (meal === 'BF') query += ` AND bf = 1`;
      else if (meal === 'LN') query += ` AND ln = 1`;
      else if (meal === 'DN') query += ` AND dn = 1`;

      query += ` ORDER BY area ASC, building_name ASC, apartment ASC`;
      const customers = db.prepare(query).all(...params);

      // Check delivery logs for today
      const logs = db.prepare(`SELECT * FROM delivery_logs WHERE date = ?`).all(date);
      const logMap = {};
      for (const l of logs) {
        logMap[`${l.customer_id}_${l.meal_type}`] = l;
      }

      // Group by building
      const groupedByBuilding = {};
      for (const c of customers) {
        const b = c.building_name || 'Unassigned Building';
        if (!groupedByBuilding[b]) {
          groupedByBuilding[b] = {
            buildingName: b,
            area: c.area,
            stops: []
          };
        }

        const bfLog = logMap[`${c.id}_BF`];
        const lnLog = logMap[`${c.id}_LN`];
        const dnLog = logMap[`${c.id}_DN`];

        groupedByBuilding[b].stops.push({
          id: c.id,
          name: c.customer_name,
          apartment: c.apartment,
          phone: c.phone,
          deliveryTime: c.delivery_time || 'Regular',
          passcode: c.door_passcode,
          label: c.label,
          remarks: c.remarks,
          bf: c.bf,
          ln: c.ln,
          dn: c.dn,
          status_bf: bfLog ? bfLog.status : 'pending',
          status_ln: lnLog ? lnLog.status : 'pending',
          status_dn: dnLog ? dnLog.status : 'pending'
        });
      }

      return json(res, {
        success: true,
        date,
        totalStops: customers.length,
        buildings: Object.values(groupedByBuilding)
      });
    }

    // 9. MARK DELIVERY STATUS
    if (pathname === '/api/delivery/mark' && method === 'POST') {
      const body = await parseBody(req);
      const { date, customer_id, meal_type, status } = body;
      if (!customer_id || !meal_type) return error(res, 'customer_id and meal_type required');

      const logDate = date || new Date().toISOString().split('T')[0];
      const validStatus = status || 'delivered';

      const existing = db.prepare(`SELECT * FROM delivery_logs WHERE date = ? AND customer_id = ? AND meal_type = ?`).get(logDate, customer_id, meal_type);
      if (existing) {
        db.prepare(`UPDATE delivery_logs SET status = ?, delivered_at = datetime('now') WHERE id = ?`).run(validStatus, existing.id);
      } else {
        db.prepare(`
          INSERT INTO delivery_logs (date, customer_id, meal_type, status, delivered_at)
          VALUES (?, ?, ?, ?, datetime('now'))
        `).run(logDate, customer_id, meal_type, validStatus);
      }

      return json(res, { success: true, status: validStatus });
    }

    // 10. BILLING & OVERDUE LIST
    if (pathname === '/api/billing' && method === 'GET') {
      const minOverdue = parseFloat(parsedUrl.searchParams.get('minOverdue')) || 0;
      const rating = parsedUrl.searchParams.get('rating') || '';

      let query = `SELECT * FROM customers WHERE total_overdue >= ?`;
      const params = [minOverdue];

      if (rating) {
        query += ` AND payment_rating = ?`;
        params.push(rating);
      }

      query += ` ORDER BY total_overdue DESC, customer_name ASC`;
      const debtors = db.prepare(query).all(...params);
      const totalOverdueSum = db.prepare(`SELECT sum(total_overdue) as sum FROM customers`).get().sum || 0;

      return json(res, { success: true, count: debtors.length, totalOverdueSum, customers: debtors });
    }

    // 11. PRO-RATA DAYS CALCULATOR
    if (pathname === '/api/calculator' && method === 'POST') {
      const body = await parseBody(req);
      const { start_date, end_date, times_of_food, deduction_amount, custom_daily_rate } = body;

      if (!start_date || !end_date) {
        return error(res, 'Start Date and End Date are required');
      }

      const d1 = new Date(start_date);
      const d2 = new Date(end_date);
      const diffTime = d2.getTime() - d1.getTime();
      const numberOfDays = Math.max(1, Math.round(diffTime / (1000 * 3600 * 24)) + 1); // inclusive days

      const times = parseInt(times_of_food, 10) || 3;
      let dailyRate = 13.0; // standard 3 times rate

      if (custom_daily_rate) {
        dailyRate = parseFloat(custom_daily_rate);
      } else {
        if (times === 1) dailyRate = 6.2;       // 186 AED / 30
        else if (times === 2) dailyRate = 10.0; // 300-310 AED / 30
        else if (times === 3) dailyRate = 13.0; // 380-390 AED / 30
      }

      let baseCharges = Math.round(numberOfDays * dailyRate);
      const deduction = parseFloat(deduction_amount) || 0;
      const finalCharges = Math.max(0, baseCharges - deduction);

      return json(res, {
        success: true,
        calculation: {
          startDate: start_date,
          endDate: end_date,
          numberOfDays,
          timesOfFood: times,
          dailyRate,
          baseCharges,
          deductionAmount: deduction,
          finalCharges
        }
      });
    }

    // 12. DAILY LEDGER (Moms Accounts)
    if (pathname === '/api/ledger' && method === 'GET') {
      const month = parsedUrl.searchParams.get('month') || ''; // '2026-10' or empty for all
      let query = `SELECT * FROM daily_ledger`;
      const params = [];

      if (month) {
        query += ` WHERE date LIKE ?`;
        params.push(`${month}%`);
      }
      query += ` ORDER BY date DESC`;

      const rows = db.prepare(query).all(...params);

      // Financial totals for the period
      let totalCharges = 0;
      let totalPaid = 0;
      for (const r of rows) {
        totalCharges += (r.daily_total_charges || 0);
        totalPaid += (r.amount_paid || 0);
      }

      const availableMonths = db.prepare(`SELECT DISTINCT substr(date, 1, 7) as month FROM daily_ledger ORDER BY month DESC`).all().map(m => m.month);

      return json(res, {
        success: true,
        count: rows.length,
        ledger: rows,
        summary: {
          totalCharges: Math.round(totalCharges * 100) / 100,
          totalPaid: Math.round(totalPaid * 100) / 100,
          netDifference: Math.round((totalCharges - totalPaid) * 100) / 100
        },
        availableMonths
      });
    }

    if (pathname === '/api/ledger' && method === 'POST') {
      const body = await parseBody(req);
      const { date, bf_count, ln_count, dn_count, amount_paid, remarks } = body;
      if (!date) return error(res, 'Date is required');

      const d = new Date(date);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
      const bf = parseInt(bf_count, 10) || 0;
      const ln = parseInt(ln_count, 10) || 0;
      const dn = parseInt(dn_count, 10) || 0;
      const paid = parseFloat(amount_paid) || 0;

      // Authentic Mess formula: BF*3.27 + LN*4.385 + DN*4.27
      const charges = Math.round((bf * 3.27 + ln * 4.385 + dn * 4.27) * 1000) / 1000;

      // Calculate running balance based on previous day
      const prev = db.prepare(`SELECT balance FROM daily_ledger WHERE date < ? ORDER BY date DESC LIMIT 1`).get(date);
      const prevBal = prev ? (prev.balance || 0) : 0;
      const balance = Math.round((prevBal + charges - paid) * 1000) / 1000;

      db.prepare(`
        INSERT INTO daily_ledger (date, day_name, bf_count, ln_count, dn_count, daily_total_charges, amount_paid, balance, remarks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
          day_name = excluded.day_name,
          bf_count = excluded.bf_count,
          ln_count = excluded.ln_count,
          dn_count = excluded.dn_count,
          daily_total_charges = excluded.daily_total_charges,
          amount_paid = excluded.amount_paid,
          balance = excluded.balance,
          remarks = excluded.remarks
      `).run(date, dayName, bf, ln, dn, charges, paid, balance, remarks || '');

      return json(res, { success: true, message: 'Ledger entry saved', date, charges, balance });
    }

    // 13. GROUP ACCOUNTS (Thahir Group)
    if (pathname === '/api/groups' && method === 'GET') {
      const groups = db.prepare(`SELECT * FROM group_accounts ORDER BY id DESC`).all();
      const fullGroups = [];
      for (const g of groups) {
        const members = db.prepare(`SELECT * FROM group_members WHERE group_id = ? ORDER BY id ASC`).all(g.id);
        fullGroups.push({ ...g, members });
      }
      return json(res, { success: true, groups: fullGroups });
    }

    if (pathname === '/api/groups' && method === 'POST') {
      const body = await parseBody(req);
      const stmt = db.prepare(`
        INSERT INTO group_accounts (group_name, coordinator_name, coordinator_phone, status, old_balance, total_charges, amount_paid, total_overdue, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        body.group_name,
        body.coordinator_name || '',
        body.coordinator_phone || '',
        body.status || 'Active',
        parseFloat(body.old_balance) || 0,
        parseFloat(body.total_charges) || 0,
        parseFloat(body.amount_paid) || 0,
        parseFloat(body.total_overdue) || 0,
        body.notes || ''
      );
      return json(res, { success: true, id: result.lastInsertRowid });
    }

    const groupMatch = pathname.match(/^\/api\/groups\/([0-9]+)$/);
    if (groupMatch && method === 'GET') {
      const grpId = parseInt(groupMatch[1], 10);
      const grp = db.prepare(`SELECT * FROM group_accounts WHERE id = ?`).get(grpId);
      if (!grp) return error(res, 'Group not found', 404);
      const members = db.prepare(`SELECT * FROM group_members WHERE group_id = ? ORDER BY id ASC`).all(grpId);
      return json(res, { success: true, group: grp, members });
    }

    const groupMemberMatch = pathname.match(/^\/api\/groups\/([0-9]+)\/members$/);
    if (groupMemberMatch && method === 'POST') {
      const grpId = parseInt(groupMemberMatch[1], 10);
      const body = await parseBody(req);
      const rate = parseFloat(body.daily_rate) || 13.0;
      const days = parseInt(body.days_count, 10) || 0;
      const amt = parseFloat(body.amount) || (days * rate);

      db.prepare(`
        INSERT INTO group_members (group_id, member_name, building, status, start_date, end_date, days_count, daily_rate, amount, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(grpId, body.member_name, body.building || '', body.status || 'Stopped', body.start_date || '', body.end_date || '', days, rate, amt, body.notes || '');

      // Recalculate group totals
      const sum = db.prepare(`SELECT sum(amount) as total FROM group_members WHERE group_id = ?`).get(grpId).total || 0;
      const grp = db.prepare(`SELECT * FROM group_accounts WHERE id = ?`).get(grpId);
      const grandTotal = sum + (grp.old_balance || 0);
      const overdue = Math.max(0, grandTotal - (grp.amount_paid || 0));

      db.prepare(`UPDATE group_accounts SET total_charges = ?, total_overdue = ? WHERE id = ?`).run(sum, overdue, grpId);

      return json(res, { success: true, message: 'Member added to group' });
    }

    const groupPaymentMatch = pathname.match(/^\/api\/groups\/([0-9]+)\/payment$/);
    if (groupPaymentMatch && method === 'POST') {
      const grpId = parseInt(groupPaymentMatch[1], 10);
      const body = await parseBody(req);
      const payAmt = parseFloat(body.amount) || 0;
      const grp = db.prepare(`SELECT * FROM group_accounts WHERE id = ?`).get(grpId);
      if (!grp) return error(res, 'Group not found', 404);

      const newPaid = (grp.amount_paid || 0) + payAmt;
      const grandTotal = (grp.total_charges || 0) + (grp.old_balance || 0);
      const newOverdue = Math.max(0, grandTotal - newPaid);
      const notes = (grp.notes ? grp.notes + '; ' : '') + `Paid ${payAmt} AED on ${new Date().toISOString().split('T')[0]}`;

      db.prepare(`UPDATE group_accounts SET amount_paid = ?, total_overdue = ?, notes = ? WHERE id = ?`).run(newPaid, newOverdue, notes, grpId);
      return json(res, { success: true, message: 'Payment recorded for group', newPaid, newOverdue });
    }

    // 14. BAD DEBTS REGISTER
    if (pathname === '/api/bad-debts' && method === 'GET') {
      const rows = db.prepare(`SELECT * FROM bad_debts ORDER BY amount_due DESC`).all();
      const totalDue = db.prepare(`SELECT sum(amount_due) as total FROM bad_debts WHERE status = 'Pending'`).get().total || 0;
      return json(res, { success: true, count: rows.length, totalDue, badDebts: rows });
    }

    if (pathname === '/api/bad-debts' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.customer_name || !body.amount_due) return error(res, 'Customer name and amount are required');
      const stmt = db.prepare(`
        INSERT INTO bad_debts (customer_name, building_name, apartment, phone, meals, amount_due, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(body.customer_name, body.building_name || '', body.apartment || '', body.phone || '', body.meals || '', parseFloat(body.amount_due) || 0, body.notes || '', body.status || 'Pending');
      return json(res, { success: true, message: 'Bad debt recorded' });
    }

    const badDebtItemMatch = pathname.match(/^\/api\/bad-debts\/([0-9]+)$/);
    if (badDebtItemMatch && method === 'PUT') {
      const id = parseInt(badDebtItemMatch[1], 10);
      const body = await parseBody(req);
      db.prepare(`
        UPDATE bad_debts SET
          customer_name = ?, building_name = ?, apartment = ?, phone = ?, meals = ?, amount_due = ?, notes = ?, status = ?
        WHERE id = ?
      `).run(body.customer_name, body.building_name || '', body.apartment || '', body.phone || '', body.meals || '', parseFloat(body.amount_due) || 0, body.notes || '', body.status || 'Pending', id);
      return json(res, { success: true, message: 'Bad debt record updated' });
    }

    // 15. CSV EXPORTS
    if (pathname === '/api/export/customers' && method === 'GET') {
      const rows = db.prepare(`SELECT * FROM customers ORDER BY area, building_name, apartment`).all();
      let csv = 'ID,Area,Building Name,Apartment,Customer Name,Phone,Status,BF,LN,DN,Delivery Time,Passcode,Label,Remarks,Payment Made Up To,Billed Up To,Total Overdue,Payment Remarks,Rating,Monthly Rate\n';
      for (const r of rows) {
        csv += [
          r.id,
          `"${(r.area || '').replace(/"/g, '""')}"`,
          `"${(r.building_name || '').replace(/"/g, '""')}"`,
          `"${(r.apartment || '').replace(/"/g, '""')}"`,
          `"${(r.customer_name || '').replace(/"/g, '""')}"`,
          `"${(r.phone || '').replace(/"/g, '""')}"`,
          r.status,
          r.bf,
          r.ln,
          r.dn,
          `"${(r.delivery_time || '').replace(/"/g, '""')}"`,
          `"${(r.door_passcode || '').replace(/"/g, '""')}"`,
          `"${(r.label || '').replace(/"/g, '""')}"`,
          `"${(r.remarks || '').replace(/"/g, '""')}"`,
          r.payment_made_up_to,
          r.billed_up_to,
          r.total_overdue,
          `"${(r.payment_remarks || '').replace(/"/g, '""')}"`,
          r.payment_rating,
          r.monthly_rate
        ].join(',') + '\n';
      }
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Karama_Mess_Customers.csv"'
      });
      return res.end(csv);
    }

    if (pathname === '/api/export/ledger' && method === 'GET') {
      const rows = db.prepare(`SELECT * FROM daily_ledger ORDER BY date DESC`).all();
      let csv = 'Date,Day,BF Count,LN Count,DN Count,Daily Total Charges,Amount Paid,Balance,Remarks\n';
      for (const r of rows) {
        csv += [
          r.date,
          r.day_name,
          r.bf_count,
          r.ln_count,
          r.dn_count,
          r.daily_total_charges,
          r.amount_paid,
          r.balance,
          `"${(r.remarks || '').replace(/"/g, '""')}"`
        ].join(',') + '\n';
      }
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="Karama_Mess_Daily_Ledger.csv"'
      });
      return res.end(csv);
    }

    // ==========================================
    // STATIC FILE SERVING
    // ==========================================
    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
    
    // Normalize path to prevent directory traversal
    if (!filePath.startsWith(path.join(__dirname, 'public'))) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    // If file doesn't exist, serve index.html for SPA client-side routing
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(__dirname, 'public', 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);

  } catch (err) {
    console.error('Server error:', err);
    error(res, 'Internal Server Error: ' + err.message, 500);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🥘 KARAMA MESS MANAGEMENT SYSTEM RUNNING`);
  console.log(`------------------------------------------------------`);
  console.log(`💻 Local Admin Access:   http://localhost:${PORT}`);
  const ips = getLocalIps();
  ips.forEach(ip => {
    console.log(`📱 Mobile/Staff Access:  http://${ip}:${PORT}`);
  });
  console.log(`======================================================\n`);
});
