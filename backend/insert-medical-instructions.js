const mongoose = require('mongoose');
const { Patient, MedicalInstruction } = require('./models');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medical-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function insertMedicalInstructions() {
  try {
    // Find or create patient "Νικος Παπαδόπουλος"
    let patient = await Patient.findOne({ 
      $or: [
        { full_name: "Νικος Παπαδόπουλος" },
        { first_name: "Νικος", last_name: "Παπαδόπουλος" }
      ]
    });

    if (!patient) {
      patient = new Patient({
        full_name: "Νικος Παπαδόπουλος",
        amka: "12345678901",  // Greek social security number
        afm: "123456789",     // Greek tax identification number
        blood_type: "A+"
      });
      await patient.save();
      console.log('Patient created:', patient.full_name);
    } else {
      console.log('Patient found:', patient.full_name);
    }

    // Medical Instructions with ICD-10 codes and drug interactions
    const medicalInstructions = [
      {
        patient_id: patient._id,
        description: "Αντιυπερτασική θεραπεία - Coversyl 5mg",
        barcode: `MED${Date.now()}001`,
        icd10_code: "I10",
        icd10_description: "Essential (primary) hypertension",
        medication_name: "Coversyl (Perindopril)",
        dosage: "5mg",
        frequency: "Μία φορά ημερησίως",
        duration: "Συνεχής θεραπεία",
        instructions: "Λήψη το πρωί με άδειο στομάχι. Αποφυγή καλίου και αλατιού.",
        drug_interactions: [
          {
            interaction_with: "Klaricid (Clarithromycin)",
            severity: "Moderate",
            description: "Δυνατότητα αύξησης των επιπέδων του Coversyl στο αίμα",
            recommendation: "Παρακολούθηση αρτηριακής πίεσης"
          }
        ],
        safety_alerts: [
          {
            alert_type: "Warning",
            message: "Παρακολούθηση νεφρικής λειτουργίας",
            severity: "Medium"
          }
        ]
      },
      {
        patient_id: patient._id,
        description: "Αντιχοληστερολαιμική θεραπεία - Lipitor 20mg",
        barcode: `MED${Date.now()}002`,
        icd10_code: "E78.0",
        icd10_description: "Pure hypercholesterolaemia",
        medication_name: "Lipitor (Atorvastatin)",
        dosage: "20mg",
        frequency: "Μία φορά ημερησίως",
        duration: "Μακροχρόνια θεραπεία",
        instructions: "Λήψη το βράδυ με το φαγητό. Αποφυγή γκρέιπφρουτ.",
        drug_interactions: [
          {
            interaction_with: "Klaricid (Clarithromycin)",
            severity: "Critical",
            description: "ΚΡΙΤΙΚΗ ΑΛΛΗΛΕΠΙΔΡΑΣΗ: Κίνδυνος ραβδομυόλυσης και νεφρικής ανεπάρκειας",
            recommendation: "ΑΠΟΦΥΓΗ ΣΥΓΧΟΡΗΓΗΣΗΣ - Διακοπή Lipitor κατά τη διάρκεια της αντιβιοτικής αγωγής"
          }
        ],
        safety_alerts: [
          {
            alert_type: "Contraindication",
            message: "ΑΠΑΓΟΡΕΥΕΤΑΙ η συγχορήγηση με Klaricid - Κίνδυνος ραβδομυόλυσης",
            severity: "Critical"
          },
          {
            alert_type: "Warning",
            message: "Παρακολούθηση CPK και ηπατικών ενζύμων",
            severity: "High"
          }
        ]
      },
      {
        patient_id: patient._id,
        description: "Αντιβιοτική θεραπεία - Klaricid 500mg",
        barcode: `MED${Date.now()}003`,
        icd10_code: "J06.9",
        icd10_description: "Acute upper respiratory infection, unspecified",
        medication_name: "Klaricid (Clarithromycin)",
        dosage: "500mg",
        frequency: "Δύο φορές ημερησίως",
        duration: "7 ημέρες",
        instructions: "Λήψη με το φαγητό για 7 ημέρες. Ολοκλήρωση της αγωγής.",
        drug_interactions: [
          {
            interaction_with: "Lipitor (Atorvastatin)",
            severity: "Critical",
            description: "ΚΡΙΤΙΚΗ ΑΛΛΗΛΕΠΙΔΡΑΣΗ: Κίνδυνος ραβδομυόλυσης - διάσπαση μυών",
            recommendation: "ΑΜΕΣΗ ΔΙΑΚΟΠΗ Lipitor και παρακολούθηση CPK, κρεατινίνης"
          },
          {
            interaction_with: "Coversyl (Perindopril)",
            severity: "Moderate",
            description: "Αύξηση συγκέντρωσης ACE inhibitor",
            recommendation: "Παρακολούθηση αρτηριακής πίεσης"
          }
        ],
        safety_alerts: [
          {
            alert_type: "Contraindication",
            message: "ΚΡΙΣΙΜΟ: Διακοπή στατινών κατά τη διάρκεια της θεραπείας",
            severity: "Critical"
          },
          {
            alert_type: "Warning",
            message: "Παρακολούθηση για συμπτώματα μυοπάθειας (μυαλγία, αδυναμία)",
            severity: "High"
          }
        ]
      }
    ];

    // Insert medical instructions
    for (const instruction of medicalInstructions) {
      const existingInstruction = await MedicalInstruction.findOne({
        patient_id: instruction.patient_id,
        medication_name: instruction.medication_name
      });

      if (!existingInstruction) {
        const medicalInstruction = new MedicalInstruction(instruction);
        await medicalInstruction.save();
        console.log(`Medical instruction created: ${instruction.medication_name}`);
      } else {
        console.log(`Medical instruction already exists: ${instruction.medication_name}`);
      }
    }

    console.log('\n=== MEDICATION SAFETY SUMMARY ===');
    console.log('Patient: Νικος Παπαδόπουλος');
    console.log('Medications:');
    console.log('1. Coversyl 5mg (I10 - Hypertension)');
    console.log('2. Lipitor 20mg (E78.0 - Hypercholesterolaemia)');
    console.log('3. Klaricid 500mg (J06.9 - Upper respiratory infection)');
    console.log('\n⚠️  CRITICAL DRUG INTERACTION ALERT:');
    console.log('🔴 Klaricid + Lipitor = RHABDOMYOLYSIS RISK');
    console.log('📋 Action: DISCONTINUE Lipitor during antibiotic treatment');
    console.log('🔬 Monitor: CPK levels, kidney function, muscle symptoms');
    console.log('\nAll medical instructions inserted successfully!');

  } catch (error) {
    console.error('Error inserting medical instructions:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the insertion
insertMedicalInstructions();