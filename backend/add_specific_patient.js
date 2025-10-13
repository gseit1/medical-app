const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { User, Patient, MedicalInstruction } = require('./models');

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
}

async function addSpecificPatient() {
  try {
    await connectDB();
    
    // Check if patient already exists with AMKA 12345678901
    const existingPatient = await Patient.findOne({ amka: '12345678901' });
    
    let patient;
    if (existingPatient) {
      patient = existingPatient;
      console.log('✅ Patient already exists:', patient.name);
    } else {
      // Create the specific patient
      patient = new Patient({
        name: 'Γιώργος Παπαδόπουλος',
        amka: '12345678901',
        age: 65,
        gender: 'Άνδρας',
        phone: '2101234567',
        email: 'g.papadopoulos@example.com',
        address: 'Πανεπιστημίου 15, Αθήνα',
        emergency_contact: 'Μαρία Παπαδοπούλου - 6945123456',
        medical_history: 'Υπέρταση, Υπερχοληστερολαιμία',
        allergies: 'Καμία γνωστή αλλεργία',
        profile_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
      });

      await patient.save();
      console.log('✅ Patient created:', patient.name);
    }

    // Clear existing instructions for this patient to avoid duplicates
    await MedicalInstruction.deleteMany({ patient_id: patient._id });
    console.log('🧹 Cleared existing instructions for patient');

    // Create the three medical instructions with ICD-10 codes
    const instructions = [
      {
        patient_id: patient._id,
        description: 'Λήψη Coversyl 5mg για Υπέρταση',
        medication_name: 'Coversyl',
        dosage: '5 mg',
        frequency: '1X1 (πρωί)',
        instructions: 'Λήψη 1 δισκίο το πρωί με άδειο στομάχι',
        icd10_code: 'I10',
        icd10_description: 'Ιδιοπαθής Υπέρταση',
        barcode: `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'Pending',
        safety_alerts: [
          {
            alert_type: 'Info',
            message: 'Παρακολούθηση αρτηριακής πίεσης',
            severity: 'Medium'
          }
        ]
      },
      {
        patient_id: patient._id,
        description: 'Λήψη Lipitor 40mg για Υπερχοληστερολαιμία',
        medication_name: 'Lipitor',
        dosage: '40 mg',
        frequency: '1X1 (βράδυ)',
        instructions: 'Λήψη 1 δισκίο το βράδυ μετά το φαγητό',
        icd10_code: 'E78.0',
        icd10_description: 'Καθαρή Υπερχοληστερολαιμία',
        barcode: `MED-${Date.now() + 1}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'Pending',
        safety_alerts: [
          {
            alert_type: 'Info',
            message: 'Παρακολούθηση ηπατικών ενζύμων',
            severity: 'Medium'
          }
        ]
      },
      {
        patient_id: patient._id,
        description: 'Λήψη Klaricid 500mg για Πνευμονία',
        medication_name: 'Klaricid',
        dosage: '500 mg',
        frequency: '1X2',
        instructions: 'Λήψη 1 δισκίο κάθε 12 ώρες για 14 ημέρες',
        icd10_code: 'J18.9',
        icd10_description: 'Πνευμονία, μη καθορισμένη',
        barcode: `MED-${Date.now() + 2}-${Math.random().toString(36).substr(2, 9)}`,
        status: 'Pending',
        safety_alerts: [
          {
            alert_type: 'Contraindication',
            message: '🚨 ALARM: Αντένδειξη Συνχορήγησης - Klaricid και Lipitor, προκαλεί Ραβδομυόλυση',
            severity: 'Critical'
          },
          {
            alert_type: 'Warning',
            message: 'Είτε διακόπτεται προσωρινά η Ατορβαστατίνη για όλη τη διάρκεια της αντιβιοτικής αγωγής.',
            severity: 'High'
          },
          {
            alert_type: 'Caution',
            message: 'Είτε αντικαθίσταται η Κλαριθρομυκίνη με άλλο αντιβιοτικό (π.χ., Αζιθρομυκίνη ή άλλο) που δεν επηρεάζει σημαντικά το CYP3A4',
            severity: 'High'
          }
        ]
      }
    ];

    // Create all instructions
    for (const instructionData of instructions) {
      const instruction = new MedicalInstruction(instructionData);
      await instruction.save();
      console.log(`✅ Created instruction: ${instruction.medication_name} for ${instruction.diagnosis}`);
    }

    console.log('\n🎉 Successfully created patient with drug interaction alerts:');
    console.log(`👨‍⚕️ Patient: ${patient.name}`);
    console.log(`🆔 AMKA: ${patient.amka}`);
    console.log(`💊 Medications: Coversyl 5mg, Lipitor 40mg, Klaricid 500mg`);
    console.log(`⚠️  Drug Interaction: Klaricid + Lipitor = Ραβδομυόλυση Risk`);
    console.log(`🏥 ICD-10 Codes: I10, E78.0, J18.9`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the script
addSpecificPatient();