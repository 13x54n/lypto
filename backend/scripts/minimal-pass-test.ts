import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs';

async function minimalTest() {
  console.log('🧪 Creating MINIMAL test pass...\n');

  const certsPath = path.join(process.cwd(), 'certificates');
  const wwdrPem = fs.readFileSync(path.join(certsPath, 'wwdr.pem'), 'utf8');
  process.env.APPLE_WWDR_CERT_PEM = wwdrPem;

  const assetsPath = path.join(process.cwd(), 'assets', 'pass.pass');

  // Create template with MINIMAL configuration
  const template: any = new Template('storeCard', {
    passTypeIdentifier: 'pass.xyz.minginc.lypto',
    teamIdentifier: 'W64636R363',
    organizationName: 'Lypto',
    description: 'Test Pass',
  });

  const certPem = fs.readFileSync(path.join(certsPath, 'signerCert.pem'), 'utf8');
  const keyPem = fs.readFileSync(path.join(certsPath, 'signerKey.pem'), 'utf8');
  
  template.setCertificate(certPem);
  template.setPrivateKey(keyPem, '');

  // Add only required images
  await template.images.add('icon', path.join(assetsPath, 'icon.png'));
  await template.images.add('icon', path.join(assetsPath, 'icon@2x.png'), '2x');
  await template.images.add('logo', path.join(assetsPath, 'logo.png'));
  await template.images.add('logo', path.join(assetsPath, 'logo@2x.png'), '2x');
  await template.images.add('strip', path.join(assetsPath, 'strip.png'));
  await template.images.add('strip', path.join(assetsPath, 'strip@2x.png'), '2x');

  // Create pass with minimal fields - NO NFC
  const pass: any = template.createPass({
    serialNumber: `MINIMAL-${Date.now()}`,
    description: 'Test Pass',
  });

  // Add ONE field only
  pass.primaryFields.add({
    key: 'test',
    label: 'TEST',
    value: 'MINIMAL'
  });

  const buffer = await pass.asBuffer();
  const outputPath = path.join(process.cwd(), 'MINIMAL_TEST.pkpass');
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Minimal pass created: ${outputPath}`);
  console.log('📱 Try this minimal pass first!');
  console.log('\n🔄 If this works, the issue is with NFC or fields');
  console.log('🔄 If this fails too, the issue is with certificates or Apple Developer setup');
}

minimalTest().catch(console.error);

