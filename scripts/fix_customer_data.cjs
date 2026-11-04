const fs = require('fs');
const path = require('path');

const dataPath = path.resolve(__dirname, '../src/api/fullInitialData.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(raw);

function cleanCustomerNotes(notes) {
  if (!notes) return '';
  // Remove leading numbers and pipes
  let s = notes.replace(/^(\d+\s*\|\s*)+/g, '');
  const parts = s.split(/\s*\|\s*/);
  const uniqueParts = [];
  for (const p of parts) {
    const trimmed = p.trim();
    if (!trimmed || trimmed === '0' || trimmed === '1' || trimmed === '-1' || /^\d{4}-\d{2}-\d{2}$/.test(trimmed)) continue;
    if (!uniqueParts.some(u => u.toLowerCase() === trimmed.toLowerCase())) {
      uniqueParts.push(trimmed);
    }
  }
  return uniqueParts.length > 0 ? uniqueParts.join(' • ') : notes;
}

console.log('Original customer count:', data.customers.length);

// 1. Remove invalid numeric customer names
data.customers = data.customers.filter(c => !/^\d+$/.test(c.full_name?.trim() || ''));

// 2. Fix Neethu specifically
const neethu = data.customers.find(c => c.id === 'c-401' || c.full_name?.toLowerCase() === 'neethu');
if (neethu) {
  console.log('Fixing Neethu record...');
  neethu.total_overdue = 0;
  neethu.payment_rating = 'Good';
  neethu.status = 'left';
  neethu.has_breakfast = false;
  neethu.has_lunch = true;
  neethu.has_dinner = false;
  neethu.meal_plan_id = 'mp-1-time';
  neethu.dietary_preferences = 'Lunch only (Started 3 Aug, Cancelled 9 Aug 2026)';
  neethu.notes = 'Lunch only, Start from 3rd Aug 2026 ✅ Cancelling on 9 August 2026 ❌ (Settled in full)';
}

// 3. Clean notes and dietary_preferences across all customers
data.customers.forEach(c => {
  // If notes contain raw pipe dumps
  if (c.notes && (c.notes.includes('|') || c.notes.startsWith('1 |') || c.notes.startsWith('0 |'))) {
    c.notes = cleanCustomerNotes(c.notes);
  }
  if (c.dietary_preferences && (c.dietary_preferences.includes('|') || c.dietary_preferences.startsWith('1 |'))) {
    c.dietary_preferences = cleanCustomerNotes(c.dietary_preferences);
  }

  // Ensure no suspicious overdue amounts that look like years (e.g. 2026)
  if (c.total_overdue >= 2000 && c.total_overdue <= 2030 && c.status === 'left') {
    c.total_overdue = 0;
    c.payment_rating = 'Good';
  }
});

// Update data version
data.version = 'karama_full_dataset_v5';

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('✓ Successfully updated src/api/fullInitialData.json. New customer count:', data.customers.length);
