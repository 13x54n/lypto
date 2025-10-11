/**
 * Create inverted logo assets for Merchant app
 * Converts black backgrounds to white and vice versa
 */

const sharp = require('sharp');
const { mkdirSync } = require('fs');
const { join } = require('path');

const MOBILE_ASSETS = join(__dirname, '../mobile/assets/images');
const MERCHANT_ASSETS = join(__dirname, '../merchant/assets/images');

// Ensure merchant assets directory exists
mkdirSync(MERCHANT_ASSETS, { recursive: true });

async function invertLogo(inputPath, outputPath, size) {
  try {
    let image = sharp(inputPath);
    
    // Resize if size specified
    if (size) {
      image = image.resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } });
    }
    
    // Negate colors (invert)
    await image
      .negate({ alpha: false }) // Invert RGB but keep alpha
      .toFile(outputPath);
    
    console.log(`✅ Created: ${outputPath} ${size ? `(${size}x${size})` : ''}`);
  } catch (error) {
    console.error(`❌ Error creating ${outputPath}:`, error?.message || error);
  }
}

async function createMerchantAssets() {
  console.log('🎨 Creating Merchant App Assets (Inverted Colors)...\n');

  // App Icon (1024x1024 for iOS, will be resized automatically)
  await invertLogo(
    join(MOBILE_ASSETS, 'icon.png'),
    join(MERCHANT_ASSETS, 'icon.png'),
    1024
  );

  // Splash Icon
  await invertLogo(
    join(MOBILE_ASSETS, 'splash-icon.png'),
    join(MERCHANT_ASSETS, 'splash-icon.png'),
    400
  );

  // Notification Icon
  await invertLogo(
    join(MOBILE_ASSETS, 'notification-icon.png'),
    join(MERCHANT_ASSETS, 'notification-icon.png'),
    96
  );

  // Favicon
  await invertLogo(
    join(MOBILE_ASSETS, 'favicon.png'),
    join(MERCHANT_ASSETS, 'favicon.png'),
    48
  );

  // Android Adaptive Icons
  await invertLogo(
    join(MOBILE_ASSETS, 'android-icon-foreground.png'),
    join(MERCHANT_ASSETS, 'android-icon-foreground.png'),
    1024
  );

  await invertLogo(
    join(MOBILE_ASSETS, 'android-icon-background.png'),
    join(MERCHANT_ASSETS, 'android-icon-background.png'),
    1024
  );

  await invertLogo(
    join(MOBILE_ASSETS, 'android-icon-monochrome.png'),
    join(MERCHANT_ASSETS, 'android-icon-monochrome.png'),
    1024
  );

  console.log('\n🎉 All merchant assets created with inverted colors!');
  console.log('📁 Location: merchant/assets/images/');
  console.log('\n💡 Colors inverted:');
  console.log('   Black → White');
  console.log('   White → Black');
  console.log('   Logo will appear on white backgrounds');
}

createMerchantAssets().catch(console.error);

