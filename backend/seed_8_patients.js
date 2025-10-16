const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { Patient, User, MedicalInstruction } = require('./models');

// Professional medical images from Unsplash
const professionalPatientImages = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594824804732-ca8db5ac6d39?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=400&fit=crop&crop=face'
];

const nurseImages = [
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1594824804732-ca8db5ac6d39?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face'
];

// Connect to MongoDB Atlas (using .env configuration)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical_app';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function seedDatabase() {
  try {
    console.log('🔄 Starting database seeding...');

    // Clear existing data
    await Patient.deleteMany({});
    await User.deleteMany({});
    await MedicalInstruction.deleteMany({});
    
    console.log('🗑️ Cleared existing data');

    // Create nurses
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const nurses = [
      {
        username: 'maria.nurse',
        password: hashedPassword,
        full_name: 'Μαρία Παπαδοπούλου',
        email: 'maria.nurse@hospital.gr',
        phone: '6901234567',
        role: 'nurse',
        department: 'Παθολογική Κλινική',
        specialization: 'Νοσηλευτική Παθολογίας',
        employee_id: 'N001'
      },
      {
        username: 'anna.nurse', 
        password: hashedPassword,
        full_name: 'Άννα Γεωργίου',
        email: 'anna.nurse@hospital.gr',
        phone: '6901234568',
        role: 'nurse',
        department: 'Καρδιολογική Κλινική',
        specialization: 'Νοσηλευτική Καρδιολογίας',
        employee_id: 'N002'
      },
      {
        username: 'elena.nurse',
        password: hashedPassword,
        full_name: 'Ελένη Δημητρίου',
        email: 'elena.nurse@hospital.gr',
        phone: '6901234569',
        role: 'nurse',
        department: 'ΜΕΘ',
        specialization: 'Νοσηλευτική Εντατικής Θεραπείας',
        employee_id: 'N003'
      },
      {
        username: 'sophia.nurse',
        password: hashedPassword,
        full_name: 'Σοφία Κωνσταντίνου',
        email: 'sophia.nurse@hospital.gr',
        phone: '6901234570',
        role: 'nurse',
        department: 'Χειρουργική Κλινική',
        specialization: 'Περιεγχειρητική Νοσηλευτική',
        employee_id: 'N004'
      },
      {
        username: 'christina.nurse',
        password: hashedPassword,
        full_name: 'Χριστίνα Νικολάου',
        email: 'christina.nurse@hospital.gr',
        phone: '6901234571',
        role: 'nurse',
        department: 'Πνευμονολογική Κλινική',
        specialization: 'Νοσηλευτική Πνευμονολογίας',
        employee_id: 'N005'
      },
      {
        username: 'eirini.theologidoy',
        password: await bcrypt.hash('123456', 12),
        full_name: 'Ειρήνη Θεολογίδου',
        email: 'eirini.theologidoy@hospital.gr',
        phone: '6901234572',
        role: 'nurse',
        department: 'Γενική Κλινική',
        specialization: 'Νοσηλευτική',
        employee_id: 'N006'
      }
    ];

    const createdNurses = await User.insertMany(nurses);
    console.log('👩‍⚕️ Created 5 nurses with professional images');

    // Create the 8 scenario patients
    const patients = [
      {
        // Patient 1: Hypertension & Hypercholesterolemia with Drug Interaction
        full_name: 'Γεώργιος Αλεξάνδρου',
        name: 'Γεώργιος Αλεξάνδρου',
        amka: '12345678901',
        afm: '123456789',
        barcode: 'PAT001',
        blood_type: 'A+',
        age: 58,
        gender: 'Άνδρας',
        phone: '6912345678',
        medical_history: 'I10 Ιδιοπαθής Υπέρταση, E78.0 Καθαρή Υπερχοληστερολαιμία, J18.9 Πνευμονία'
      },
      {
        // Patient 2: Simple scenario - Rhinopharyngitis & Allergic Rhinitis
        full_name: 'Μαρία Δημητρίου',
        name: 'Μαρία Δημητρίου',
        amka: '12345678902',
        afm: '123456790',
        barcode: 'PAT002',
        blood_type: 'B+',
        age: 35,
        gender: 'Γυναίκα',
        phone: '6912345679',
        medical_history: 'J00 Οξεία ρινοφαρυγγίτιδα, J30.3 Άλλη αλλεργική ρινίτιδα'
      },
      {
        // Patient 3: Penicillin allergy with cellulitis
        full_name: 'Νικόλαος Παπαδόπουλος',
        name: 'Νικόλαος Παπαδόπουλος',
        amka: '12345678903',
        afm: '123456791',
        barcode: 'PAT003',
        blood_type: 'O-',
        age: 45,
        gender: 'Άνδρας',
        phone: '6912345680',
        medical_history: 'L03.90 Κυτταρίτιδα, Αλλεργία: Πενικιλίνη'
      },
      {
        // Patient 4: Post-operative monitoring with duplicate medication
        full_name: 'Ελένη Γεωργίου',
        name: 'Ελένη Γεωργίου',
        amka: '12345678904',
        afm: '123456792',
        barcode: 'PAT004',
        blood_type: 'AB+',
        age: 62,
        gender: 'Γυναίκα',
        phone: '6912345681',
        medical_history: 'Z09.0 Μετεγχειρητικός έλεγχος μετά από επέμβαση για άλλη πάθηση'
      },
      {
        // Patient 5: Type 1 Diabetes - Wrong medication scan
        full_name: 'Αλέξανδρος Κωνσταντίνου',
        name: 'Αλέξανδρος Κωνσταντίνου',
        amka: '12345678905',
        afm: '123456793',
        barcode: 'PAT005',
        blood_type: 'A-',
        age: 28,
        gender: 'Άνδρας',
        phone: '6912345682',
        medical_history: 'E10.9 Σακχαρώδης Διαβήτης Τύπου 1, μη καθορισμένος με επιπλοκές'
      },
      {
        // Patient 6: Hypertension with overdose error
        full_name: 'Σοφία Νικολάου',
        name: 'Σοφία Νικολάου',
        amka: '12345678906',
        afm: '123456794',
        barcode: 'PAT006',
        blood_type: 'B-',
        age: 55,
        gender: 'Γυναίκα',
        phone: '6912345683',
        medical_history: 'I10 Υπέρταση'
      },
      {
        // Patient 7: Type 2 Diabetes with wrong timing
        full_name: 'Δημήτριος Ιωάννου',
        name: 'Δημήτριος Ιωάννου',
        amka: '12345678907',
        afm: '123456795',
        barcode: 'PAT007',
        blood_type: 'O+',
        age: 48,
        gender: 'Άνδρας',
        phone: '6912345684',
        medical_history: 'E11.9 Σακχαρώδης Διαβήτης Τύπου 2'
      },
      {
        // Patient 8: UTI with wrong route of administration
        full_name: 'Κατερίνα Χριστοδούλου',
        name: 'Κατερίνα Χριστοδούλου',
        amka: '12345678908',
        afm: '123456796',
        barcode: 'PAT008',
        blood_type: 'AB-',
        age: 40,
        gender: 'Γυναίκα',
        phone: '6912345685',
        medical_history: 'N39.0 Λοίμωξη Ουροποιητικού - UTI'
      }
    ];

    const createdPatients = await Patient.insertMany(patients);
    console.log('👥 Created 8 scenario patients');

    // Create medical instructions for each patient according to scenarios
    const instructions = [
      // Patient 1: Drug interaction scenario (Klaricid + Lipitor → Rhabdomyolysis)
      {
        patient_id: createdPatients[0]._id,
        description: 'tb Coversyl 5 mg, S: 1X1 (πρωί) - ICD: I10 Ιδιοπαθής Υπέρταση',
        barcode: 'MED001001'
      },
      {
        patient_id: createdPatients[0]._id,
        description: 'tb Lipitor 40 mg, S: 1X1 (βράδυ) - ICD: E78.0 Καθαρή Υπερχοληστερολαιμία',
        barcode: 'MED001002'
      },
      {
        patient_id: createdPatients[0]._id,
        description: 'tb Klaricid 500 mg, S: 1X2 Για 14 ημέρες - ICD: J18.9 Πνευμονία',
        barcode: 'MED001003'
      },

      // Patient 2: Simple scenario (No alerts)
      {
        patient_id: createdPatients[1]._id,
        description: 'tb Brufen 400 mg, S: 1X3 (με φαγητό) - ICD: J00 Οξεία ρινοφαρυγγίτιδα',
        barcode: 'MED002001'
      },
      {
        patient_id: createdPatients[1]._id,
        description: 'spray Otrivin, S: 1X3 σε κάθε ρουθούνι - ICD: J30.3 Άλλη αλλεργική ρινίτιδα',
        barcode: 'MED002002'
      },

      // Patient 3: Penicillin allergy (Tazocin contains Penicillin)
      {
        patient_id: createdPatients[2]._id,
        description: 'am Xefo Rapid 4mg, S: 1X2 - ICD: L03.90 Κυτταρίτιδα',
        barcode: 'MED003001'
      },
      {
        patient_id: createdPatients[2]._id,
        description: 'fl Losec 40 mg, S: 1X1 (πρωί)',
        barcode: 'MED003002'
      },
      {
        patient_id: createdPatients[2]._id,
        description: 'fl Vancomycin 1g, S: 1X2',
        barcode: 'MED003003'
      },
      {
        patient_id: createdPatients[2]._id,
        description: 'fl Tazocin 4,5 g, S: 1X3 - ICD: L03.90 Κυτταρίτιδα',
        barcode: 'MED003004'
      },

      // Patient 4: Duplicate medication (Innohep already administered)
      {
        patient_id: createdPatients[3]._id,
        description: 'fl Augmentin 1g, S: 1X2 - ICD: Z09.0 Μετεγχειρητικός έλεγχος',
        barcode: 'MED004001'
      },
      {
        patient_id: createdPatients[3]._id,
        description: 'Amp Primperan 10mg, S: 1X1',
        barcode: 'MED004002'
      },
      {
        patient_id: createdPatients[3]._id,
        description: 'Amp Zideron 8mg, S: 1X1 (βράδυ)',
        barcode: 'MED004003'
      },
      {
        patient_id: createdPatients[3]._id,
        description: 'Inj Innohep 14000anti-XaIU/0,7ML, S: 1X1 - ICD: Z09.0 Θρομβοπροφύλαξη',
        barcode: 'MED004004'
      },

      // Patient 5: Wrong medication scan (Actrapid warning scenario)
      {
        patient_id: createdPatients[4]._id,
        description: 'Inj Actrapid 7 μονάδες (IU), S: 1X1 Άπαξ - ICD: E10.9 Σακχαρώδης Διαβήτης Τύπου 1',
        barcode: 'MED005001'
      },

      // Patient 6: Overdose error (40mg exceeds maximum 20mg)
      {
        patient_id: createdPatients[5]._id,
        description: 'tb Amlodipine 5 mg, S: 40mg X1 - ICD: I10 Υπέρταση',
        barcode: 'MED006001'
      },

      // Patient 7: Wrong timing (Glucophage scheduled for 08:00, 20:00 ±1h)
      {
        patient_id: createdPatients[6]._id,
        description: 'tb Glucophage 1000 mg, S: 1X2 (08:00, 20:00) - ICD: E11.9 Διαβήτης Τύπου 2',
        barcode: 'MED007001'
      },

      // Patient 8: Wrong route (P.O. order but IV preparation)
      {
        patient_id: createdPatients[7]._id,
        description: 'tb Ciprofloxacin 500 mg, S: 1X2 P.O. - ICD: N39.0 Λοίμωξη ουροποιητικού',
        barcode: 'MED008001'
      }
    ];

    await MedicalInstruction.insertMany(instructions);
    console.log('💊 Created medical instructions for all 8 scenario patients');

    console.log('\n✅ Database seeded successfully with 8 clinical scenarios!');
    console.log('\n📋 Clinical Scenarios Created:');
    console.log('1. 👨‍⚕️ Γεώργιος Αλεξάνδρου - Drug Interaction (Klaricid + Lipitor)');
    console.log('2. 👩‍⚕️ Μαρία Δημητρίου - Simple Rhinopharyngitis');
    console.log('3. 👨‍⚕️ Νικόλαος Παπαδόπουλος - Penicillin Allergy');
    console.log('4. 👩‍⚕️ Ελένη Γεωργίου - Duplicate Medication');
    console.log('5. 👨‍⚕️ Αλέξανδρος Κωνσταντίνου - Wrong Medication Scan');
    console.log('6. 👩‍⚕️ Σοφία Νικολάου - Overdose Error');
    console.log('7. 👨‍⚕️ Δημήτριος Ιωάννου - Wrong Timing');
    console.log('8. 👩‍⚕️ Κατερίνα Χριστοδούλου - Wrong Route');
    
    console.log('\n👩‍⚕️ Nurses available for login:');
    createdNurses.forEach(nurse => {
      const password = nurse.username === 'eirini.theologidoy' ? '123456' : 'password123';
      console.log(`- ${nurse.username} (${nurse.full_name}) - ${nurse.department} - Password: ${password}`);
    });

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();