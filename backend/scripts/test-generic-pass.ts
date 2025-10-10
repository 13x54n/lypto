import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';

async function testGenericPass() {
  console.log('🎫 Testing Generic Pass with Barcode...\n');

  const certsPath = path.join(process.cwd(), 'certificates');
  const wwdrPem = fs.readFileSync(path.join(certsPath, 'wwdr.pem'), 'utf8');
  process.env.APPLE_WWDR_CERT_PEM = wwdrPem;

  const email = 'test@example.com';
  const userId = 'test_at_example_com';
  const points = '1250';
  const serialNumber = `LYP-${userId}-${Date.now()}`;
  const assetsPath = path.join(process.cwd(), 'assets', 'pass.pass');

  // Create generic template
  const template: any = new Template('generic', {
    passTypeIdentifier: 'pass.xyz.minginc.lypto',
    teamIdentifier: 'W64636R363',
    organizationName: 'Lypto',
    description: 'Lypto Loyalty Card',
    logoText: 'Lypto',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 0, 0)',
    labelColor: 'rgb(85, 239, 196)',
  });

  const certPem = fs.readFileSync(path.join(certsPath, 'signerCert.pem'), 'utf8');
  const keyPem = fs.readFileSync(path.join(certsPath, 'signerKey.pem'), 'utf8');
  
  template.setCertificate(certPem);
  template.setPrivateKey(keyPem, '');

  // Add images
  await template.images.add('icon', path.join(assetsPath, 'icon.png'));
  await template.images.add('icon', path.join(assetsPath, 'icon@2x.png'), '2x');
  await template.images.add('icon', path.join(assetsPath, 'icon@3x.png'), '3x');
  await template.images.add('logo', path.join(assetsPath, 'logo.png'));
  await template.images.add('logo', path.join(assetsPath, 'logo@2x.png'), '2x');
  await template.images.add('logo', path.join(assetsPath, 'logo@3x.png'), '3x');
  await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail.png'));
  await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail@2x.png'), '2x');
  await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail@3x.png'), '3x');

  // Create pass
  const pass: any = template.createPass({
    serialNumber: serialNumber,
    description: 'Lypto Loyalty Card',
  });

  // Add fields
  pass.primaryFields.add({
    key: 'balance',
    label: 'POINTS BALANCE',
    value: points,
    changeMessage: 'Your balance is now %@',
  });

  pass.secondaryFields.add({
    key: 'member',
    label: 'MEMBER',
    value: email,
  });

  pass.auxiliaryFields.add({
    key: 'value',
    label: 'VALUE',
    value: `$${(parseInt(points) * 0.01).toFixed(2)}`,
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
    key: 'terms',
    label: 'Terms and Conditions',
    value: 'Visit lypto.vercel.app/terms for full terms and conditions.',
  });

  pass.backFields.add({
    key: 'support',
    label: 'Support',
    value: 'Email: support@lypto.app\nFor assistance, contact our support team.',
  });

  // Add QR code barcode
  pass.barcodes = [{
    message: `LYPTO:${userId}:${points}`,
    format: 'PKBarcodeFormatQR',
    messageEncoding: 'iso-8859-1',
  }];

  console.log('✅ Pass structure created');

  // Generate
  const buffer = await pass.asBuffer();
  const outputPath = path.join(process.cwd(), 'GENERIC_WITH_BARCODE.pkpass');
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Pass generated: ${(buffer.length / 1024).toFixed(2)} KB`);
  console.log(`✅ Saved to: ${outputPath}\n`);

  // Inspect contents
  const zip = new AdmZip(buffer);
  const passJsonEntry = zip.getEntry('pass.json');
  
  if (passJsonEntry) {
    const passJson = JSON.parse(passJsonEntry.getData().toString('utf8'));
    
    console.log('📄 Pass Type:', passJson.generic ? 'generic ✅' : 'other ❌');
    console.log('📊 Fields:');
    console.log(`   - Primary: ${passJson.generic?.primaryFields?.length || 0}`);
    console.log(`   - Secondary: ${passJson.generic?.secondaryFields?.length || 0}`);
    console.log(`   - Auxiliary: ${passJson.generic?.auxiliaryFields?.length || 0}`);
    console.log(`   - Back: ${passJson.generic?.backFields?.length || 0}`);
    console.log('📱 Barcodes:', passJson.barcodes?.length || 0);
    if (passJson.barcodes?.length > 0) {
      console.log(`   - Format: ${passJson.barcodes[0].format}`);
      console.log(`   - Message: ${passJson.barcodes[0].message}`);
    }
    console.log('🚫 NFC:', passJson.nfc ? 'Yes (should be No) ❌' : 'No ✅');
  }

  console.log('\n🎉 GENERIC PASS WITH BARCODE READY!');
  console.log('\n📱 TEST THIS PASS:');
  console.log('   1. AirDrop GENERIC_WITH_BARCODE.pkpass to iPhone');
  console.log('   2. Tap to open in Apple Wallet');
  console.log('   3. Should add successfully!');
  console.log('   4. QR code will be scannable');
}

testGenericPass().catch(console.error);

