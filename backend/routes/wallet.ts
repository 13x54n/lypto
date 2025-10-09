import { Hono } from 'hono';
import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs';

export const walletRouter = new Hono();

walletRouter.get('/pass', async (c) => {
  try {
    const email = c.req.query('email');
    const points = c.req.query('points') || '1250';
    const userId = c.req.query('userId') || email?.replace('@', '_at_').replace(/\./g, '_');

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Check if certificates exist
    const certsPath = path.join(process.cwd(), 'certificates');
    const signerCertPath = path.join(certsPath, 'signerCert.pem');
    const signerKeyPath = path.join(certsPath, 'signerKey.pem');

    if (!fs.existsSync(signerCertPath) || !fs.existsSync(signerKeyPath)) {
      return c.json({
        error: 'Certificates not configured',
        message: 'Please add your Apple Wallet certificates to the backend/certificates directory',
        instructions: 'See backend/certificates/README.md for setup instructions',
      }, 500);
    }

    // Generate unique serial number
    const serialNumber = `LYP-${userId}-${Date.now()}`;

    // Path to pass assets
    const assetsPath = path.join(process.cwd(), 'assets', 'pass.pass');

    // Step 1: Create a Template (generic style with visual background)
    const template: any = new Template('generic', {
      passTypeIdentifier: 'pass.xyz.minginc.lypto',
      teamIdentifier: 'W64636R363',
      organizationName: 'Lypto',
      foregroundColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(0, 0, 0)',
      labelColor: 'rgb(85, 239, 196)',
      
    });

    // Step 2: Load certificate and key into template
    const certPem = fs.readFileSync(signerCertPath, 'utf8');
    const keyPem = fs.readFileSync(signerKeyPath, 'utf8');
    
    // Set certificate and key separately
    template.setCertificate(certPem);
    template.setPrivateKey(keyPem, ''); // Empty string for no password

    // Step 3: Add images to template
    // Required images for generic pass
    await template.images.add('icon', path.join(assetsPath, 'icon.png'));
    await template.images.add('icon', path.join(assetsPath, 'icon@2x.png'), '2x');
    await template.images.add('icon', path.join(assetsPath, 'icon@3x.png'), '3x');
    await template.images.add('logo', path.join(assetsPath, 'logo.png'));
    await template.images.add('logo', path.join(assetsPath, 'logo@2x.png'), '2x');
    await template.images.add('logo', path.join(assetsPath, 'logo@3x.png'), '3x');
    // Optional: Add thumbnail (appears on left side of pass)
    await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail.png'));
    await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail@2x.png'), '2x');
    await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail@3x.png'), '3x');

    // Step 4: Create a pass from the template with NFC support
    const pass: any = template.createPass({
      serialNumber: serialNumber,
      description: 'Lypto Pass',
      // Add NFC support for tap-to-share
      nfc: {
        message: `lypto://user/${userId || 'guest'}`,
        encryptionPublicKey: '',
      },
    });

    // Step 5: Minimal fields - pass is primarily visual with background image
    // Only add essential info to back of card
    pass.backFields.add({
      key: 'userId',
      label: 'User ID',
      value: (userId || 'guest').toString(),
    });

    pass.backFields.add({
      key: 'email',
      label: 'Email',
      value: email.toString(),
    });

    pass.backFields.add({
      key: 'points',
      label: 'Points Balance',
      value: `${points} points ($${(parseInt(points.toString()) * 0.01).toFixed(2)})`,
    });

    pass.backFields.add({
      key: 'nfcInfo',
      label: 'NFC Tap-to-Share',
      value: 'Tap your pass on NFC-enabled devices to instantly share your loyalty information.',
    });

    // Step 6: Generate the .pkpass buffer
    const buffer = await pass.asBuffer();

    // Return the binary .pkpass file
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="lypto_${userId}.pkpass"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating pass:', error);
    return c.json({ 
      error: 'Failed to generate pass',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Google Wallet JWT generation endpoint
walletRouter.post('/google-pass', async (c) => {
  try {
    const body = await c.req.json();
    const { email, points = 1250 } = body;

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // Google Wallet pass object
    const loyaltyObject = {
      id: `${email.replace('@', '_at_').replace(/\./g, '_')}_${Date.now()}`,
      classId: 'zypto_loyalty_class', // You need to create this in Google Wallet API
      state: 'ACTIVE',
      loyaltyPoints: {
        balance: {
          int: points,
        },
        label: 'Points',
      },
      accountName: email,
      accountId: email,
      barcode: {
        type: 'QR_CODE',
        value: `ZYPTO-${email}`,
      },
      textModulesData: [
        {
          header: 'MEMBER',
          body: email,
        },
        {
          header: 'VALUE',
          body: `$${(points * 0.01).toFixed(2)}`,
        },
      ],
    };

    // For now, return the object
    // In production, you would:
    // 1. Create JWT with Google Wallet credentials
    // 2. Return the save URL

    return c.json({
      success: true,
      message: 'Google Wallet pass generated (demo mode)',
      loyaltyObject,
      note: 'To enable actual Google Wallet integration, you need to:\n1. Enable Google Wallet API\n2. Create service account\n3. Generate JWT token\n4. Create loyalty class',
    });
  } catch (error) {
    console.error('Error generating Google Wallet pass:', error);
    return c.json({ error: 'Failed to generate Google Wallet pass' }, 500);
  }
});

