const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/database_mongo');
const { Patient, MedicalInstruction, Referral, User } = require('./models');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await Patient.deleteMany({});
    await MedicalInstruction.deleteMany({});
    await Referral.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Seed Patients
    const patients = await Patient.insertMany([
      {
        full_name: 'Γεώργιος Παπαδόπουλος',
        amka: '12345678901',
        afm: '123456789',
        blood_type: 'A+'
      },
      {
        full_name: 'Μαρία Κώστα',
        amka: '12345678902',
        afm: '123456790',
        blood_type: 'B+'
      },
      {
        full_name: 'Νίκος Αθανασίου',
        amka: '12345678903',
        afm: '123456791',
        blood_type: 'O-'
      },
      {
        full_name: 'Άννα Μιχάλη',
        amka: '12345678904',
        afm: '123456792',
        blood_type: 'AB+'
      },
      {
        full_name: 'Δημήτρης Νικολάου',
        amka: '12345678905',
        afm: '123456793',
        blood_type: 'A-'
      },
      {
        full_name: 'Κωνσταντίνος Δημητρίου',
        amka: '12345678906',
        afm: '123456794',
        blood_type: 'O+'
      },
      {
        full_name: 'Ελένη Παπαγιάννη',
        amka: '12345678907',
        afm: '123456795',
        blood_type: 'B-'
      },
      {
        full_name: 'Στέλιος Καραμανλής',
        amka: '12345678908',
        afm: '123456796',
        blood_type: 'A+'
      },
      {
        full_name: 'Φωτεινή Αλεξίου',
        amka: '12345678909',
        afm: '123456797',
        blood_type: 'AB-'
      },
      {
        full_name: 'Παναγιώτης Βασιλείου',
        amka: '12345678910',
        afm: '123456798',
        blood_type: 'O-'
      }
    ]);
    
    console.log(`✅ Seeded ${patients.length} patients`);

    // Seed Medical Instructions
    const instructions = await MedicalInstruction.insertMany([
      // Patient 1 - Γεώργιος
      { patient_id: patients[0]._id, description: 'Παρακεταμόλη 500mg', barcode: 'MED001234567', status: 'Completed' },
      { patient_id: patients[0]._id, description: 'Ιβουπροφαίνη 400mg', barcode: 'MED001234568', status: 'Pending' },
      
      // Patient 2 - Μαρία
      { patient_id: patients[1]._id, description: 'Αντιβιοτικά - 10 ημέρες', barcode: 'MED001234569', status: 'Pending' },
      { patient_id: patients[1]._id, description: 'Ιμιγκράν δισκία', barcode: 'MED001234570', status: 'Pending' },
      
      // Patient 3 - Νίκος
      { patient_id: patients[2]._id, description: 'Παρακεταμόλη 500mg', barcode: 'MED001234571', status: 'Pending' },
      { patient_id: patients[2]._id, description: 'Βιταμίνες B12', barcode: 'MED003456789-783', status: 'Pending' },
      
      // Patient 4 - Άννα
      { patient_id: patients[3]._id, description: 'Ασπιρίνη καρδιάς', barcode: 'MED004567890-884', status: 'Pending' },
      
      // Patient 5 - Δημήτρης
      { patient_id: patients[4]._id, description: 'Παρακεταμόλη σιρόπι', barcode: 'MED005678901-985', status: 'Pending' },
      
      // Patient 6 - Κωνσταντίνος
      { patient_id: patients[5]._id, description: 'Λοβαστατίνη 20mg', barcode: 'MED006789012-086', status: 'Pending' },
      { patient_id: patients[5]._id, description: 'Μετφορμίνη 500mg', barcode: 'MED006789013-187', status: 'Pending' },
      { patient_id: patients[5]._id, description: 'Ομεπραζόλη 20mg', barcode: 'MED006789014-288', status: 'Pending' },
      
      // Patient 7 - Ελένη
      { patient_id: patients[6]._id, description: 'Σιδήρου θειικός', barcode: 'MED007890123-389', status: 'Pending' },
      { patient_id: patients[6]._id, description: 'Φολικό οξύ 5mg', barcode: 'MED007890124-490', status: 'Pending' },
      { patient_id: patients[6]._id, description: 'Βιταμίνη D3', barcode: 'MED007890125-591', status: 'Pending' },
      
      // Patient 8 - Στέλιος
      { patient_id: patients[7]._id, description: 'Ραμιπρίλη 5mg', barcode: 'MED008901234-692', status: 'Pending' },
      { patient_id: patients[7]._id, description: 'Αμλοδιπίνη 5mg', barcode: 'MED008901235-793', status: 'Pending' },
      { patient_id: patients[7]._id, description: 'Ατορβαστατίνη 40mg', barcode: 'MED008901236-894', status: 'Pending' },
      
      // Patient 9 - Φωτεινή
      { patient_id: patients[8]._id, description: 'Λεβοθυροξίνη 100μg', barcode: 'MED009012345-995', status: 'Pending' },
      { patient_id: patients[8]._id, description: 'Ασκορβικό οξύ', barcode: 'MED009012346-196', status: 'Pending' },
      
      // Patient 10 - Παναγιώτης
      { patient_id: patients[9]._id, description: 'Κλοπιδογρέλη 75mg', barcode: 'MED010123456-297', status: 'Pending' },
      { patient_id: patients[9]._id, description: 'Βαρφαρίνη 5mg', barcode: 'MED010123457-398', status: 'Pending' }
    ]);
    
    console.log(`✅ Seeded ${instructions.length} medical instructions`);

    // Seed Referrals
    const referrals = await Referral.insertMany([
      { patient_id: patients[0]._id, description: 'Παραπεμπτικό για εξετάσεις CT', doctor_name: 'Δρ. Σπύρος Παπαγεωργίου', referral_date: new Date('2025-10-20') },
      { patient_id: patients[0]._id, description: 'Παραπεμπτικό για εξετάσεις αίματος', doctor_name: 'Δρ. Κατερίνα Αντώνη', referral_date: new Date('2025-10-15') },
      { patient_id: patients[1]._id, description: 'Παραπεμπτικό για καρδιολογικό έλεγχο', doctor_name: 'Δρ. Μιχάλης Γεωργίου', referral_date: new Date('2025-10-18') },
      { patient_id: patients[2]._id, description: 'Παραπεμπτικό για δερματολογικό έλεγχο', doctor_name: 'Δρ. Ελένη Κανάκη', referral_date: new Date('2025-10-22') },
      { patient_id: patients[3]._id, description: 'Παραπεμπτικό για οφθαλμολογικό έλεγχο', doctor_name: 'Δρ. Αντώνης Μακρής', referral_date: new Date('2025-10-25') },
      { patient_id: patients[5]._id, description: 'Παραπεμπτικό για καρδιολογικό έλεγχο', doctor_name: 'Δρ. Αθανάσιος Κωνσταντίνου', referral_date: new Date('2025-10-28') },
      { patient_id: patients[6]._id, description: 'Παραπεμπτικό για αιματολογικό έλεγχο', doctor_name: 'Δρ. Ιωάννα Παπαδάκη', referral_date: new Date('2025-10-30') }
    ]);
    
    console.log(`✅ Seeded ${referrals.length} referrals`);

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        username: 'nurse1',
        password: hashedPassword,
        role: 'nurse'
      },
      {
        username: 'georgios',
        password: hashedPassword,
        role: 'patient',
        patient_id: patients[0]._id
      }
    ]);
    
    console.log(`✅ Seeded ${users.length} users`);

    console.log('\n🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Patients: ${patients.length}`);
    console.log(`   Medical Instructions: ${instructions.length}`);
    console.log(`   Referrals: ${referrals.length}`);
    console.log(`   Users: ${users.length}`);
    
    console.log('\n🔐 Test Credentials:');
    console.log('   Nurse: nurse1 / password123');
    console.log('   Patient: georgios / password123');

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = { seedData };