const bcrypt = require('bcryptjs');

async function testPassword() {
  const password = 'password123';
  const storedHash = '$2a$10$H6FsM1sL/81WvypLWTs3M.A4p2KsorKyh65oPwM9HjMLwoYdHldBu';
  
  console.log('Testing password comparison...');
  console.log('Password:', password);
  console.log('Stored hash:', storedHash);
  
  try {
    const isValid = await bcrypt.compare(password, storedHash);
    console.log('Password validation result:', isValid ? '✅ SUCCESS' : '❌ FAILED');
    
    if (!isValid) {
      console.log('Hash length:', storedHash.length);
      console.log('Hash starts with $2a$10$?', storedHash.startsWith('$2a$10$'));
    }
  } catch (error) {
    console.error('Error during password comparison:', error);
  }
}

testPassword();