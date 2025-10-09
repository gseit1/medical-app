const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Empty password for XAMPP default
  database: 'medical_app',
  charset: 'utf8mb4'
};

async function addMorePatientsAndInstructions() {
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

    // Insert more patients
    console.log('Adding more patients...');
    const newPatients = [
      ['Κωνσταντίνος Δημητρίου', '12345678906', '123456794', 'O+'],
      ['Ελένη Παπαγιάννη', '12345678907', '123456795', 'B-'],
      ['Στέλιος Καραμανλής', '12345678908', '123456796', 'A+'],
      ['Φωτεινή Αλεξίου', '12345678909', '123456797', 'AB-'],
      ['Παναγιώτης Βασιλείου', '12345678910', '123456798', 'O-'],
      ['Χριστίνα Μαρκάκη', '12345678911', '123456799', 'A-'],
      ['Αντώνιος Λαζάρου', '12345678912', '123456800', 'B+'],
      ['Σοφία Πετρίδη', '12345678913', '123456801', 'AB+']
    ];

    for (const patient of newPatients) {
      await connection.execute(
        'INSERT INTO patients (full_name, amka, afm, blood_type) VALUES (?, ?, ?, ?)',
        patient
      );
    }

    // Get patient IDs for the new patients
    const [patientRows] = await connection.execute('SELECT id, full_name FROM patients WHERE id > 5 ORDER BY id');
    console.log('\nNew patients added:');
    patientRows.forEach(p => console.log(`${p.id}: ${p.full_name}`));

    // Add medical instructions for new patients
    console.log('\nAdding medical instructions for new patients...');
    const newInstructions = [
      // Patient 6 - Κωνσταντίνος Δημητρίου
      [6, 'Λοβαστατίνη 20mg', 'MED006789012-086', 'Pending'],
      [6, 'Μετφορμίνη 500mg', 'MED006789013-187', 'Pending'],
      [6, 'Ομεπραζόλη 20mg', 'MED006789014-288', 'Pending'],
      
      // Patient 7 - Ελένη Παπαγιάννη
      [7, 'Σιδήρου θειικός', 'MED007890123-389', 'Pending'],
      [7, 'Φολικό οξύ 5mg', 'MED007890124-490', 'Pending'],
      [7, 'Βιταμίνη D3', 'MED007890125-591', 'Pending'],
      
      // Patient 8 - Στέλιος Καραμανλής
      [8, 'Ραμιπρίλη 5mg', 'MED008901234-692', 'Pending'],
      [8, 'Αμλοδιπίνη 5mg', 'MED008901235-793', 'Pending'],
      [8, 'Ατορβαστατίνη 40mg', 'MED008901236-894', 'Pending'],
      
      // Patient 9 - Φωτεινή Αλεξίου
      [9, 'Λεβοθυροξίνη 100μg', 'MED009012345-995', 'Pending'],
      [9, 'Ασκορβικό οξύ', 'MED009012346-196', 'Pending'],
      
      // Patient 10 - Παναγιώτης Βασιλείου
      [10, 'Κλοπιδογρέλη 75mg', 'MED010123456-297', 'Pending'],
      [10, 'Βαρφαρίνη 5mg', 'MED010123457-398', 'Pending'],
      [10, 'Διγοξίνη 0.25mg', 'MED010123458-499', 'Pending'],
      
      // Patient 11 - Χριστίνα Μαρκάκη
      [11, 'Σερτραλίνη 50mg', 'MED011234567-500', 'Pending'],
      [11, 'Λοραζεπάμη 1mg', 'MED011234568-601', 'Pending'],
      
      // Patient 12 - Αντώνιος Λαζάρου
      [12, 'Ινσουλίνη μακράς δράσης', 'MED012345678-702', 'Pending'],
      [12, 'Γλυκλαζίδη 80mg', 'MED012345679-803', 'Pending'],
      [12, 'Μετφορμίνη XR 1000mg', 'MED012345680-904', 'Pending'],
      
      // Patient 13 - Σοφία Πετρίδη
      [13, 'Αζιθρομυκίνη 500mg', 'MED013456789-105', 'Pending'],
      [13, 'Πρεδνιζολόνη 20mg', 'MED013456790-206', 'Pending'],
      [13, 'Κετοτιφαίνη σιρόπι', 'MED013456791-307', 'Pending']
    ];

    for (const instruction of newInstructions) {
      await connection.execute(
        'INSERT INTO medical_instructions (patient_id, description, barcode, status) VALUES (?, ?, ?, ?)',
        instruction
      );
    }

    // Add some referrals for new patients
    console.log('Adding referrals for new patients...');
    const newReferrals = [
      [6, 'Παραπεμπτικό για καρδιολογικό έλεγχο', 'Δρ. Αθανάσιος Κωνσταντίνου', '2025-10-28'],
      [7, 'Παραπεμπτικό για αιματολογικό έλεγχο', 'Δρ. Ιωάννα Παπαδάκη', '2025-10-30'],
      [8, 'Παραπεμπτικό για νεφρολογικό έλεγχο', 'Δρ. Σπύρος Μιχαλόπουλος', '2025-11-02'],
      [9, 'Παραπεμπτικό για ενδοκρινολογικό έλεγχο', 'Δρ. Μαρία Θεοδωράκη', '2025-11-05'],
      [10, 'Παραπεμπτικό για αγγειοχειρουργικό έλεγχο', 'Δρ. Νικόλαος Αργυρόπουλος', '2025-11-08'],
      [11, 'Παραπεμπτικό για ψυχιατρικό έλεγχο', 'Δρ. Κλεοπάτρα Βλαχάκη', '2025-11-10'],
      [12, 'Παραπεμπτικό για διαβητολογικό έλεγχο', 'Δρ. Γεώργιος Παπαντωνίου', '2025-11-12'],
      [13, 'Παραπεμπτικό για πνευμονολογικό έλεγχο', 'Δρ. Αικατερίνη Μαυρομάτη', '2025-11-15']
    ];

    for (const referral of newReferrals) {
      await connection.execute(
        'INSERT INTO referrals (patient_id, description, doctor_name, referral_date) VALUES (?, ?, ?, ?)',
        referral
      );
    }

    // Verify all data
    console.log('\n=== Final Database Status ===');
    
    const [allPatients] = await connection.execute('SELECT COUNT(*) as count FROM patients');
    console.log(`\nTotal Patients: ${allPatients[0].count}`);

    const [allInstructions] = await connection.execute('SELECT COUNT(*) as count FROM medical_instructions');
    console.log(`Total Medical Instructions: ${allInstructions[0].count}`);

    const [allReferrals] = await connection.execute('SELECT COUNT(*) as count FROM referrals');
    console.log(`Total Referrals: ${allReferrals[0].count}`);

    // Show some sample barcodes
    console.log('\n=== Sample Barcodes for Testing ===');
    const [sampleInstructions] = await connection.execute(`
      SELECT mi.barcode, p.full_name, mi.description 
      FROM medical_instructions mi 
      JOIN patients p ON mi.patient_id = p.id 
      WHERE mi.patient_id > 5 
      ORDER BY RAND() 
      LIMIT 10
    `);
    
    sampleInstructions.forEach((inst, index) => {
      console.log(`${index + 1}. ${inst.barcode} - ${inst.full_name}: ${inst.description}`);
    });

    console.log('\n✅ Successfully added more patients and medical instructions!');

  } catch (error) {
    console.error('Error adding data:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
addMorePatientsAndInstructions();