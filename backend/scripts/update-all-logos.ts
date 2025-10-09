import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function updateAllLogos() {
  const sourceLogo = path.join(process.cwd(), 'assets', 'pass.pass', 'zypto.png');
  
  if (!fs.existsSync(sourceLogo)) {
    console.error('zypto.png not found!');
    return;
  }

  console.log('📦 Updating all assets with new Zypto logo...\n');

  // 1. APPLE WALLET PASS ASSETS
  console.log('🍎 Creating Apple Wallet pass assets...');
  const passPath = path.join(process.cwd(), 'assets', 'pass.pass');
  
  // Icons (square)
  await sharp(sourceLogo).resize(29, 29).toFile(path.join(passPath, 'icon.png'));
  console.log('  ✅ icon.png (29x29)');
  await sharp(sourceLogo).resize(58, 58).toFile(path.join(passPath, 'icon@2x.png'));
  console.log('  ✅ icon@2x.png (58x58)');
  await sharp(sourceLogo).resize(87, 87).toFile(path.join(passPath, 'icon@3x.png'));
  console.log('  ✅ icon@3x.png (87x87)');

  // Logos (wide - constraining width, preserving aspect)
  await sharp(sourceLogo).resize(160, 50, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(passPath, 'logo.png'));
  console.log('  ✅ logo.png (160x50)');
  await sharp(sourceLogo).resize(320, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(passPath, 'logo@2x.png'));
  console.log('  ✅ logo@2x.png (320x100)');
  await sharp(sourceLogo).resize(480, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toFile(path.join(passPath, 'logo@3x.png'));
  console.log('  ✅ logo@3x.png (480x150)');

  // Thumbnail (small square on left side)
  await sharp(sourceLogo).resize(90, 120, { fit: 'cover' }).toFile(path.join(passPath, 'thumbnail.png'));
  console.log('  ✅ thumbnail.png (90x120)');
  await sharp(sourceLogo).resize(180, 240, { fit: 'cover' }).toFile(path.join(passPath, 'thumbnail@2x.png'));
  console.log('  ✅ thumbnail@2x.png (180x240)');
  await sharp(sourceLogo).resize(270, 360, { fit: 'cover' }).toFile(path.join(passPath, 'thumbnail@3x.png'));
  console.log('  ✅ thumbnail@3x.png (270x360)');

  // 2. MOBILE APP ASSETS
  console.log('\n📱 Creating mobile app assets...');
  const mobilePath = path.join(process.cwd(), '..', 'mobile', 'assets', 'images');
  
  // App icon (1024x1024 for iOS App Store)
  await sharp(sourceLogo).resize(1024, 1024).toFile(path.join(mobilePath, 'icon.png'));
  console.log('  ✅ icon.png (1024x1024)');
  
  // Favicon
  await sharp(sourceLogo).resize(48, 48).toFile(path.join(mobilePath, 'favicon.png'));
  console.log('  ✅ favicon.png (48x48)');
  
  // Splash screen icon (larger for splash)
  await sharp(sourceLogo).resize(512, 512).toFile(path.join(mobilePath, 'splash-icon.png'));
  console.log('  ✅ splash-icon.png (512x512)');

  // Android adaptive icons
  await sharp(sourceLogo).resize(1024, 1024).toFile(path.join(mobilePath, 'android-icon-foreground.png'));
  console.log('  ✅ android-icon-foreground.png (1024x1024)');
  await sharp(sourceLogo).resize(432, 432).toFile(path.join(mobilePath, 'android-icon-monochrome.png'));
  console.log('  ✅ android-icon-monochrome.png (432x432)');
  
  // Create solid color background for Android adaptive icon (transparent)
  await sharp({
    create: {
      width: 1024,
      height: 1024,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
  .png()
  .toFile(path.join(mobilePath, 'android-icon-background.png'));
  console.log('  ✅ android-icon-background.png (1024x1024 transparent)');

  // 3. WEB ASSETS (Next.js)
  console.log('\n🌐 Creating web assets...');
  const webPublicPath = path.join(process.cwd(), '..', 'public');
  
  // App icon (various sizes for Next.js)
  const appPath = path.join(process.cwd(), '..', 'app');
  await sharp(sourceLogo).resize(180, 180).toFile(path.join(appPath, 'favicon.ico'));
  console.log('  ✅ favicon.ico (180x180)');
  
  // PWA icons
  await sharp(sourceLogo).resize(192, 192).toFile(path.join(webPublicPath, 'icon-192.png'));
  console.log('  ✅ icon-192.png (192x192)');
  await sharp(sourceLogo).resize(512, 512).toFile(path.join(webPublicPath, 'icon-512.png'));
  console.log('  ✅ icon-512.png (512x512)');

  // 4. Create variations for different uses
  console.log('\n✨ Creating logo variations...');
  
  // Small logo (for headers, etc)
  await sharp(sourceLogo).resize(120, 120).toFile(path.join(passPath, 'zypto-small.png'));
  console.log('  ✅ zypto-small.png (120x120)');
  
  // Medium logo (general use)
  await sharp(sourceLogo).resize(256, 256).toFile(path.join(passPath, 'zypto-medium.png'));
  console.log('  ✅ zypto-medium.png (256x256)');

  console.log('\n🎉 All assets updated successfully!');
  console.log('📍 Updated locations:');
  console.log('  - Apple Wallet: backend/assets/pass.pass/');
  console.log('  - Mobile App: mobile/assets/images/');
  console.log('  - Web: public/ and app/');
}

updateAllLogos().catch(console.error);

