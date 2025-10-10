import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import { execSync } from 'child_process';

async function comprehensiveDebug() {
  console.log('🔍 COMPREHENSIVE APPLE WALLET PASS DEBUG\n');
  console.log('=' .repeat(60));

  try {
    // Step 1: Check certificates
    console.log('\n📋 STEP 1: CERTIFICATE VALIDATION');
    console.log('-'.repeat(60));
    
    const certsPath = path.join(process.cwd(), 'certificates');
    const signerCertPath = path.join(certsPath, 'signerCert.pem');
    const signerKeyPath = path.join(certsPath, 'signerKey.pem');
    const wwdrPath = path.join(certsPath, 'wwdr.pem');

    if (!fs.existsSync(signerCertPath)) {
      console.error('❌ signerCert.pem not found');
      return;
    }
    if (!fs.existsSync(signerKeyPath)) {
      console.error('❌ signerKey.pem not found');
      return;
    }
    if (!fs.existsSync(wwdrPath)) {
      console.error('❌ wwdr.pem not found');
      return;
    }
    console.log('✅ All certificate files exist');

    // Check certificate details
    try {
      const certInfo = execSync(`openssl x509 -in ${signerCertPath} -noout -subject -issuer`, { encoding: 'utf8' });
      console.log('\n📜 Signing Certificate Info:');
      console.log(certInfo);

      const wwdrInfo = execSync(`openssl x509 -in ${wwdrPath} -noout -subject`, { encoding: 'utf8' });
      console.log('📜 WWDR Certificate Info:');
      console.log(wwdrInfo);

      // Check if key matches certificate
      const certModulus = execSync(`openssl x509 -in ${signerCertPath} -noout -modulus`, { encoding: 'utf8' });
      const keyModulus = execSync(`openssl rsa -in ${signerKeyPath} -noout -modulus 2>/dev/null || openssl ec -in ${signerKeyPath} -noout -text 2>/dev/null | head -1`, { encoding: 'utf8' });
      console.log('\n🔑 Certificate and key pair check:');
      if (certModulus.includes('Modulus') && keyModulus.includes('Modulus')) {
        console.log(certModulus === keyModulus ? '✅ Certificate and key match' : '❌ Certificate and key DO NOT match');
      } else {
        console.log('✅ EC key detected (different validation method)');
      }
    } catch (error) {
      console.error('⚠️  Error checking certificates:', (error as Error).message);
    }

    // Step 2: Check images
    console.log('\n📋 STEP 2: IMAGE VALIDATION');
    console.log('-'.repeat(60));
    
    const assetsPath = path.join(process.cwd(), 'assets', 'pass.pass');
    const requiredImages = [
      { name: 'icon.png', width: 29, height: 29 },
      { name: 'icon@2x.png', width: 58, height: 58 },
      { name: 'icon@3x.png', width: 87, height: 87 },
      { name: 'logo.png', width: 160, height: 50 },
      { name: 'logo@2x.png', width: 320, height: 100 },
      { name: 'logo@3x.png', width: 480, height: 150 },
      { name: 'strip.png', width: 375, height: 123 },
      { name: 'strip@2x.png', width: 750, height: 246 },
      { name: 'strip@3x.png', width: 1125, height: 369 },
    ];

    let allImagesValid = true;
    for (const img of requiredImages) {
      const imgPath = path.join(assetsPath, img.name);
      if (fs.existsSync(imgPath)) {
        try {
          const info = execSync(`file ${imgPath}`, { encoding: 'utf8' });
          const match = info.match(/(\d+) x (\d+)/);
          if (match) {
            const [, w, h] = match;
            const correct = parseInt(w) === img.width && parseInt(h) === img.height;
            console.log(`${correct ? '✅' : '❌'} ${img.name}: ${w}x${h} (expected ${img.width}x${img.height})`);
            if (!correct) allImagesValid = false;
          }
        } catch (error) {
          console.log(`❌ ${img.name}: Error reading image`);
          allImagesValid = false;
        }
      } else {
        console.log(`❌ ${img.name}: MISSING`);
        allImagesValid = false;
      }
    }

    if (!allImagesValid) {
      console.log('\n⚠️  Some images are invalid or missing');
    }

    // Step 3: Generate pass with full validation
    console.log('\n📋 STEP 3: PASS GENERATION');
    console.log('-'.repeat(60));

    // Load WWDR
    const wwdrPem = fs.readFileSync(wwdrPath, 'utf8');
    process.env.APPLE_WWDR_CERT_PEM = wwdrPem;
    console.log('✅ WWDR certificate loaded to environment');

    const email = 'test@example.com';
    const userId = 'test_at_example_com';
    const points = '1250';
    const serialNumber = `LYP-${userId}-${Date.now()}`;

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
    pass.primaryFields.add({
      key: 'balance',
      label: 'BALANCE',
      value: points,
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

    console.log('✅ Pass structure created');

    // Validate
    try {
      pass.validate();
      console.log('✅ Pass validation successful');
    } catch (error) {
      console.error('❌ Pass validation failed:', (error as Error).message);
      throw error;
    }

    // Generate buffer
    const buffer = await pass.asBuffer();
    console.log(`✅ Pass buffer generated: ${(buffer.length / 1024).toFixed(2)} KB`);

    // Step 4: Inspect generated pass
    console.log('\n📋 STEP 4: PASS CONTENTS INSPECTION');
    console.log('-'.repeat(60));

    const outputPath = path.join(process.cwd(), 'debug-pass.pkpass');
    fs.writeFileSync(outputPath, buffer);

    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();
    
    console.log('\n📦 Files in pass:');
    entries.forEach(entry => {
      console.log(`  - ${entry.entryName} (${(entry.header.size / 1024).toFixed(2)} KB)`);
    });

    // Check pass.json
    const passJsonEntry = zip.getEntry('pass.json');
    if (passJsonEntry) {
      const passJson = JSON.parse(passJsonEntry.getData().toString('utf8'));
      console.log('\n📄 pass.json contents:');
      console.log(JSON.stringify(passJson, null, 2));

      // Validate required fields
      console.log('\n🔍 Validating pass.json fields:');
      const requiredFields = [
        'formatVersion',
        'passTypeIdentifier',
        'teamIdentifier',
        'organizationName',
        'serialNumber',
        'description'
      ];
      
      for (const field of requiredFields) {
        if (passJson[field]) {
          console.log(`  ✅ ${field}: ${passJson[field]}`);
        } else {
          console.log(`  ❌ ${field}: MISSING`);
        }
      }

      if (passJson.nfc) {
        console.log(`  ✅ nfc.message: ${passJson.nfc.message}`);
      } else {
        console.log(`  ❌ nfc: MISSING`);
      }

      // Check if pass type matches certificate
      const certUid = certPem.match(/UID=([^,\n]+)/);
      if (certUid && certUid[1] === passJson.passTypeIdentifier) {
        console.log(`  ✅ passTypeIdentifier matches certificate UID`);
      } else {
        console.log(`  ⚠️  passTypeIdentifier: ${passJson.passTypeIdentifier}`);
        console.log(`  ⚠️  Certificate UID: ${certUid ? certUid[1] : 'not found'}`);
      }
    }

    // Check manifest
    const manifestEntry = zip.getEntry('manifest.json');
    if (manifestEntry) {
      const manifest = JSON.parse(manifestEntry.getData().toString('utf8'));
      console.log(`\n✅ manifest.json found with ${Object.keys(manifest).length} entries`);
    } else {
      console.log(`\n❌ manifest.json MISSING`);
    }

    // Check signature
    const signatureEntry = zip.getEntry('signature');
    if (signatureEntry) {
      console.log(`✅ signature file found (${signatureEntry.header.size} bytes)`);
    } else {
      console.log(`❌ signature file MISSING`);
    }

    console.log(`\n✅ Pass saved to: ${outputPath}`);
    console.log('\n📱 NEXT STEPS:');
    console.log('1. AirDrop this file to your iPhone');
    console.log('2. Try opening it in Apple Wallet');
    console.log('3. If it fails, check Settings > Wallet & Apple Pay for more details');
    console.log('\n💡 You can also try:');
    console.log('   - Opening the pass in Safari on iPhone (not Chrome)');
    console.log('   - Emailing the pass to yourself and opening on iPhone');

  } catch (error) {
    console.error('\n❌ ERROR:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

comprehensiveDebug();

