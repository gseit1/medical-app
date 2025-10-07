const { pool } = require('./config/database');

async function testEncoding() {
  try {
    const connection = await pool.getConnection();
    
    // Set the connection charset
    await connection.query('SET NAMES utf8mb4');
    
    // Query patients
    const [patients] = await connection.query('SELECT * FROM patients');
    
    console.log('=== Testing Greek Character Encoding ===\n');
    console.log('Number of patients found:', patients.length);
    console.log('\nPatient data:');
    
    patients.forEach((patient, index) => {
      console.log(`\n${index + 1}. Patient ID: ${patient.id}`);
      console.log(`   Name: ${patient.full_name}`);
      console.log(`   AMKA: ${patient.amka}`);
      console.log(`   AFM: ${patient.afm}`);
      console.log(`   Blood Type: ${patient.blood_type}`);
      
      // Check if name contains Greek characters
      const hasGreek = /[\u0370-\u03FF]/.test(patient.full_name);
      console.log(`   Contains Greek: ${hasGreek ? '✅ YES' : '❌ NO'}`);
      
      // Show character codes for debugging
      const charCodes = patient.full_name.split('').map(c => c.charCodeAt(0)).join(', ');
      console.log(`   Character codes: ${charCodes}`);
    });
    
    connection.release();
    await pool.end();
    
  } catch (error) {
    console.error('Error testing encoding:', error);
    process.exit(1);
  }
}

testEncoding();
