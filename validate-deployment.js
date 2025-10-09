#!/usr/bin/env node
/**
 * Pre-deployment validation script
 * Checks if the application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Pre-deployment Validation Check\n');

const checks = [];

// Check 1: Environment files exist
const envFiles = [
  'backend/.env',
  'backend/.env.production',
  'frontend/.env.production'
];

envFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  checks.push({
    name: `Environment file: ${file}`,
    status: exists ? 'PASS' : 'FAIL',
    details: exists ? 'File exists' : 'File missing'
  });
});

// Check 2: MongoDB URI configured
try {
  const envContent = fs.readFileSync(path.join(__dirname, 'backend/.env'), 'utf8');
  const hasMongoUri = envContent.includes('mongodb+srv://');
  checks.push({
    name: 'MongoDB Atlas URI configured',
    status: hasMongoUri ? 'PASS' : 'FAIL',
    details: hasMongoUri ? 'MongoDB Atlas URI found' : 'MongoDB URI missing or not Atlas'
  });
} catch (e) {
  checks.push({
    name: 'MongoDB Atlas URI configured',
    status: 'FAIL',
    details: 'Cannot read .env file'
  });
}

// Check 3: Package.json files have correct engines
const packageFiles = [
  'backend/package.json',
  'frontend/package.json'
];

packageFiles.forEach(file => {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
    const hasEngines = pkg.engines && pkg.engines.node;
    checks.push({
      name: `Node.js version specified in ${file}`,
      status: hasEngines ? 'PASS' : 'WARN',
      details: hasEngines ? `Node ${pkg.engines.node}` : 'No Node.js version specified'
    });
  } catch (e) {
    checks.push({
      name: `Package.json readable: ${file}`,
      status: 'FAIL',
      details: 'Cannot read package.json'
    });
  }
});

// Check 4: Deployment configuration files
const configFiles = [
  'frontend/netlify.toml',
  'backend/render.yaml',
  'DEPLOYMENT.md'
];

configFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  checks.push({
    name: `Config file: ${file}`,
    status: exists ? 'PASS' : 'WARN',
    details: exists ? 'Configuration ready' : 'Configuration file missing'
  });
});

// Display results
console.log('📋 Validation Results:\n');
let passCount = 0;
let failCount = 0;
let warnCount = 0;

checks.forEach((check, index) => {
  const icon = check.status === 'PASS' ? '✅' : check.status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${check.name}`);
  console.log(`   ${check.details}\n`);
  
  if (check.status === 'PASS') passCount++;
  else if (check.status === 'FAIL') failCount++;
  else warnCount++;
});

console.log('📊 Summary:');
console.log(`✅ Passed: ${passCount}`);
if (warnCount > 0) console.log(`⚠️  Warnings: ${warnCount}`);
if (failCount > 0) console.log(`❌ Failed: ${failCount}`);

console.log('\n🚀 Deployment Readiness:');
if (failCount === 0) {
  console.log('✅ READY FOR DEPLOYMENT!');
  console.log('\nNext steps:');
  console.log('1. Push code to GitHub');
  console.log('2. Deploy backend to Render');
  console.log('3. Deploy frontend to Netlify');
  console.log('4. Update CORS settings with production URLs');
} else {
  console.log('❌ NOT READY - Please fix the failed checks first');
}

process.exit(failCount > 0 ? 1 : 0);