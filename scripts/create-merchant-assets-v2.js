/**
 * Create merchant logo assets - Replace BLACK with WHITE only
 * Keeps gradients and other colors intact
 */

const sharp = require('sharp');
const { mkdirSync } = require('fs');
const { join } = require('path');

const MOBILE_ASSETS = join(__dirname, '../mobile/assets/images');
const MERCHANT_ASSETS = join(__dirname, '../merchant/assets/images');

// Ensure merchant assets directory exists
mkdirSync(MERCHANT_ASSETS, { recursive: true });

async function replaceBlackWithWhite(inputPath, outputPath, size) {
  try {
    let image = sharp(inputPath);
    
    // Get metadata
    const metadata = await image.metadata();
    
    // Convert to raw pixels
    const { data, info } = await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Replace black/dark pixels with white
    // Iterate through pixels and replace very dark colors with white
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // If pixel is very dark (close to black), make it white
      const brightness = (r + g + b) / 3;
      if (brightness < 30 && a > 0) { // Dark pixel with alpha
        data[i] = 255;     // R = white
        data[i + 1] = 255; // G = white
        data[i + 2] = 255; // B = white
        // Keep alpha as is
      }
    }
    
    // Create image from modified buffer
    let outputImage = sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    });
    
    // Resize if needed
    if (size && (info.width !== size || info.height !== size)) {
      outputImage = outputImage.resize(size, size, { 
        fit: 'contain', 
        background: { r: 255, g: 255, b: 255, alpha: 0 } 
      });
    }
    
    await outputImage.png().toFile(outputPath);
    
    console.log(`✅ Created: ${outputPath} ${size ? `(${size}x${size})` : ''}`);
  } catch (error) {
    console.error(`❌ Error creating ${outputPath}:`, error?.message || error);
  }
}

async function createMerchantAssets() {
  console.log('🎨 Creating Merchant App Assets (Black → White)...\n');
  console.log('ℹ️  Converting black pixels to white, keeping gradients intact\n');

  // App Icon (1024x1024 for iOS)
  await replaceBlackWithWhite(
    join(MOBILE_ASSETS, 'icon.png'),
    join(MERCHANT_ASSETS, 'icon.png'),
    1024
  );

  // Splash Icon
  await replaceBlackWithWhite(
    join(MOBILE_ASSETS, 'splash-icon.png'),
    join(MERCHANT_ASSETS, 'splash-icon.png'),
    400
  );

  // Notification Icon
  await replaceBlackWithWhite(
    join(MOBILE_ASSETS, 'notification-icon.png'),
    join(MERCHANT_ASSETS, 'notification-icon.png'),
    96
  );

  // Favicon
  await replaceBlackWithWhite(
    join(MOBILE_ASSETS, 'favicon.png'),
    join(MERCHANT_ASSETS, 'favicon.png'),
    48
  );

  // Android Adaptive Icons
  await replaceBlackWithWhite(
    join(MOBILE_ASSETS, 'android-icon-foreground.png'),
    join(MERCHANT_ASSETS, 'android-icon-foreground.png'),
    1024
  );

  await replaceBlackWithWhite(
    join(MOBILE_ASSETS, 'android-icon-background.png'),
    join(MERCHANT_ASSETS, 'android-icon-background.png'),
    1024
  );

  await replaceBlackWithWhite(
    join(MOBILE_ASSETS, 'android-icon-monochrome.png'),
    join(MERCHANT_ASSETS, 'android-icon-monochrome.png'),
    1024
  );

  console.log('\n🎉 All merchant assets created!');
  console.log('📁 Location: merchant/assets/images/');
  console.log('\n💡 Changes:');
  console.log('   Black (#000) → White (#FFF)');
  console.log('   Gradients → Preserved ✅');
  console.log('   Green accents → Preserved ✅');
  console.log('\n🔍 Preview:');
  console.log('   open merchant/assets/images/icon.png');
}

createMerchantAssets().catch(console.error);

