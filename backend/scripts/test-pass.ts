import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs';

async function testPass() {
  console.log('🧪 Testing pass generation...\n');

  try {
    const email = 'test@example.com';
    const userId = 'test_at_example_com';
    const points = '1250';

    // Check certificates
    const certsPath = path.join(process.cwd(), 'certificates');
    const signerCertPath = path.join(certsPath, 'signerCert_with_chain.pem');
    const signerKeyPath = path.join(certsPath, 'signerKey.pem');

    if (!fs.existsSync(signerCertPath) || !fs.existsSync(signerKeyPath)) {
      console.error('❌ Certificates not found');
      return;
    }

    console.log('✅ Certificates found');

    const serialNumber = `LYP-${userId}-${Date.now()}`;
    const assetsPath = path.join(process.cwd(), 'assets', 'pass.pass');

    // Check all required images
    const requiredImages = [
      'icon.png', 'icon@2x.png', 'icon@3x.png',
      'logo.png', 'logo@2x.png', 'logo@3x.png',
      'strip.png', 'strip@2x.png', 'strip@3x.png'
    ];

    console.log('\n📸 Checking images...');
    for (const img of requiredImages) {
      const imgPath = path.join(assetsPath, img);
      if (fs.existsSync(imgPath)) {
        const stats = fs.statSync(imgPath);
        console.log(`  ✅ ${img} (${(stats.size / 1024).toFixed(2)} KB)`);
      } else {
        console.log(`  ❌ ${img} - MISSING!`);
      }
    }

    // Create template
    console.log('\n🏗️  Creating template...');
    const template: any = new Template('storeCard', {
      passTypeIdentifier: 'pass.xyz.minginc.lypto',
      teamIdentifier: 'W64636R363',
      organizationName: 'Lypto',
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(0, 0, 0)',
      labelColor: 'rgb(85, 239, 196)',
    });

    // Load certificates
    const certPem = fs.readFileSync(signerCertPath, 'utf8');
    const keyPem = fs.readFileSync(signerKeyPath, 'utf8');
    
    template.setCertificate(certPem);
    template.setPrivateKey(keyPem, '');
    console.log('✅ Certificates loaded');

    // Add images
    console.log('\n📸 Adding images to template...');
    await template.images.add('icon', path.join(assetsPath, 'icon.png'));
    await template.images.add('icon', path.join(assetsPath, 'icon@2x.png'), '2x');
    await template.images.add('icon', path.join(assetsPath, 'icon@3x.png'), '3x');
    console.log('  ✅ Icon images added');

    await template.images.add('logo', path.join(assetsPath, 'logo.png'));
    await template.images.add('logo', path.join(assetsPath, 'logo@2x.png'), '2x');
    await template.images.add('logo', path.join(assetsPath, 'logo@3x.png'), '3x');
    console.log('  ✅ Logo images added');

    await template.images.add('strip', path.join(assetsPath, 'strip.png'));
    await template.images.add('strip', path.join(assetsPath, 'strip@2x.png'), '2x');
    await template.images.add('strip', path.join(assetsPath, 'strip@3x.png'), '3x');
    console.log('  ✅ Strip images added');

    // Create pass
    console.log('\n🎫 Creating pass...');
    const pass: any = template.createPass({
      serialNumber: serialNumber,
      description: 'Lypto Pass',
      nfc: {
        message: `lypto://user/${userId}`,
      },
    });

    // Add fields
    pass.primaryFields.add({
      key: 'balance',
      label: 'BALANCE',
      value: `${points}`,
      changeMessage: 'Your balance is now %@',
    });

    pass.secondaryFields.add({
      key: 'member',
      label: 'MEMBER',
      value: email,
    });

    pass.backFields.add({
      key: 'userId',
      label: 'User ID',
      value: userId,
    });

    pass.backFields.add({
      key: 'email',
      label: 'Email',
      value: email,
    });

    pass.backFields.add({
      key: 'points',
      label: 'Points Balance',
      value: `${points} points`,
    });

    pass.backFields.add({
      key: 'nfcInfo',
      label: 'NFC Tap-to-Share',
      value: 'Tap your pass on NFC-enabled devices to instantly share your loyalty information.',
    });

    console.log('✅ Fields added');

    // Validate
    console.log('\n🔍 Validating pass...');
    pass.validate();
    console.log('✅ Pass validation successful');

    // Generate buffer
    console.log('\n📦 Generating pass buffer...');
    const buffer = await pass.asBuffer();
    console.log(`✅ Pass generated: ${(buffer.length / 1024).toFixed(2)} KB`);

    // Save to file
    const outputPath = path.join(process.cwd(), 'test-pass.pkpass');
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Pass saved to: ${outputPath}`);

    console.log('\n🎉 SUCCESS! Pass generated successfully!');
    console.log('\n📱 Try opening this file in Apple Wallet to see the actual error if any.');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

testPass();

