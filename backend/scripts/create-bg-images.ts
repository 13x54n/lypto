import sharp from 'sharp';
import path from 'path';

async function createBackgroundImages() {
  const destPath = path.join(process.cwd(), 'assets', 'pass.pass');

  console.log('Creating background images for visual pass...');

  // Background images for generic passes: max 180x220 pixels
  
  // 1x: 180x220 pixels
  const svg1x = `
    <svg width="180" height="220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:0.9" />
        </linearGradient>
      </defs>
      <rect width="180" height="220" fill="url(#cardGrad)" />
      <rect width="180" height="3" y="0" fill="url(#accentGrad)" />
      <circle cx="140" cy="170" r="50" fill="rgba(85, 239, 196, 0.1)" />
      <circle cx="30" cy="40" r="35" fill="rgba(85, 239, 196, 0.06)" />
    </svg>
  `;

  // 2x: 360x440 pixels
  const svg2x = `
    <svg width="360" height="440" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:0.9" />
        </linearGradient>
      </defs>
      <rect width="360" height="440" fill="url(#cardGrad2)" />
      <rect width="360" height="6" y="0" fill="url(#accentGrad2)" />
      <circle cx="280" cy="340" r="100" fill="rgba(85, 239, 196, 0.1)" />
      <circle cx="60" cy="80" r="70" fill="rgba(85, 239, 196, 0.06)" />
    </svg>
  `;

  // 3x: 540x660 pixels
  const svg3x = `
    <svg width="540" height="660" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#000000;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#1a1a1a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accentGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:0.9" />
        </linearGradient>
      </defs>
      <rect width="540" height="660" fill="url(#cardGrad3)" />
      <rect width="540" height="9" y="0" fill="url(#accentGrad3)" />
      <circle cx="420" cy="510" r="150" fill="rgba(85, 239, 196, 0.1)" />
      <circle cx="90" cy="120" r="105" fill="rgba(85, 239, 196, 0.06)" />
    </svg>
  `;

  await sharp(Buffer.from(svg1x))
    .png()
    .toFile(path.join(destPath, 'background.png'));
  console.log('✅ Created background.png (180x220)');

  await sharp(Buffer.from(svg2x))
    .png()
    .toFile(path.join(destPath, 'background@2x.png'));
  console.log('✅ Created background@2x.png (360x440)');

  await sharp(Buffer.from(svg3x))
    .png()
    .toFile(path.join(destPath, 'background@3x.png'));
  console.log('✅ Created background@3x.png (540x660)');

  console.log('\n🎉 Background images created successfully!');
  console.log('Your pass will have a clean visual design with minimal text.');
}

createBackgroundImages().catch(console.error);

