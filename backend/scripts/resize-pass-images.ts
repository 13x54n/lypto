import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function resizePassImages() {
  const sourceIcon = path.join(process.cwd(), '..', 'mobile', 'assets', 'images', 'icon.png');
  const destPath = path.join(process.cwd(), 'assets', 'pass.pass');

  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found:', sourceIcon);
    return;
  }

  console.log('Resizing images for Apple Wallet pass...');

  // Create icons (square)
  await sharp(sourceIcon)
    .resize(29, 29, { fit: 'cover' })
    .toFile(path.join(destPath, 'icon.png'));
  console.log('✅ Created icon.png (29x29)');

  await sharp(sourceIcon)
    .resize(58, 58, { fit: 'cover' })
    .toFile(path.join(destPath, 'icon@2x.png'));
  console.log('✅ Created icon@2x.png (58x58)');

  await sharp(sourceIcon)
    .resize(87, 87, { fit: 'cover' })
    .toFile(path.join(destPath, 'icon@3x.png'));
  console.log('✅ Created icon@3x.png (87x87)');

  // Create logos (wide, preserving aspect ratio but constraining width)
  await sharp(sourceIcon)
    .resize(160, 50, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(destPath, 'logo.png'));
  console.log('✅ Created logo.png (160x50)');

  await sharp(sourceIcon)
    .resize(320, 100, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(destPath, 'logo@2x.png'));
  console.log('✅ Created logo@2x.png (320x100)');

  await sharp(sourceIcon)
    .resize(480, 150, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(path.join(destPath, 'logo@3x.png'));
  console.log('✅ Created logo@3x.png (480x150)');

  console.log('\n🎉 All images resized successfully!');
  console.log('Your Apple Wallet pass assets are ready at:', destPath);
}

resizePassImages().catch(console.error);

