const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const { Patient, User, MedicalInstruction } = require('./models');

// Professional medical images from Unsplash
const professionalImages = {
  nurses: [
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1594824947235-0dc8bb5a2cce?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
  ],
  patients: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
  ]
};

// Greek medical names
const greekNames = {
  nurses: [
    { name: 'Μαρία Παπαδοπούλου', email: 'maria.papadopoulou@hospital.gr', department: 'Παθολογικό', specialization: 'Διπλωματούχος Νοσηλευτής' },
    { name: 'Νίκος Γεωργίου', email: 'nikos.georgiou@hospital.gr', department: 'Καρδιολογικό', specialization: 'Καρδιολογικός Νοσηλευτής' },
    { name: 'Ελένη Κωνσταντίνου', email: 'eleni.konstantinou@hospital.gr', department: 'Χειρουργικό', specialization: 'Χειρουργικός Νοσηλευτής' },
    { name: 'Δημήτρης Αντωνίου', email: 'dimitris.antoniou@hospital.gr', department: 'ΜΕΘ', specialization: 'Εντατικολόγος Νοσηλευτής' },
    { name: 'Σοφία Μιχαηλίδη', email: 'sofia.michailidi@hospital.gr', department: 'Παιδιατρικό', specialization: 'Παιδιατρικός Νοσηλευτής' }
  ],
  patients: [
    { name: 'Γιάννης Παπαγεωργίου', amka: '12345678901', afm: '123456789', history: 'Υπέρταση, Διαβήτης τύπου 2' },
    { name: 'Κατερίνα Δημητρίου', amka: '12345678902', afm: '123456790', history: 'Καρδιακή ανεπάρκεια' },
    { name: 'Αλέξανδρος Βασιλείου', amka: '12345678903', afm: '123456791', history: 'Πνευμονία' },
    { name: 'Άννα Νικολάου', amka: '12345678904', afm: '123456792', history: 'Οστεοπόρωση' },
    { name: 'Πέτρος Χρηστίδης', amka: '12345678905', afm: '123456793', history: 'Υπερχοληστερολαιμία' },
    { name: 'Ευαγγελία Λάμπρου', amka: '12345678906', afm: '123456794', history: 'Αρθρίτιδα' },
    { name: 'Κώστας Τσάκος', amka: '12345678907', afm: '123456795', history: 'Γαστρεντερίτιδα' },
    { name: 'Μαρία Σπύρου', amka: '12345678908', afm: '123456796', history: 'Μιγκρένα' },
    { name: 'Στέφανος Κάππας', amka: '12345678909', afm: '123456797', history: 'Άσθμα' },
    { name: 'Ζωή Μαρκάκη', amka: '12345678910', afm: '123456798', history: 'Υποθυρεοειδισμός' }
  ]
};

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['Άνδρας', 'Γυναίκα'];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Patient.deleteMany({});
    await User.deleteMany({});
    await MedicalInstruction.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create patients with professional images
    const createdPatients = [];
    for (let i = 0; i < greekNames.patients.length; i++) {
      const patientData = greekNames.patients[i];
      const patient = new Patient({
        full_name: patientData.name,
        name: patientData.name,
        amka: patientData.amka,
        afm: patientData.afm,
        blood_type: bloodTypes[i % bloodTypes.length],
        age: Math.floor(Math.random() * 60) + 20,
        gender: genders[i % 2],
        phone: `210${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        profile_image: professionalImages.patients[i],
        medical_history: patientData.history
      });
      
      const savedPatient = await patient.save();
      createdPatients.push(savedPatient);
      console.log(`👤 Created patient: ${patient.full_name}`);
    }

    // Create nurse users with professional images
    const createdNurses = [];
    for (let i = 0; i < greekNames.nurses.length; i++) {
      const nurseData = greekNames.nurses[i];
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      const nurse = new User({
        username: `nurse${i + 1}`,
        full_name: nurseData.name,
        password: hashedPassword,
        role: 'nurse',
        email: nurseData.email,
        phone: `210${String(Math.floor(Math.random() * 9000000) + 1000000)}`,
        profile_image: professionalImages.nurses[i],
        department: nurseData.department,
        specialization: nurseData.specialization,
        employee_id: `EMP${String(i + 1).padStart(4, '0')}`
      });
      
      const savedNurse = await nurse.save();
      createdNurses.push(savedNurse);
      console.log(`👨‍⚕️ Created nurse: ${nurse.full_name}`);
    }

    // Create patient users (linking to patient records)
    for (let i = 0; i < Math.min(5, createdPatients.length); i++) {
      const patient = createdPatients[i];
      const hashedPassword = await bcrypt.hash('patient123', 10);
      
      const patientUser = new User({
        username: `patient${i + 1}`,
        full_name: patient.full_name,
        password: hashedPassword,
        role: 'patient',
        email: `patient${i + 1}@hospital.gr`,
        phone: patient.phone,
        profile_image: patient.profile_image,
        patient_id: patient._id
      });
      
      await patientUser.save();
      console.log(`👤 Created patient user: ${patientUser.full_name}`);
    }

    // Create the specific patient with drug interactions you requested
    const specificPatient = new Patient({
      full_name: 'Αντώνιος Παπαδάκης',
      name: 'Αντώνιος Παπαδάκης',
      amka: '12345678999',
      afm: '999888777',
      blood_type: 'A+',
      age: 65,
      gender: 'Άνδρας',
      phone: '2101234567',
      profile_image: professionalImages.patients[0],
      medical_history: 'Ιδιοπαθής Υπέρταση, Καθαρή Υπερχοληστερολαιμία, Πνευμονία'
    });
    
    const savedSpecificPatient = await specificPatient.save();
    console.log(`🆔 Created specific patient: ${specificPatient.full_name}`);

    // Create medical instructions with drug interactions
    const medicalInstructions = [
      {
        patient_id: savedSpecificPatient._id,
        description: 'Coversyl 5 mg, 1X1 (πρωί) για Ιδιοπαθή Υπέρταση',
        barcode: `MED-${Date.now()}-COV001`,
        status: 'Pending'
      },
      {
        patient_id: savedSpecificPatient._id,
        description: 'Lipitor 40 mg, 1X1 (βράδυ) για Καθαρή Υπερχοληστερολαιμία',
        barcode: `MED-${Date.now()}-LIP001`,
        status: 'Pending'
      },
      {
        patient_id: savedSpecificPatient._id,
        description: 'Klaricid 500 mg, 1X2 για Πνευμονία (14 ημέρες) ⚠️ ΠΡΟΣΟΧΗ: Αντένδειξη με Lipitor!',
        barcode: `MED-${Date.now()}-KLA001`,
        status: 'Pending'
      }
    ];

    for (const instruction of medicalInstructions) {
      const savedInstruction = await new MedicalInstruction(instruction).save();
      console.log(`💊 Created instruction: ${instruction.description}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👤 Patients: ${createdPatients.length + 1}`);
    console.log(`👨‍⚕️ Nurses: ${createdNurses.length}`);
    console.log(`👤 Patient Users: ${Math.min(5, createdPatients.length)}`);
    console.log(`💊 Medical Instructions: ${medicalInstructions.length}`);
    console.log('\n🔐 Login credentials:');
    console.log('Nurses: nurse1/password123, nurse2/password123, etc.');
    console.log('Patients: patient1/patient123, patient2/patient123, etc.');
    console.log('\n⚠️  Drug Interaction Alert Created:');
    console.log('Patient "Αντώνιος Παπαδάκης" has Klaricid + Lipitor interaction');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the seeding
seedDatabase();