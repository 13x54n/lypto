import sharp from 'sharp';
import path from 'path';

async function createBackgroundImage() {
  const destPath = path.join(process.cwd(), 'assets', 'pass.pass');

  console.log('Creating background image for visual pass...');

  // Create a beautiful card background with gradient
  // For generic passes, we use thumbnail which appears as a large background
  
  // 1x: 90x120 pixels (thumbnail for generic - max size)
  const svg1x = `
    <svg width="90" height="120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="90" height="120" fill="url(#cardGrad)" />
      <rect width="90" height="2" y="0" fill="url(#accentGrad)" />
      <circle cx="70" cy="90" r="30" fill="rgba(85, 239, 196, 0.1)" />
      <circle cx="15" cy="20" r="20" fill="rgba(85, 239, 196, 0.05)" />
    </svg>
  `;

  // 2x: 180x240 pixels
  const svg2x = `
    <svg width="180" height="240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="180" height="240" fill="url(#cardGrad2)" />
      <rect width="180" height="4" y="0" fill="url(#accentGrad2)" />
      <circle cx="140" cy="180" r="60" fill="rgba(85, 239, 196, 0.1)" />
      <circle cx="30" cy="40" r="40" fill="rgba(85, 239, 196, 0.05)" />
    </svg>
  `;

  // 3x: 270x360 pixels
  const svg3x = `
    <svg width="270" height="360" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="270" height="360" fill="url(#cardGrad3)" />
      <rect width="270" height="6" y="0" fill="url(#accentGrad3)" />
      <circle cx="210" cy="270" r="90" fill="rgba(85, 239, 196, 0.1)" />
      <circle cx="45" cy="60" r="60" fill="rgba(85, 239, 196, 0.05)" />
    </svg>
  `;

  await sharp(Buffer.from(svg1x))
    .png()
    .toFile(path.join(destPath, 'thumbnail.png'));
  console.log('✅ Created thumbnail.png (90x120)');

  await sharp(Buffer.from(svg2x))
    .png()
    .toFile(path.join(destPath, 'thumbnail@2x.png'));
  console.log('✅ Created thumbnail@2x.png (180x240)');

  await sharp(Buffer.from(svg3x))
    .png()
    .toFile(path.join(destPath, 'thumbnail@3x.png'));
  console.log('✅ Created thumbnail@3x.png (270x360)');

  console.log('\n🎉 Background images created successfully!');
  console.log('Your pass will now have a beautiful visual card appearance.');
}

createBackgroundImage().catch(console.error);

