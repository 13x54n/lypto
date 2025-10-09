// Quick script to check certificate format
const fs = require('fs');
const path = require('path');

const certPath = path.join(__dirname, 'certificates', 'signerCert.pem');

if (fs.existsSync(certPath)) {
  const certContent = fs.readFileSync(certPath, 'utf8');
  console.log('Certificate found!');
  console.log('First 200 characters:');
  console.log(certContent.substring(0, 200));
  
  if (certContent.includes('EC PRIVATE KEY') || certContent.includes('EC PARAMETERS')) {
    console.log('\n⚠️  This appears to be an EC (Elliptic Curve) certificate.');
    console.log('Modern Apple certificates use EC instead of RSA.');
  } else if (certContent.includes('RSA')) {
    console.log('\n✅ This appears to be an RSA certificate.');
  } else {
    console.log('\n❓ Certificate type unclear.');
  }
} else {
  console.log('Certificate not found at:', certPath);
}

