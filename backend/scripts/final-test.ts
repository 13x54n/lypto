import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs';

async function finalTest() {
  console.log('🎯 FINAL VALIDATION TEST\n');

  const certsPath = path.join(process.cwd(), 'certificates');
  const signerCertPath = path.join(certsPath, 'signerCert.pem');
  const signerKeyPath = path.join(certsPath, 'signerKey.pem');
  const wwdrPath = path.join(certsPath, 'wwdr.pem');

  // Load WWDR
  const wwdrPem = fs.readFileSync(wwdrPath, 'utf8');
  process.env.APPLE_WWDR_CERT_PEM = wwdrPem;

  const email = 'test@example.com';
  const userId = 'test_at_example_com';
  const points = '1250';
  const serialNumber = `LYP-${userId}-${Date.now()}`;
  const assetsPath = path.join(process.cwd(), 'assets', 'pass.pass');

  // Create template
  const template: any = new Template('storeCard', {
    passTypeIdentifier: 'pass.xyz.minginc.lypto',
    teamIdentifier: 'W64636R363',
    organizationName: 'Lypto',
    description: 'Lypto Loyalty Card',
    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 0, 0)',
    labelColor: 'rgb(85, 239, 196)',
  });

  const certPem = fs.readFileSync(signerCertPath, 'utf8');
  const keyPem = fs.readFileSync(signerKeyPath, 'utf8');
  
  template.setCertificate(certPem);
  template.setPrivateKey(keyPem, '');

  // Add images
  await template.images.add('icon', path.join(assetsPath, 'icon.png'));
  await template.images.add('icon', path.join(assetsPath, 'icon@2x.png'), '2x');
  await template.images.add('icon', path.join(assetsPath, 'icon@3x.png'), '3x');
  await template.images.add('logo', path.join(assetsPath, 'logo.png'));
  await template.images.add('logo', path.join(assetsPath, 'logo@2x.png'), '2x');
  await template.images.add('logo', path.join(assetsPath, 'logo@3x.png'), '3x');
  await template.images.add('strip', path.join(assetsPath, 'strip.png'));
  await template.images.add('strip', path.join(assetsPath, 'strip@2x.png'), '2x');
  await template.images.add('strip', path.join(assetsPath, 'strip@3x.png'), '3x');

  // Create pass
  const pass: any = template.createPass({
    serialNumber: serialNumber,
    description: 'Lypto Loyalty Card',
    nfc: {
      message: `lypto://user/${userId}`,
    },
  });

  // Add fields
  pass.primaryFields.add({ key: 'balance', label: 'BALANCE', value: points });
  pass.secondaryFields.add({ key: 'member', label: 'MEMBER', value: email });
  pass.backFields.add({ key: 'userId', label: 'User ID', value: userId });
  pass.backFields.add({ key: 'email', label: 'Email', value: email });
  pass.backFields.add({ key: 'points', label: 'Points Balance', value: `${points} points` });
  pass.backFields.add({ key: 'nfcInfo', label: 'NFC Tap-to-Share', value: 'Tap your pass on NFC-enabled devices to instantly share your loyalty information.' });

  // Generate pass
  const buffer = await pass.asBuffer();
  
  const outputPath = path.join(process.cwd(), 'FINAL_TEST.pkpass');
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Pass generated successfully: ${(buffer.length / 1024).toFixed(2)} KB`);
  console.log(`✅ Saved to: ${outputPath}`);
  console.log('\n🎉 ALL SYSTEMS GO!');
  console.log('\n📱 TEST THIS PASS:');
  console.log('   1. AirDrop FINAL_TEST.pkpass to your iPhone');
  console.log('   2. Tap to open in Apple Wallet');
  console.log('   3. Should add successfully with NFC enabled!');
}

finalTest().catch(console.error);

