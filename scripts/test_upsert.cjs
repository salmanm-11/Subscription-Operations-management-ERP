const { createClient } = require('@supabase/supabase-js');
const client = createClient(
  'https://bbqrieuujxazhqgelppr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicXJpZXV1anhhemhxZ2VscHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4OTczMjAsImV4cCI6MjEwODQ3MzMyMH0.VzeXJPGwWod5AwZmCkQ3YIWyhBdEVeTLgZUjZLndSlw'
);

async function testUpsert() {
  const { data: cust, error: fetchErr } = await client.from('customers').select('*').limit(1).single();
  if (fetchErr) {
    console.error('Fetch err:', fetchErr);
    return;
  }
  console.log('Original customer:', cust.full_name, 'status:', cust.status);

  const payload = {
    ...cust,
    status: 'cancelling_soon',
    notes: '[NOTICE: Cancelling on 2026-11-04] test notice'
  };

  const res = await client.from('customers').upsert(payload).select();
  console.log('Upsert res error:', res.error);
  console.log('Upserted record status:', res.data ? res.data[0].status : null);

  // Restore original
  await client.from('customers').upsert(cust);
  console.log('Restored original customer status.');
}

testUpsert();
