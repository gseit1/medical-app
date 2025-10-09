const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Empty password for XAMPP default
  database: 'medical_app',
  charset: 'utf8mb4'
};

async function fixGreekCharacters() {
  let connection;
  
  try {
    // Create connection with utf8mb4 charset
    connection = await mysql.createConnection({
      ...dbConfig,
      charset: 'utf8mb4'
    });

    console.log('Connected to database');

    // Set character set
    await connection.execute("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    await connection.execute("SET character_set_client = utf8mb4");
    await connection.execute("SET character_set_results = utf8mb4");
    await connection.execute("SET character_set_connection = utf8mb4");

    // Delete existing data
    console.log('Clearing existing data...');
    await connection.execute('DELETE FROM referrals');
    await connection.execute('DELETE FROM medical_instructions');
    await connection.execute('DELETE FROM patients');

    // Reset auto increment
    await connection.execute('ALTER TABLE patients AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE medical_instructions AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE referrals AUTO_INCREMENT = 1');

    // Insert patients
    console.log('Inserting patients...');
    const patients = [
      ['Γεώργιος Παπαδόπουλος', '12345678901', '123456789', 'A+'],
      ['Μαρία Κώστα', '12345678902', '123456790', 'B+'],
      ['Νίκος Αθανασίου', '12345678903', '123456791', 'O-'],
      ['Άννα Μιχάλη', '12345678904', '123456792', 'AB+'],
      ['Δημήτρης Νικολάου', '12345678905', '123456793', 'A-']
    ];

    for (const patient of patients) {
      await connection.execute(
        'INSERT INTO patients (full_name, amka, afm, blood_type) VALUES (?, ?, ?, ?)',
        patient
      );
    }

    // Insert medical instructions
    console.log('Inserting medical instructions...');
    const instructions = [
      [1, 'Παρακεταμόλη 500mg', 'MED001234567', 'Completed'],
      [1, 'Ιβουπροφαίνη 400mg', 'MED001234568', 'Pending'],
      [2, 'Αντιβιοτικά - 10 ημέρες', 'MED001234569', 'Pending'],
      [2, 'Ιμιγκράν δισκία', 'MED001234570', 'Pending'],
      [3, 'Παρακεταμόλη 500mg', 'MED001234571', 'Pending'],
      [3, 'Βιταμίνες B12', 'MED003456789-783', 'Pending'],
      [4, 'Ασπιρίνη καρδιάς', 'MED004567890-884', 'Pending'],
      [5, 'Παρακεταμόλη σιρόπι', 'MED005678901-985', 'Pending']
    ];

    for (const instruction of instructions) {
      await connection.execute(
        'INSERT INTO medical_instructions (patient_id, description, barcode, status) VALUES (?, ?, ?, ?)',
        instruction
      );
    }

    // Insert referrals
    console.log('Inserting referrals...');
    const referrals = [
      [1, 'Παραπεμπτικό για εξετάσεις CT', 'Δρ. Σπύρος Παπαγεωργίου', '2025-10-20'],
      [1, 'Παραπεμπτικό για εξετάσεις αίματος', 'Δρ. Κατερίνα Αντώνη', '2025-10-15'],
      [2, 'Παραπεμπτικό για καρδιολογικό έλεγχο', 'Δρ. Μιχάλης Γεωργίου', '2025-10-18'],
      [3, 'Παραπεμπτικό για δερματολογικό έλεγχο', 'Δρ. Ελένη Κανάκη', '2025-10-22'],
      [4, 'Παραπεμπτικό για οφθαλμολογικό έλεγχο', 'Δρ. Αντώνης Μακρής', '2025-10-25']
    ];

    for (const referral of referrals) {
      await connection.execute(
        'INSERT INTO referrals (patient_id, description, doctor_name, referral_date) VALUES (?, ?, ?, ?)',
        referral
      );
    }

    // Verify data
    console.log('\n=== Verifying Results ===');
    
    const [patientRows] = await connection.execute('SELECT id, full_name FROM patients ORDER BY id');
    console.log('\nPatients:');
    patientRows.forEach(p => console.log(`${p.id}: ${p.full_name}`));

    const [instructionRows] = await connection.execute('SELECT id, patient_id, description, barcode, status FROM medical_instructions ORDER BY id');
    console.log('\nMedical Instructions:');
    instructionRows.forEach(i => console.log(`${i.id}: ${i.description} (${i.barcode}) - ${i.status}`));

    const [referralRows] = await connection.execute('SELECT id, patient_id, description, doctor_name FROM referrals ORDER BY id');
    console.log('\nReferrals:');
    referralRows.forEach(r => console.log(`${r.id}: ${r.description} - ${r.doctor_name}`));

    console.log('\n✅ Greek characters fixed successfully!');

  } catch (error) {
    console.error('Error fixing Greek characters:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the fix
fixGreekCharacters();