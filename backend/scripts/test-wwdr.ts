import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs';

async function testWithWWDR() {
  console.log('🧪 Testing pass with WWDR G6 environment variable...\n');

  try {
    // Load certificates
    const certsPath = path.join(process.cwd(), 'certificates');
    const signerCertPath = path.join(certsPath, 'signerCert.pem');
    const signerKeyPath = path.join(certsPath, 'signerKey.pem');
    const wwdrPath = path.join(certsPath, 'wwdr.pem');

    // Set WWDR as environment variable
    const wwdrPem = fs.readFileSync(wwdrPath, 'utf8');
    process.env.APPLE_WWDR_CERT_PEM = wwdrPem;
    console.log('✅ WWDR G6 certificate loaded into environment');

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
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(0, 0, 0)',
      labelColor: 'rgb(85, 239, 196)',
    });

    // Load certificates
    const certPem = fs.readFileSync(signerCertPath, 'utf8');
    const keyPem = fs.readFileSync(signerKeyPath, 'utf8');
    
    template.setCertificate(certPem);
    template.setPrivateKey(keyPem, '');
    console.log('✅ Signing certificate and key loaded');

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
    console.log('✅ Images loaded');

    // Create pass
    const pass: any = template.createPass({
      serialNumber: serialNumber,
      description: 'Lypto Pass',
      nfc: {
        message: `lypto://user/${userId}`,
      },
    });

    // Add fields
    pass.primaryFields.add({ key: 'balance', label: 'BALANCE', value: `${points}` });
    pass.secondaryFields.add({ key: 'member', label: 'MEMBER', value: email });
    pass.backFields.add({ key: 'userId', label: 'User ID', value: userId });
    console.log('✅ Fields added');

    // Generate pass
    const buffer = await pass.asBuffer();
    console.log(`✅ Pass generated: ${(buffer.length / 1024).toFixed(2)} KB`);

    // Save
    const outputPath = path.join(process.cwd(), 'test-wwdr-pass.pkpass');
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Pass saved: ${outputPath}`);

    console.log('\n🎉 SUCCESS! Pass with WWDR G6 generated!');
    console.log('\n📱 Try adding this pass to Apple Wallet - it should work now!');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
  }
}

testWithWWDR();

