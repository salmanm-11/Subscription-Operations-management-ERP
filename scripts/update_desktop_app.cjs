const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const asar = require('@electron/asar');

const TARGET_APP_DIR = 'C:\\Users\\user\\AppData\\Local\\Programs\\Karama Mess Management Software';
const TARGET_ASAR = path.join(TARGET_APP_DIR, 'resources', 'app.asar');
const TARGET_EXE = path.join(TARGET_APP_DIR, 'Karama Mess Management Software.exe');
const STAGING_DIR = path.join(__dirname, '..', '.temp_asar_pack');

async function updateDesktopApp() {
  console.log('1. Checking installed app directory...');
  if (!fs.existsSync(TARGET_APP_DIR)) {
    throw new Error('Target installed app directory not found: ' + TARGET_APP_DIR);
  }

  console.log('2. Preparing staging directory: ' + STAGING_DIR);
  if (fs.existsSync(STAGING_DIR)) {
    fs.rmSync(STAGING_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(STAGING_DIR, { recursive: true });

  // Copy dist
  console.log('3. Copying dist/ to staging...');
  fs.cpSync(path.join(__dirname, '..', 'dist'), path.join(STAGING_DIR, 'dist'), { recursive: true });

  // Copy electron
  console.log('4. Copying electron/ to staging...');
  fs.cpSync(path.join(__dirname, '..', 'electron'), path.join(STAGING_DIR, 'electron'), { recursive: true });

  // Copy package.json
  console.log('5. Copying package.json to staging...');
  fs.copyFileSync(path.join(__dirname, '..', 'package.json'), path.join(STAGING_DIR, 'package.json'));

  // Close running instance to release any file locks
  console.log('6. Terminating running Karama Mess app processes if any...');
  try {
    execSync('powershell -ExecutionPolicy Bypass -Command "Stop-Process -Name \'Karama Mess Management Software\' -Force -ErrorAction SilentlyContinue"');
    console.log('   Running app closed.');
  } catch (err) {
    console.log('   No running app process.');
  }

  // Brief pause to allow OS file handles to release
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Backup existing app.asar if not already backed up
  const backupAsar = path.join(TARGET_APP_DIR, 'resources', 'app.asar.bak');
  if (fs.existsSync(TARGET_ASAR) && !fs.existsSync(backupAsar)) {
    fs.copyFileSync(TARGET_ASAR, backupAsar);
    console.log('   Backed up existing app.asar to app.asar.bak');
  }

  console.log('7. Packing new app.asar with updated code...');
  await asar.createPackage(STAGING_DIR, TARGET_ASAR);
  console.log('   New app.asar created successfully!');

  // Clean staging
  fs.rmSync(STAGING_DIR, { recursive: true, force: true });

  // Update .exe icon with rcedit
  const rceditPath = 'C:\\Users\\user\\AppData\\Local\\electron-builder\\Cache\\winCodeSign\\994091383\\rcedit-x64.exe';
  const iconIcoPath = path.join(__dirname, '..', 'build', 'icon.ico');
  if (fs.existsSync(rceditPath) && fs.existsSync(iconIcoPath) && fs.existsSync(TARGET_EXE)) {
    console.log('   Setting executable icon via rcedit...');
    try {
      execSync(`"${rceditPath}" "${TARGET_EXE}" --set-icon "${iconIcoPath}"`);
      console.log('   Executable icon set successfully!');
    } catch (e) {
      console.warn('   Could not set exe icon:', e.message);
    }
  }

  // Relaunch the desktop app
  console.log('8. Relaunching Karama Mess Management Software...');
  try {
    execSync(`powershell -ExecutionPolicy Bypass -Command "Start-Process '${TARGET_EXE}'"`);
    console.log('   App launched successfully!');
  } catch (err) {
    console.error('   Could not auto-relaunch app:', err.message);
  }

  console.log('\n--- UPDATE COMPLETE ---');
}

updateDesktopApp().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
