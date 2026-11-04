const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const env = fs.readFileSync(envPath, 'utf8');
const url = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

const dataPath = path.join(__dirname, '..', 'src', 'api', 'fullInitialData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

async function seed() {
  const seen = new Map();
  const buildings = [];
  for (const b of data.buildings) {
    let name = b.name.trim();
    const key = name.toLowerCase();
    if (seen.has(key)) {
      const count = seen.get(key) + 1;
      seen.set(key, count);
      const cleanArea = (b.area || '').replace(/^[^\w\s]+/, '').trim();
      name = cleanArea ? `${name} - ${cleanArea}` : `${name} (${count})`;
    } else {
      seen.set(key, 1);
    }
    buildings.push({
      id: b.id,
      business_id: 'b0000000-0000-0000-0000-000000000001',
      name: name,
      area: (b.area || 'Burjman & Mankhool').replace(/^[^\w\s]+/, '').trim(),
      address: b.address || `${name}, Karama, Dubai`,
      total_floors: b.total_floors || 1,
      created_at: b.created_at || '2026-01-01T00:00:00Z'
    });
  }

  console.log(`Seeding ${buildings.length} buildings...`);
  await supabase.from('buildings').delete().neq('id', 'placeholder-none');

  for (let i = 0; i < buildings.length; i += 50) {
    const chunk = buildings.slice(i, i + 50);
    const { error } = await supabase.from('buildings').insert(chunk);
    if (error) {
      console.error(`Chunk ${i} error:`, error);
      return;
    }
  }

  const { count } = await supabase.from('buildings').select('*', { count: 'exact', head: true });
  console.log(`Successfully seeded. Total buildings in Supabase: ${count}`);
}

seed();
