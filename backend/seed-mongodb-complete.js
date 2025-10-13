const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB } = require('./config/database_mongo');
const { Patient, MedicalInstruction, Referral, User } = require('./models');

// Copy environment variables from .env.mongodb
require('dotenv').config({ path: '.env.mongodb' });

const seedMedicalData = async () => {
  try {
    console.log('🏥 Starting Medical App MongoDB Seeding...');
    
    // Connect to MongoDB Atlas
    await connectDB();

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Patient.deleteMany({});
    await MedicalInstruction.deleteMany({});
    await Referral.deleteMany({});
    await User.deleteMany({});

    // Professional Greek Medical Names and Patient Data
    const greekPatientData = [
      {
        full_name: 'Δημήτριος Παπανδρέου',
        amka: '12345678901',
        afm: '123456789',
        blood_type: 'A+',
        age: 45,
        gender: 'Άνδρας',
        phone: '2101234567',
        address: 'Λεωφ. Κηφισίας 123, Αθήνα',
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Μαρία Κωνσταντίνου',
        amka: '12345678902', 
        afm: '123456790',
        blood_type: 'B+',
        age: 38,
        gender: 'Γυναίκα',
        phone: '2102345678',
        address: 'Πατησίων 45, Αθήνα',
        profile_image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Νικόλαος Γεωργακόπουλος',
        amka: '12345678903',
        afm: '123456791', 
        blood_type: 'O-',
        age: 62,
        gender: 'Άνδρας',
        phone: '2103456789',
        address: 'Μεσογείων 234, Αθήνα',
        profile_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Αικατερίνη Δημητριάδου',
        amka: '12345678904',
        afm: '123456792',
        blood_type: 'AB+',
        age: 29,
        gender: 'Γυναίκα', 
        phone: '2104567890',
        address: 'Αλεξάνδρας 67, Αθήνα',
        profile_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Κωνσταντίνος Μιχαλάκος',
        amka: '12345678905',
        afm: '123456793',
        blood_type: 'A-',
        age: 51,
        gender: 'Άνδρας',
        phone: '2105678901',
        address: 'Βουλιαγμένης 89, Γλυφάδα',
        profile_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Ευαγγελία Παπαθανασίου',
        amka: '12345678906',
        afm: '123456794',
        blood_type: 'O+',
        age: 34,
        gender: 'Γυναίκα',
        phone: '2106789012',
        address: 'Κολοκοτρώνη 12, Πειραιάς',
        profile_image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Αλέξανδρος Βλάχος',
        amka: '12345678907',
        afm: '123456795',
        blood_type: 'B-',
        age: 41,
        gender: 'Άνδρας',
        phone: '2107890123',
        address: 'Ερμού 156, Θεσσαλονίκη',
        profile_image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Σοφία Τσιάρα',
        amka: '12345678908',
        afm: '123456796',
        blood_type: 'AB-',
        age: 26,
        gender: 'Γυναίκα',
        phone: '2108901234',
        address: 'Τσιμισκή 78, Θεσσαλονίκη',
        profile_image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Γεώργιος Καραμανλής',
        amka: '12345678909',
        afm: '123456797',
        blood_type: 'A+',
        age: 58,
        gender: 'Άνδρας',
        phone: '2109012345',
        address: 'Εγνατία 45, Θεσσαλονίκη',
        profile_image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        full_name: 'Χριστίνα Λάμπρου',
        amka: '12345678910',
        afm: '123456798',
        blood_type: 'O+',
        age: 33,
        gender: 'Γυναίκα',
        phone: '2100123456',
        address: 'Βασιλίσσης Σοφίας 200, Αθήνα',
        profile_image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      }
    ];

    console.log('👥 Inserting patients...');
    const patients = await Patient.insertMany(greekPatientData);
    console.log(`✅ Created ${patients.length} patients with professional images`);

    // Professional Medical Staff Data
    const medicalStaffData = [
      {
        username: 'nurse1',
        password: await bcrypt.hash('password123', 10),
        role: 'nurse',
        full_name: 'Δρ. Ελένη Παπαδοπούλου',
        profile_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        username: 'nurse2', 
        password: await bcrypt.hash('password123', 10),
        role: 'nurse',
        full_name: 'Νοσ. Μαρία Γεωργίου',
        profile_image: 'https://images.unsplash.com/photo-1594824932733-2fd6d2159556?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        username: 'doctor1',
        password: await bcrypt.hash('password123', 10),
        role: 'nurse',
        full_name: 'Δρ. Νικόλαος Αθανασίου',
        profile_image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      },
      {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'nurse', 
        full_name: 'Διευθυντής Νοσ. Κώστας Μιχαηλίδης',
        profile_image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
      }
    ];

    // Create patient users (first 5 patients get user accounts)
    const patientUsers = patients.slice(0, 5).map((patient, index) => ({
      username: `patient${index + 1}`,
      password: bcrypt.hashSync('patient123', 10),
      role: 'patient',
      patient_id: patient._id,
      full_name: patient.full_name,
      profile_image: patient.profile_image
    }));

    console.log('👨‍⚕️ Inserting medical staff and patient users...');
    const allUsers = [...medicalStaffData, ...patientUsers];
    const users = await User.insertMany(allUsers);
    console.log(`✅ Created ${users.length} users (${medicalStaffData.length} staff, ${patientUsers.length} patient accounts)`);

    // Enhanced Medical Instructions with ICD-10 Codes and Drug Interactions
    const medicalInstructions = [
      {
        patient_id: patients[0]._id,
        description: 'Χορήγηση αντιβιοτικού για λοίμωξη αναπνευστικού',
        barcode: `MED${Date.now()}001`,
        status: 'Pending',
        icd10_code: 'J44.1',
        icd10_description: 'Χρόνια αποφρακτική πνευμονοπάθεια με οξεία επιδείνωση',
        medication_name: 'Αμοξικιλλίνη/Κλαβουλανικό οξύ',
        dosage: '875mg/125mg',
        frequency: '2 φορές ημερησίως',
        duration: '7 ημέρες',
        instructions: 'Λήψη με φαγητό για αποφυγή γαστρικής δυσφορίας',
        drug_interactions: [
          {
            interaction_with: 'Warfarin',
            severity: 'High',
            description: 'Αύξηση αντιπηκτικής δράσης',
            recommendation: 'Παρακολούθηση ΙΝR'
          }
        ],
        safety_alerts: [
          {
            alert_type: 'Warning',
            message: 'Προσοχή σε ασθενείς με αλλεργία σε πενικιλλίνη',
            severity: 'High'
          }
        ]
      },
      {
        patient_id: patients[1]._id,
        description: 'Αντιυπερτασικό φάρμακο για ρύθμιση πίεσης',
        barcode: `MED${Date.now()}002`,
        status: 'Pending',
        icd10_code: 'I10',
        icd10_description: 'Ουσιώδης (πρωτοπαθής) υπέρταση',
        medication_name: 'Λοσαρτάνη',
        dosage: '50mg',
        frequency: '1 φορά ημερησίως',
        duration: 'Συνεχής θεραπεία',
        instructions: 'Λήψη το πρωί, με ή χωρίς φαγητό',
        drug_interactions: [
          {
            interaction_with: 'Λίθιο',
            severity: 'Moderate',
            description: 'Αύξηση επιπέδων λιθίου',
            recommendation: 'Παρακολούθηση επιπέδων λιθίου'
          }
        ],
        safety_alerts: [
          {
            alert_type: 'Caution',
            message: 'Παρακολούθηση νεφρικής λειτουργίας',
            severity: 'Medium'
          }
        ]
      },
      {
        patient_id: patients[2]._id,
        description: 'Ινσουλίνη για ρύθμιση σακχάρου',
        barcode: `MED${Date.now()}003`,
        status: 'Completed',
        completed_at: new Date(),
        icd10_code: 'E11.9',
        icd10_description: 'Σακχαρώδης διαβήτης τύπου 2 χωρίς επιπλοκές',
        medication_name: 'Ινσουλίνη Lispro',
        dosage: '10 μονάδες',
        frequency: 'Πριν από κάθε κύριο γεύμα',
        duration: 'Συνεχής θεραπεία',
        instructions: 'Υποδόρια ένεση στην κοιλιά ή μηρό',
        drug_interactions: [
          {
            interaction_with: 'β-αποκλειστές',
            severity: 'Moderate', 
            description: 'Μάσκαρισμα συμπτωμάτων υπογλυκαιμίας',
            recommendation: 'Συχότερος έλεγχος γλυκόζης'
          }
        ],
        safety_alerts: [
          {
            alert_type: 'Warning',
            message: 'Κίνδυνος υπογλυκαιμίας - παρακολούθηση γλυκόζης',
            severity: 'Critical'
          }
        ]
      },
      {
        patient_id: patients[3]._id,
        description: 'Αντιφλεγμονώδες για αρθρίτιδα',
        barcode: `MED${Date.now()}004`,
        status: 'Pending',
        icd10_code: 'M79.3',
        icd10_description: 'Παννικουλίτιδα, μη καθορισμένη',
        medication_name: 'Ιμπουπροφαίνη',
        dosage: '400mg',
        frequency: '3 φορές ημερησίως',
        duration: '10 ημέρες',
        instructions: 'Λήψη με φαγητό για προστασία στομάχου',
        drug_interactions: [
          {
            interaction_with: 'Ασπιρίνη',
            severity: 'High',
            description: 'Αυξημένος κίνδυνος γαστρεντερικής αιμορραγίας',
            recommendation: 'Αποφυγή συγχορήγησης'
          }
        ],
        safety_alerts: [
          {
            alert_type: 'Warning',
            message: 'Κίνδυνος γαστρεντερικών επιπλοκών',
            severity: 'High'
          }
        ]
      },
      {
        patient_id: patients[4]._id,
        description: 'Αντικαταθλιπτικό φάρμακο',
        barcode: `MED${Date.now()}005`,
        status: 'Pending',
        icd10_code: 'F32.9',
        icd10_description: 'Καταθλιπτικό επεισόδιο, μη καθορισμένο',
        medication_name: 'Σερτραλίνη',
        dosage: '50mg',
        frequency: '1 φορά ημερησίως',
        duration: 'Μακροχρόνια θεραπεία',
        instructions: 'Λήψη το πρωί με φαγητό',
        drug_interactions: [
          {
            interaction_with: 'MAO αναστολείς',
            severity: 'Critical',
            description: 'Σύνδρομο σεροτονίνης',
            recommendation: 'Απόλυτη αντένδειξη'
          }
        ],
        safety_alerts: [
          {
            alert_type: 'Warning',
            message: 'Παρακολούθηση για αυτοκτονικές τάσεις στους νέους',
            severity: 'High'
          }
        ]
      }
    ];

    console.log('💊 Inserting medical instructions with ICD-10 codes...');
    const instructions = await MedicalInstruction.insertMany(medicalInstructions);
    console.log(`✅ Created ${instructions.length} medical instructions with drug interactions`);

    // Enhanced Referrals
    const referrals = [
      {
        patient_id: patients[0]._id,
        description: 'Παραπομπή σε πνευμονολόγο για περαιτέρω αξιολόγηση',
        doctor_name: 'Δρ. Αθανάσιος Πνευμονολόγος',
        referral_date: new Date()
      },
      {
        patient_id: patients[1]._id,
        description: 'Παραπομπή σε καρδιολόγο για echo καρδιάς',
        doctor_name: 'Δρ. Μαρία Καρδιολόγος',
        referral_date: new Date()
      },
      {
        patient_id: patients[2]._id,
        description: 'Παραπομπή σε ενδοκρινολόγο για ρύθμιση διαβήτη',
        doctor_name: 'Δρ. Νίκος Ενδοκρινολόγος',
        referral_date: new Date()
      }
    ];

    console.log('📋 Inserting referrals...');
    const referralDocs = await Referral.insertMany(referrals);
    console.log(`✅ Created ${referralDocs.length} referrals`);

    console.log('\n🎉 MongoDB Seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   👥 Patients: ${patients.length} (with professional images)`);
    console.log(`   👨‍⚕️ Users: ${users.length} (${medicalStaffData.length} staff + ${patientUsers.length} patient accounts)`);
    console.log(`   💊 Medical Instructions: ${instructions.length} (with ICD-10 codes & drug interactions)`);
    console.log(`   📋 Referrals: ${referralDocs.length}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Medical Staff:');
    console.log('   - Username: nurse1, Password: password123 (Δρ. Ελένη Παπαδοπούλου)');
    console.log('   - Username: nurse2, Password: password123 (Νοσ. Μαρία Γεωργίου)');
    console.log('   - Username: admin, Password: admin123 (Διευθυντής)');
    console.log('   Patient Accounts:');
    console.log('   - Username: patient1, Password: patient123 (Δημήτριος)');
    console.log('   - Username: patient2, Password: patient123 (Μαρία)');
    console.log('   - Username: patient3, Password: patient123 (Νικόλαος)');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
};

// Run the seeding
seedMedicalData();