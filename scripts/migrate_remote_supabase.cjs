const fs = require('fs');
const path = require('path');

const token = process.env.SUPABASE_ACCESS_TOKEN || '';
const ref = 'bbqrieuujxazhqgelppr';

async function migrate() {
  const sqlPath = path.join(__dirname, '../supabase/migrations/20261025000000_karama_mess_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log('Running migration on Supabase project:', ref);
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql, read_only: false })
  });

  const result = await res.json();
  if (!res.ok) {
    console.error('Migration failed:', result);
  } else {
    console.log('Migration successfully applied!', result);
  }
}

migrate().catch(console.error);
