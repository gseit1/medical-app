const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = 'password123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Generated hash:', hash);
    
    // Test the hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash validation test:', isValid ? '✓ Valid' : '❌ Invalid');
    
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash();