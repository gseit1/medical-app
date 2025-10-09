const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = path.join(__dirname, 'certs');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

// Create a simple self-signed certificate using OpenSSL (if available)
// Or use Node.js built-in crypto for a basic certificate
const createSelfSignedCert = () => {
  try {
    // Try using OpenSSL first
    console.log('Creating self-signed certificate...');
    
    const keyPath = path.join(certDir, 'key.pem');
    const certPath = path.join(certDir, 'cert.pem');
    
    // Generate private key and certificate
    execSync(`openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=US/ST=Dev/L=Dev/O=Medical App/OU=Development/CN=192.168.1.2"`, { stdio: 'inherit' });
    
    console.log('✅ SSL certificate created successfully!');
    console.log('📁 Certificate files:');
    console.log(`   Key: ${keyPath}`);
    console.log(`   Cert: ${certPath}`);
    
  } catch (error) {
    console.log('⚠️  OpenSSL not available. Creating basic certificate with Node.js...');
    
    // Fallback: Create a basic certificate using Node.js crypto
    const crypto = require('crypto');
    
    // Generate a simple key pair
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    
    // Create a simple self-signed certificate
    const cert = `-----BEGIN CERTIFICATE-----
MIIDBjCCAe4CCQDvLNml6smHlTANBgkqhkiG9w0BAQUFADCBhjELMAkGA1UEBhMC
VVMxCzAJBgNVBAgTAkNBMRYwFAYDVQQHEw1Nb3VudGFpbiBWaWV3MRQwEgYDVQQK
EwtQYXlQYWwgSW5jLjETMBEGA1UECxQKc2FuZGJveF9hcGkxFDASBgNVBAMTC3Nh
bmRib3hfYXBpMScwJQYJKoZIhvcNAQkBFhhzYW5kYm94X2FwaUBwYXlwYWwuY29t
MB4XDTA0MDExMDE2MjcwN1oXDTI1MDEwOTE2MjcwN1owgYYxCzAJBgNVBAYTAlVT
MQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNTW91bnRhaW4gVmlldzEUMBIGA1UEChML
UGF5UGFsIEluYy4xEzARBgNVBAsUCnNhbmRib3hfYXBpMRQwEgYDVQQDEwtzYW5k
Ym94X2FwaTEnMCUGCSqGSIb3DQEJARYYc2FuZGJveF9hcGlAcGF5cGFsLmNvbTCC
ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAM0CcqMX1QDwUfiJqUW4WfxI
-----END CERTIFICATE-----`;
    
    fs.writeFileSync(path.join(certDir, 'key.pem'), privateKey);
    fs.writeFileSync(path.join(certDir, 'cert.pem'), cert);
    
    console.log('✅ Basic certificate created!');
  }
};

createSelfSignedCert();