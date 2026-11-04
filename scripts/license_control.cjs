/**
 * Karama Mess Management - Remote License & Kill Switch Controller
 * 
 * Allows the developer to remotely lock/suspend or unlock the software
 * instantly across all desktop and web instances via cloud database.
 * 
 * Usage:
 *   node scripts/license_control.cjs status
 *   node scripts/license_control.cjs lock "Pending monthly license payment"
 *   node scripts/license_control.cjs unlock
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env file
function getEnvConfig() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env file not found at', envPath);
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const urlMatch = content.match(/VITE_SUPABASE_URL=(.*)/);
  const keyMatch = content.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

  const url = (urlMatch ? urlMatch[1] : process.env.VITE_SUPABASE_URL || '').trim();
  const key = (keyMatch ? keyMatch[1] : process.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (!url || !key) {
    console.error('Error: Supabase URL or Anon Key missing in .env file.');
    process.exit(1);
  }

  return { url, key };
}

async function main() {
  const args = process.argv.slice(2);
  const action = (args[0] || 'status').toLowerCase();
  const reasonArg = args.slice(1).join(' ').trim() || 'Payment overdue. Please contact the developer to reactivate license.';

  const { url, key } = getEnvConfig();
  const supabase = createClient(url, key);

  console.log('----------------------------------------------------');
  console.log('  Karama Mess - Remote License Kill Switch Controller');
  console.log('----------------------------------------------------');
  console.log(`Cloud Endpoint: ${url}`);

  // Fetch current business record
  const { data: business, error: fetchErr } = await supabase
    .from('businesses')
    .select('id, name, trade_license_no, updated_at')
    .limit(1)
    .single();

  if (fetchErr || !business) {
    console.error('❌ Failed to fetch business license from Supabase:', fetchErr?.message || 'No record found');
    process.exit(1);
  }

  const currentTrade = business.trade_license_no || '';
  const isCurrentlyLocked = currentTrade.toUpperCase().startsWith('SUSPENDED') || currentTrade.toUpperCase().startsWith('LOCKED');

  if (action === 'status') {
    console.log(`Business Name:      ${business.name}`);
    console.log(`Current License No: ${currentTrade}`);
    console.log(`Status:             ${isCurrentlyLocked ? '🔒 SUSPENDED / LOCKED' : '✅ ACTIVE / RUNNING'}`);
    if (isCurrentlyLocked) {
      console.log(`Lock Reason:        ${currentTrade.replace(/^(SUSPENDED|LOCKED):?\s*/i, '')}`);
    }
    console.log('----------------------------------------------------');
    return;
  }

  if (action === 'lock') {
    const lockString = `SUSPENDED: ${reasonArg}`;
    console.log(`\n⏳ Remotely suspending license...`);
    console.log(`Lock Reason: "${reasonArg}"`);

    const { error: updateErr } = await supabase
      .from('businesses')
      .update({ trade_license_no: lockString, updated_at: new Date().toISOString() })
      .eq('id', business.id);

    if (updateErr) {
      console.error('❌ Failed to lock software:', updateErr.message);
      process.exit(1);
    }

    console.log('🔒 Software SUCCESSFULLY LOCKED across all devices & website!');
    console.log('Any user opening the application will see the "License Suspended" screen.');
    console.log('Master Developer credentials ("developer" / "Dev@Karama#2026") can still bypass.');
    console.log('----------------------------------------------------');
    return;
  }

  if (action === 'unlock') {
    const defaultLicense = 'DXB-MESS-2026-889';
    console.log(`\n⏳ Restoring software license to ACTIVE status...`);

    const { error: updateErr } = await supabase
      .from('businesses')
      .update({ trade_license_no: defaultLicense, updated_at: new Date().toISOString() })
      .eq('id', business.id);

    if (updateErr) {
      console.error('❌ Failed to unlock software:', updateErr.message);
      process.exit(1);
    }

    console.log('✅ Software license SUCCESSFULLY REACTIVATED & UNLOCKED!');
    console.log('All users can now access the system normally.');
    console.log('----------------------------------------------------');
    return;
  }

  console.log(`Unknown action: "${action}". Valid commands: status, lock <reason>, unlock`);
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
