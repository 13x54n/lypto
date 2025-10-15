import { Hono } from 'hono';
import { Template } from '@walletpass/pass-js';
import path from 'path';
import fs from 'fs';
import { swapLyptoToToken, swapTokenToLypto } from '../services/lyptoTokenService';

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
    const wwdrPath = path.join(certsPath, 'wwdr.pem');

    if (!fs.existsSync(signerCertPath) || !fs.existsSync(signerKeyPath) || !fs.existsSync(wwdrPath)) {
      return c.json({
        error: 'Certificates not configured',
        message: 'Please add your Apple Wallet certificates to the backend/certificates directory',
        instructions: 'See backend/certificates/README.md for setup instructions',
      }, 500);
    }

    // Load WWDR certificate and set as environment variable (required for @walletpass/pass-js)
    const wwdrPem = fs.readFileSync(wwdrPath, 'utf8');
    process.env.APPLE_WWDR_CERT_PEM = wwdrPem;

    // Generate unique serial number
    const serialNumber = `LYP-${userId}-${Date.now()}`;

    // Path to pass assets
    const assetsPath = path.join(process.cwd(), 'assets', 'pass.pass');

    // Step 1: Create a Template (generic style - more reliable)
    const template: any = new Template('generic', {
      passTypeIdentifier: 'pass.xyz.minginc.lypto',
      teamIdentifier: 'W64636R363',
      organizationName: 'Lypto',
      description: 'Lypto Loyalty Card',
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
    // Optional: Add thumbnail (appears on left side of generic pass)
    await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail.png'));
    await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail@2x.png'), '2x');
    await template.images.add('thumbnail', path.join(assetsPath, 'thumbnail@3x.png'), '3x');

    // Step 4: Create a pass from the template
    const pass: any = template.createPass({
      serialNumber: serialNumber,
      description: 'Lypto Card',
    });

    // Step 5: Add fields for generic pass
    // Primary field (displays prominently on front)
    // pass.primaryFields.add({
    //   key: 'balance',
    //   label: 'POINTS BALANCE',
    //   value: `${points}`,
    //   changeMessage: 'Your balance is now %@',
    // });

    // // Secondary field for member info
    // pass.secondaryFields.add({
    //   key: 'member',
    //   label: 'MEMBER',
    //   value: email.toString(),
    // });

    // // Auxiliary field for value
    // pass.auxiliaryFields.add({
    //   key: 'value',
    //   label: 'VALUE',
    //   value: `$${(parseInt(points.toString()) * 0.01).toFixed(2)}`,
    // });

    // Back fields for additional info
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
      message: `LYPTO:${userId || 'guest'}:${points}`,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1',
    }];

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

// Swap LYPTO to USDC or SOL
walletRouter.post('/swap/lypto-to-token', async (c) => {
  try {
    const body = await c.req.json();
    const { walletAddress, amount, outputToken } = body;

    if (!walletAddress || !amount || !outputToken) {
      return c.json({ error: 'walletAddress, amount, and outputToken are required' }, 400);
    }

    if (!['USDC', 'SOL'].includes(outputToken)) {
      return c.json({ error: 'outputToken must be USDC or SOL' }, 400);
    }

    if (amount <= 0) {
      return c.json({ error: 'Amount must be greater than 0' }, 400);
    }

    const result = await swapLyptoToToken(walletAddress, amount, outputToken);

    const { success, ...swapResult } = result;
    return c.json({
      success: true,
      ...swapResult,
      message: `Successfully swapped ${amount} LYPTO for ${result.outputAmount.toFixed(6)} ${outputToken}`
    });

  } catch (error) {
    console.error('Error swapping LYPTO:', error);
    return c.json({
      error: 'Failed to swap LYPTO',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Swap USDC or SOL to LYPTO
walletRouter.post('/swap/token-to-lypto', async (c) => {
  try {
    const body = await c.req.json();
    const { walletAddress, amount, inputToken } = body;

    if (!walletAddress || !amount || !inputToken) {
      return c.json({ error: 'walletAddress, amount, and inputToken are required' }, 400);
    }

    if (!['USDC', 'SOL'].includes(inputToken)) {
      return c.json({ error: 'inputToken must be USDC or SOL' }, 400);
    }

    if (amount <= 0) {
      return c.json({ error: 'Amount must be greater than 0' }, 400);
    }

    const result = await swapTokenToLypto(walletAddress, amount, inputToken);

    const { success, ...swapResult } = result;
    return c.json({
      success: true,
      ...swapResult,
      message: `Successfully swapped ${amount} ${inputToken} for ${result.outputAmount.toFixed(6)} LYPTO`
    });

  } catch (error) {
    console.error('Error swapping to LYPTO:', error);
    return c.json({
      error: 'Failed to swap to LYPTO',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get current exchange rates
walletRouter.get('/swap/rates', async (c) => {
  try {
    // This would fetch current rates from a price oracle in production
    // For now, return static rates
    return c.json({
      success: true,
      rates: {
        LYPTO_USDC: 0.01, // 1 LYPTO = 0.01 USDC
        LYPTO_SOL: 0.001,  // 1 LYPTO = 0.001 SOL
        USDC_LYPTO: 100,   // 1 USDC = 100 LYPTO
        SOL_LYPTO: 1000,   // 1 SOL = 1000 LYPTO
      },
      fees: {
        swapFee: '0.3%', // 0.3% swap fee
      }
    });

  } catch (error) {
    console.error('Error getting swap rates:', error);
    return c.json({ error: 'Failed to get swap rates' }, 500);
  }
});

