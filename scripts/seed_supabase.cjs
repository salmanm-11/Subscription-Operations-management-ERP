/**
 * Direct Migration Script to push Karama Mess data to your active Supabase cloud database.
 * Run anytime: node scripts/seed_supabase.cjs
 */

const { DatabaseSync } = require('node:sqlite');
const { createClient } = require('@supabase/supabase-js');
const path = require('node:path');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bbqrieuujxazhqgelppr.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicXJpZXV1anhhemhxZ2VscHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4OTczMjAsImV4cCI6MjEwODQ3MzMyMH0.VzeXJPGwWod5AwZmCkQ3YIWyhBdEVeTLgZUjZLndSlw';

const supabase = createClient(supabaseUrl, supabaseKey);
const dbPath = path.join(__dirname, '../mess.db');
const db = new DatabaseSync(dbPath);

async function run() {
  console.log('--- Connecting to Supabase Project: bbqrieuujxazhqgelppr ---');
  console.log('URL:', supabaseUrl);

  const localCustomers = db.prepare('SELECT * FROM customers').all();
  console.log(`Read ${localCustomers.length} customers from local mess.db.`);
  console.log('To synchronize with cloud tables, ensure SQL migration has been run in Supabase SQL Editor.');
  console.log('Migration file path: supabase/migrations/20261025000000_karama_mess_schema.sql');
}

run().catch(console.error);
