const mysql = require('mysql2/promise');
require('dotenv').config();

async function insertGreekData() {
  let connection;
  
  try {
    // Create connection with explicit UTF-8 settings
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'medical_app',
      charset: 'utf8mb4'
    });

    console.log('✅ Connected to database');

    // Set connection charset
    await connection.query("SET NAMES 'utf8mb4'");
    await connection.query("SET CHARACTER SET utf8mb4");
    await connection.query("SET character_set_connection=utf8mb4");
    
    console.log('✅ Set UTF-8 encoding');

    // Clear existing data
    await connection.query('DELETE FROM referrals');
    await connection.query('DELETE FROM medical_instructions');
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM patients');
    
    console.log('✅ Cleared existing data');

    // Insert patients with Greek names
    const patients = [
      ['Γεώργιος Παπαδόπουλος', '12345678901', '123456789', 'A+'],
      ['Μαρία Ιωάννου', '23456789012', '234567890', 'B+'],
      ['Νίκος Κωνσταντίνου', '34567890123', '345678901', 'O+'],
      ['Ελένη Δημητρίου', '45678901234', '456789012', 'AB+'],
      ['Κωνσταντίνος Αντωνίου', '56789012345', '567890123', 'A-']
    ];

    const patientIds = [];
    for (const patient of patients) {
      const [result] = await connection.query(
        'INSERT INTO patients (full_name, amka, afm, blood_type) VALUES (?, ?, ?, ?)',
        patient
      );
      patientIds.push(result.insertId);
    }
    
    console.log('✅ Inserted', patients.length, 'patients');

    // Insert users
    const bcryptHash = '$2a$10$zEyQIt1C.c4fOMP7vny/BO3ad7OdveTnAv.rwwT6mZd1qHlzKIE2K';
    const users = [
      ['nurse1', bcryptHash, 'nurse', null],
      ['nurse2', bcryptHash, 'nurse', null],
      ['patient1', bcryptHash, 'patient', patientIds[0]],
      ['patient2', bcryptHash, 'patient', patientIds[1]],
      ['patient3', bcryptHash, 'patient', patientIds[2]],
      ['patient4', bcryptHash, 'patient', patientIds[3]],
      ['patient5', bcryptHash, 'patient', patientIds[4]]
    ];

    for (const user of users) {
      await connection.query(
        'INSERT INTO users (username, password, role, patient_id) VALUES (?, ?, ?, ?)',
        user
      );
    }
    
    console.log('✅ Inserted', users.length, 'users');

    // Insert medical instructions
    const instructions = [
      [patientIds[0], 'Χορήγηση Αντιβίωσης - Αμοξυκιλλίνη 500mg κάθε 8 ώρες για 7 ημέρες', 'MED001234567-571', 'Ολοκληρωμένη', '2025-01-14 10:30:00'],
      [patientIds[0], 'Μέτρηση Αρτηριακής Πίεσης - Πρωί και βράδυ', 'MED001234568-589', 'Εκρεμής', null],
      [patientIds[1], 'Ινσουλίνη - 10 μονάδες πριν το γεύμα', 'MED002345678-682', 'Εκρεμής', null],
      [patientIds[1], 'Έλεγχος Σακχάρου - Κάθε 4 ώρες', 'MED002345679-690', 'Ολοκληρωμένη', '2025-01-15 14:00:00'],
      [patientIds[2], 'Φυσιοθεραπεία - Ασκήσεις αποκατάστασης γόνατος', 'MED003456789-783', 'Εκρεμής', null],
      [patientIds[3], 'Αναπνευστική Θεραπεία - Εισπνοές κάθε 6 ώρες', 'MED004567890-884', 'Εκρεμής', null],
      [patientIds[4], 'Χορήγηση Παυσίπονου - Παρακεταμόλη 1g κατά την ανάγκη', 'MED005678901-985', 'Ολοκληρωμένη', '2025-01-15 16:45:00']
    ];

    for (const instruction of instructions) {
      await connection.query(
        'INSERT INTO medical_instructions (patient_id, description, barcode, status, completed_at) VALUES (?, ?, ?, ?, ?)',
        instruction
      );
    }
    
    console.log('✅ Inserted', instructions.length, 'medical instructions');

    // Insert referrals
    const referrals = [
      [patientIds[0], 'Παραπεμπτικό για Ακτινογραφία Θώρακος - Έλεγχος πνευμονίας', '2025-01-20', 'Δρ. Αθανασίου Μαρία'],
      [patientIds[0], 'Παραπεμπτικό για Καρδιολόγο - Έλεγχος αρτηριακής πίεσης', '2025-01-25', 'Δρ. Νικολάου Γεώργιος'],
      [patientIds[1], 'Παραπεμπτικό για Ενδοκρινολόγο - Έλεγχος διαβήτη', '2025-01-18', 'Δρ. Παπαδημητρίου Ελένη'],
      [patientIds[2], 'Παραπεμπτικό για Ορθοπεδικό - Μαγνητική τομογραφία γόνατος', '2025-01-22', 'Δρ. Κωνσταντίνου Νικόλαος'],
      [patientIds[3], 'Παραπεμπτικό για Πνευμονολόγο - Σπιρομέτρηση', '2025-01-19', 'Δρ. Ιωάννου Κωνσταντίνος'],
      [patientIds[4], 'Παραπεμπτικό για Αιματολόγο - Εξετάσεις αίματος', '2025-01-21', 'Δρ. Δημητρίου Μαρία']
    ];

    for (const referral of referrals) {
      await connection.query(
        'INSERT INTO referrals (patient_id, description, referral_date, doctor_name) VALUES (?, ?, ?, ?)',
        referral
      );
    }
    
    console.log('✅ Inserted', referrals.length, 'referrals');

    // Verify the data
    const [patients_check] = await connection.query('SELECT id, full_name FROM patients LIMIT 1');
    console.log('\n📋 Sample patient data:');
    console.log('   ID:', patients_check[0].id);
    console.log('   Name:', patients_check[0].full_name);
    console.log('   Contains Greek:', /[\u0370-\u03FF]/.test(patients_check[0].full_name) ? '✅ YES' : '❌ NO');

    console.log('\n✅ All data inserted successfully!');
    console.log('🔄 Now restart your backend server and refresh the browser.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

insertGreekData();
