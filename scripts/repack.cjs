const asar = require('@electron/asar');
const fs = require('fs');
const path = require('path');

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const stage = path.resolve(root, 'temp_stage_asar');

  if (fs.existsSync(stage)) {
    fs.rmSync(stage, { recursive: true, force: true });
  }
  fs.mkdirSync(stage, { recursive: true });

  console.log('Staging app files...');
  copyDirRecursive(path.join(root, 'dist'), path.join(stage, 'dist'));
  copyDirRecursive(path.join(root, 'electron'), path.join(stage, 'electron'));
  fs.copyFileSync(path.join(root, 'package.json'), path.join(stage, 'package.json'));

  const dest = path.resolve(root, 'release/win-unpacked/resources/app.asar');
  const installedDest = 'C:\\Users\\user\\AppData\\Local\\Programs\\Karama Mess Management Software\\resources\\app.asar';

  console.log('Packing app.asar from staging folder...');
  await asar.createPackage(stage, dest);
  console.log('✓ release/win-unpacked/resources/app.asar updated successfully');

  try {
    if (fs.existsSync(path.dirname(installedDest))) {
      fs.copyFileSync(dest, installedDest);
      console.log('✓ Installed application app.asar updated at:', installedDest);
    }
  } catch (err) {
    console.log('Note: Installed directory in AppData is managed via installer or outside sandbox:', err.message);
  }

  // Cleanup staging folder
  fs.rmSync(stage, { recursive: true, force: true });
  console.log('✓ Done!');
}

main().catch(err => {
  console.error('Packaging error:', err);
  process.exit(1);
});
