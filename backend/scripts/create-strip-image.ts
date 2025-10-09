import sharp from 'sharp';
import path from 'path';

async function createStripImages() {
  const destPath = path.join(process.cwd(), 'assets', 'pass.pass');

  console.log('Creating strip images for card-style pass...');

  // Brand color: rgb(85, 239, 196) = #55efc4
  // Create a gradient strip with the Lypto brand color
  
  // 1x density: 375x123 pixels
  const svg1x = `
    <svg width="375" height="123">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="375" height="123" fill="url(#grad1)" />
      <circle cx="320" cy="60" r="80" fill="rgba(255,255,255,0.1)" />
      <circle cx="380" cy="20" r="60" fill="rgba(255,255,255,0.05)" />
    </svg>
  `;

  // 2x density: 750x246 pixels
  const svg2x = `
    <svg width="750" height="246">
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="750" height="246" fill="url(#grad2)" />
      <circle cx="640" cy="120" r="160" fill="rgba(255,255,255,0.1)" />
      <circle cx="760" cy="40" r="120" fill="rgba(255,255,255,0.05)" />
    </svg>
  `;

  // 3x density: 1125x369 pixels
  const svg3x = `
    <svg width="1125" height="369">
      <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#55efc4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00d2d3;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1125" height="369" fill="url(#grad3)" />
      <circle cx="960" cy="180" r="240" fill="rgba(255,255,255,0.1)" />
      <circle cx="1140" cy="60" r="180" fill="rgba(255,255,255,0.05)" />
    </svg>
  `;

  await sharp(Buffer.from(svg1x))
    .png()
    .toFile(path.join(destPath, 'strip.png'));
  console.log('✅ Created strip.png (375x123)');

  await sharp(Buffer.from(svg2x))
    .png()
    .toFile(path.join(destPath, 'strip@2x.png'));
  console.log('✅ Created strip@2x.png (750x246)');

  await sharp(Buffer.from(svg3x))
    .png()
    .toFile(path.join(destPath, 'strip@3x.png'));
  console.log('✅ Created strip@3x.png (1125x369)');

  console.log('\n🎉 Strip images created successfully!');
  console.log('Your pass will now have a beautiful card-like appearance with a gradient header.');
}

createStripImages().catch(console.error);

