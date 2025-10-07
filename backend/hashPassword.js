const bcrypt = require('bcryptjs');

/**
 * Utility script to hash passwords for database insertion
 * Usage: node hashPassword.js <password>
 */

const password = process.argv[2] || 'password123';

const hashPassword = async (pass) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);
    
    console.log('\n=================================');
    console.log('Password Hashing Utility');
    console.log('=================================');
    console.log('Original Password:', pass);
    console.log('Hashed Password:', hash);
    console.log('=================================\n');
    console.log('Use this hash in your SQL INSERT statements:');
    console.log(`'${hash}'`);
    console.log('\n');
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

hashPassword(password);
