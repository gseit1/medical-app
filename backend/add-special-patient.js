const mongoose = require('mongoose');
const { Patient, MedicalInstruction, User } = require('./models');
require('dotenv').config();

const addSpecialPatient = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if patient already exists
    let savedPatient = await Patient.findOne({ amka: '99887766554' });
    
    if (!savedPatient) {
      // Create the special patient with drug interactions
      const specialPatient = new Patient({
      full_name: 'Γεώργιος Παπαδόπουλος',
      amka: '99887766554',
      afm: '999888777',
      blood_type: 'A+',
      age: 68,
      gender: 'Άνδρας',
      diagnosis: 'Πολλαπλές παθήσεις - Υπέρταση, Υπερχοληστερολαιμία, Πνευμονία',
      admission_date: new Date(),
      room_number: '205',
      bed_number: '1',
      condition: 'critical', // Due to drug interaction
      profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      vital_signs: {
        heart_rate: 85,
        blood_pressure: '150/95',
        temperature: 37.2,
        oxygen_saturation: 96
      },
      medications: [
        {
          name: 'Coversyl',
          dosage: '5mg',
          frequency: '1X1 (πρωί)',
          route: 'Στόματος',
          start_date: new Date(),
          prescribing_doctor: 'Δρ. Κώστας Αντωνίου'
        },
        {
          name: 'Lipitor',
          dosage: '40mg', 
          frequency: '1X1 (βράδυ)',
          route: 'Στόματος',
          start_date: new Date(),
          prescribing_doctor: 'Δρ. Μαρία Γεωργίου'
        },
        {
          name: 'Klaricid',
          dosage: '500mg',
          frequency: '1X2',
          route: 'Στόματος',
          start_date: new Date(),
          duration: '14 ημέρες',
          prescribing_doctor: 'Δρ. Νίκος Δημητρίου'
        }
      ],
      allergies: ['Πενικιλλίνη'],
      emergency_contact: {
        name: 'Μαρία Παπαδοπούλου',
        relationship: 'Σύζυγος',
        phone: '6987654321'
      },
      safety_alerts: [
        {
          alert_type: 'Drug Interaction',
          severity: 'Critical',
          message: '🚨 ALARM: Αντένδειξη Συνχορήγησης - Klaricid και Lipitor προκαλεί Ραβδομυόλυση',
          recommendations: [
            'Είτε διακόπτεται προσωρινά η Ατορβαστατίνη για όλη τη διάρκεια της αντιβιοτικής αγωγής',
            'Είτε αντικαθίσταται η Κλαριθρομυκίνη με άλλο αντιβιοτικό (π.χ., Αζιθρομυκίνη ή άλλο) που δεν επηρεάζει σημαντικά το CYP3A4'
          ],
          created_by: 'Σύστημα Ελέγχου Φαρμάκων',
          is_acknowledged: false
        }
      ]
      });

      savedPatient = await specialPatient.save();
      console.log('✅ Special patient created:', savedPatient.full_name);
    } else {
      console.log('✅ Special patient already exists:', savedPatient.full_name);
    }

    // Create medical instructions for each condition
    const instructions = [
      {
        patient_id: savedPatient._id,
        description: 'tb Coversyl 5 mg, S: 1X1 (πρωί) - Για θεραπεία υπέρτασης',
        icd10_code: 'I10',
        icd10_description: 'Ιδιοπαθής Υπέρταση',
        medication_name: 'Coversyl',
        dosage: '5mg',
        instructions: 'tb Coversyl 5 mg, S: 1X1 (πρωί)',
        frequency: '1X1 (πρωί)',
        route: 'Στόματος',
        duration: 'Μακροχρόνια θεραπεία',
        prescribing_doctor: 'Δρ. Κώστας Αντωνίου',
        priority: 'high',
        status: 'Pending',
        barcode: `BC${Date.now()}001`,
        drug_interactions: [],
        contraindications: ['Αγγειονευρωτικό οίδημα', 'Εγκυμοσύνη']
      },
      {
        patient_id: savedPatient._id,
        description: 'tb Lipitor 40 mg, S: 1X1 (βράδυ) - Για θεραπεία υπερχοληστερολαιμίας',
        icd10_code: 'E78.0',
        icd10_description: 'Καθαρή Υπερχοληστερολαιμία',
        medication_name: 'Lipitor',
        dosage: '40mg',
        instructions: 'tb Lipitor 40 mg, S: 1X1 (βράδυ)',
        frequency: '1X1 (βράδυ)',
        route: 'Στόματος',
        duration: 'Μακροχρόνια θεραπεία',
        prescribing_doctor: 'Δρ. Μαρία Γεωργίου',
        priority: 'medium',
        status: 'Pending',
        barcode: `BC${Date.now()}002`,
        drug_interactions: [
          {
            interacting_drug: 'Κλαριθρομυκίνη (Klaricid)',
            severity: 'Critical',
            mechanism: 'Αναστολή CYP3A4 - Αυξημένος κίνδυνος ραβδομυόλυσης',
            clinical_effect: 'Σοβαρή μυοπάθεια και ραβδομυόλυση'
          }
        ],
        contraindications: ['Ενεργή ηπατική νόσος', 'Εγκυμοσύνη']
      },
      {
        patient_id: savedPatient._id,
        description: 'tb Klaricid 500 mg, S: 1X2 Για 14 ημέρες - Για θεραπεία πνευμονίας',
        icd10_code: 'J18.9',
        icd10_description: 'Πνευμονία, μη καθορισμένη',
        medication_name: 'Klaricid',
        dosage: '500mg',
        instructions: 'tb Klaricid 500 mg, S: 1X2 Για 14 ημέρες',
        frequency: '1X2',
        route: 'Στόματος',
        duration: '14 ημέρες',
        prescribing_doctor: 'Δρ. Νίκος Δημητρίου',
        priority: 'high',
        status: 'Pending',
        barcode: `BC${Date.now()}003`,
        drug_interactions: [
          {
            interacting_drug: 'Ατορβαστατίνη (Lipitor)',
            severity: 'Critical',
            mechanism: 'Αναστολή CYP3A4 μεταβολισμού στατινών',
            clinical_effect: 'Σοβαρή μυοπάθεια και ραβδομυόλυση - Αυξημένες CPK'
          }
        ],
        contraindications: ['Αλλεργία στις μακρολίδες', 'Σοβαρή ηπατική δυσλειτουργία'],
        safety_monitoring: [
          'Παρακολούθηση CPK επιπέδων',
          'Έλεγχος για μυαλγίες',
          'Παρακολούθηση ηπατικών ενζύμων'
        ]
      }
    ];

    // Save all medical instructions
    for (const instruction of instructions) {
      const medicalInstruction = new MedicalInstruction(instruction);
      await medicalInstruction.save();
      console.log(`✅ Medical instruction created: ${instruction.icd10_description}`);
    }

    console.log('\n🎉 Special patient with drug interactions added successfully!');
    console.log('📋 Patient Details:');
    console.log(`   Name: ${savedPatient.full_name}`);
    console.log(`   Room: ${savedPatient.room_number}, Bed: ${savedPatient.bed_number}`);
    console.log(`   Conditions: 3 active conditions with critical drug interaction`);
    console.log(`   Alert: Critical drug interaction between Klaricid and Lipitor`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error adding special patient:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the script
addSpecialPatient();