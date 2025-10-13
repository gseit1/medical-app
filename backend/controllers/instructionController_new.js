const { MedicalInstruction, Patient, User } = require('../models');

// Verify barcode for a specific patient
const verifyBarcode = async (req, res) => {
  try {
    const { patientId, barcode } = req.body;

    console.log('=== BARCODE VERIFICATION ===');
    console.log('Patient ID:', patientId);
    console.log('Barcode:', barcode);

    if (!patientId || !barcode) {
      return res.status(400).json({ 
        success: false,
        verified: false,
        message: '❌ Λείπουν απαραίτητα στοιχεία' 
      });
    }

    // Check if barcode exists for this patient
    const instruction = await MedicalInstruction.findOne({ 
      barcode: barcode,
      patient_id: patientId 
    }).populate('patient_id');

    if (!instruction) {
      console.log('❌ Barcode not found for patient');
      return res.status(404).json({
        success: false,
        verified: false,
        message: '❌ Το QR code δεν αντιστοιχεί σε έγκυρη οδηγία για αυτόν τον ασθενή'
      });
    }

    // Check if instruction is still active
    if (instruction.status !== 'active') {
      console.log('❌ Instruction not active:', instruction.status);
      return res.status(400).json({
        success: false,
        verified: false,
        message: `❌ Η οδηγία δεν είναι ενεργή (Κατάσταση: ${instruction.status})`
      });
    }

    console.log('✅ Barcode verified successfully');
    
    return res.json({
      success: true,
      verified: true,
      message: '✅ Επαλήθευση επιτυχής',
      instruction: {
        id: instruction._id,
        medication_name: instruction.medication_name,
        dosage: instruction.dosage,
        frequency: instruction.frequency,
        instructions: instruction.instructions,
        icd10_code: instruction.icd10_code,
        diagnosis: instruction.diagnosis,
        start_date: instruction.start_date,
        end_date: instruction.end_date,
        created_at: instruction.created_at
      },
      patient: {
        id: instruction.patient_id._id,
        name: instruction.patient_id.name,
        amka: instruction.patient_id.amka
      }
    });

  } catch (error) {
    console.error('Barcode verification error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      message: '❌ Σφάλμα κατά την επαλήθευση'
    });
  }
};

// Get all instructions for a patient with drug interaction analysis
const getPatientInstructions = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    if (!patientId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Patient ID is required' 
      });
    }

    // Get all active instructions for the patient
    const instructions = await MedicalInstruction.find({ 
      patient_id: patientId,
      status: 'active'
    }).populate('patient_id').sort({ created_at: -1 });

    if (!instructions.length) {
      return res.json({
        success: true,
        instructions: [],
        message: 'Δεν βρέθηκαν ενεργές οδηγίες για αυτόν τον ασθενή'
      });
    }

    // Analyze drug interactions for this patient
    const drugInteractions = [];
    
    for (let i = 0; i < instructions.length; i++) {
      for (let j = i + 1; j < instructions.length; j++) {
        const drug1 = instructions[i].medication_name.toLowerCase();
        const drug2 = instructions[j].medication_name.toLowerCase();
        
        // Check for known dangerous interactions
        const interaction = checkDrugInteraction(drug1, drug2);
        if (interaction) {
          drugInteractions.push({
            medication1: instructions[i].medication_name,
            medication2: instructions[j].medication_name,
            severity: interaction.severity,
            description: interaction.description,
            recommendation: interaction.recommendation,
            instruction1_id: instructions[i]._id,
            instruction2_id: instructions[j]._id
          });
        }
      }
    }

    // Get other patients with similar conditions for reference (anonymized)
    const similarPatients = await MedicalInstruction.find({
      icd10_code: { $in: instructions.map(inst => inst.icd10_code) },
      patient_id: { $ne: patientId },
      status: 'active'
    }).select('medication_name icd10_code diagnosis -patient_id').limit(5);

    return res.json({
      success: true,
      instructions: instructions.map(inst => ({
        id: inst._id,
        medication_name: inst.medication_name,
        dosage: inst.dosage,
        frequency: inst.frequency,
        instructions: inst.instructions,
        icd10_code: inst.icd10_code,
        diagnosis: inst.diagnosis,
        start_date: inst.start_date,
        end_date: inst.end_date,
        status: inst.status,
        barcode: inst.barcode,
        created_at: inst.created_at,
        safety_alerts: inst.safety_alerts || []
      })),
      drug_interactions: drugInteractions,
      similar_treatments: similarPatients,
      patient: instructions[0].patient_id
    });

  } catch (error) {
    console.error('Get patient instructions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Σφάλμα κατά την ανάκτηση των οδηγιών'
    });
  }
};

// Create new medical instruction
const createInstruction = async (req, res) => {
  try {
    const {
      patient_id,
      medication_name,
      dosage,
      frequency,
      instructions,
      icd10_code,
      diagnosis,
      start_date,
      end_date,
      safety_alerts
    } = req.body;

    console.log('Creating instruction:', req.body);

    if (!patient_id || !medication_name || !dosage) {
      return res.status(400).json({
        success: false,
        message: 'Απαιτούνται: patient_id, medication_name, dosage'
      });
    }

    // Check if patient exists
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Ο ασθενής δεν βρέθηκε'
      });
    }

    // Check for existing active instruction with same medication
    const existingInstruction = await MedicalInstruction.findOne({
      patient_id: patient_id,
      medication_name: medication_name,
      status: 'active'
    });

    if (existingInstruction) {
      return res.status(409).json({
        success: false,
        message: `Υπάρχει ήδη ενεργή οδηγία για ${medication_name} για αυτόν τον ασθενή`
      });
    }

    // Generate unique barcode
    const barcode = `MED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create instruction
    const newInstruction = new MedicalInstruction({
      patient_id,
      medication_name,
      dosage,
      frequency: frequency || '1X1',
      instructions: instructions || `Λήψη ${medication_name} ${dosage}`,
      icd10_code,
      diagnosis,
      start_date: start_date || new Date(),
      end_date,
      barcode,
      status: 'active',
      safety_alerts: safety_alerts || []
    });

    await newInstruction.save();

    console.log('✅ Instruction created successfully:', newInstruction._id);

    return res.status(201).json({
      success: true,
      message: 'Η οδηγία δημιουργήθηκε επιτυχώς',
      instruction: newInstruction
    });

  } catch (error) {
    console.error('Create instruction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Σφάλμα κατά τη δημιουργία της οδηγίας'
    });
  }
};

// Update instruction status
const updateInstructionStatus = async (req, res) => {
  try {
    const { instructionId } = req.params;
    const { status } = req.body;

    if (!['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Μη έγκυρη κατάσταση. Επιτρεπόμενες: active, completed, cancelled'
      });
    }

    const instruction = await MedicalInstruction.findByIdAndUpdate(
      instructionId,
      { status },
      { new: true }
    ).populate('patient_id');

    if (!instruction) {
      return res.status(404).json({
        success: false,
        message: 'Η οδηγία δεν βρέθηκε'
      });
    }

    return res.json({
      success: true,
      message: `Η κατάσταση άλλαξε σε: ${status}`,
      instruction
    });

  } catch (error) {
    console.error('Update instruction status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Σφάλμα κατά την ενημέρωση της κατάστασης'
    });
  }
};

// Get all instructions (for nurses)
const getAllInstructions = async (req, res) => {
  try {
    const { status, patient_id } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (patient_id) filter.patient_id = patient_id;

    const instructions = await MedicalInstruction.find(filter)
      .populate('patient_id')
      .sort({ created_at: -1 })
      .limit(100); // Limit for performance

    return res.json({
      success: true,
      instructions: instructions.map(inst => ({
        id: inst._id,
        patient: {
          id: inst.patient_id._id,
          name: inst.patient_id.name,
          amka: inst.patient_id.amka,
          profile_image: inst.patient_id.profile_image
        },
        medication_name: inst.medication_name,
        dosage: inst.dosage,
        frequency: inst.frequency,
        instructions: inst.instructions,
        icd10_code: inst.icd10_code,
        diagnosis: inst.diagnosis,
        start_date: inst.start_date,
        end_date: inst.end_date,
        status: inst.status,
        barcode: inst.barcode,
        created_at: inst.created_at,
        safety_alerts: inst.safety_alerts || []
      }))
    });

  } catch (error) {
    console.error('Get all instructions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Σφάλμα κατά την ανάκτηση των οδηγιών'
    });
  }
};

// Get instruction by ID with patient details
const getInstructionById = async (req, res) => {
  try {
    const { instructionId } = req.params;

    const instruction = await MedicalInstruction.findById(instructionId)
      .populate('patient_id');

    if (!instruction) {
      return res.status(404).json({
        success: false,
        message: 'Η οδηγία δεν βρέθηκε'
      });
    }

    return res.json({
      success: true,
      instruction: {
        id: instruction._id,
        medication_name: instruction.medication_name,
        dosage: instruction.dosage,
        frequency: instruction.frequency,
        instructions: instruction.instructions,
        icd10_code: instruction.icd10_code,
        diagnosis: instruction.diagnosis,
        start_date: instruction.start_date,
        end_date: instruction.end_date,
        status: instruction.status,
        barcode: instruction.barcode,
        created_at: instruction.created_at,
        safety_alerts: instruction.safety_alerts || []
      },
      patient: {
        id: instruction.patient_id._id,
        name: instruction.patient_id.name,
        amka: instruction.patient_id.amka,
        age: instruction.patient_id.age,
        gender: instruction.patient_id.gender,
        phone: instruction.patient_id.phone,
        profile_image: instruction.patient_id.profile_image
      }
    });

  } catch (error) {
    console.error('Get instruction by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Σφάλμα κατά την ανάκτηση της οδηγίας'
    });
  }
};

// Drug interaction checker function
const checkDrugInteraction = (drug1, drug2) => {
  const interactions = {
    // Critical interactions
    'klaricid_lipitor': {
      severity: 'critical',
      description: 'Η συγχορήγηση Κλαριθρομυκίνης (Klaricid) και Ατορβαστατίνης (Lipitor) μπορεί να προκαλέσει ραβδομυόλυση',
      recommendation: 'Διακοπή της ατορβαστατίνης κατά τη διάρκεια της αντιβιοτικής αγωγής ή αντικατάσταση με άλλο αντιβιοτικό (π.χ. αζιθρομυκίνη)'
    },
    'clarithromycin_atorvastatin': {
      severity: 'critical',
      description: 'Η συγχορήγηση Κλαριθρομυκίνης και Ατορβαστατίνης μπορεί να προκαλέσει ραβδομυόλυση',
      recommendation: 'Διακοπή της ατορβαστατίνης κατά τη διάρκεια της αντιβιοτικής αγωγής ή αντικατάσταση με άλλο αντιβιοτικό'
    },
    // High risk interactions
    'warfarin_aspirin': {
      severity: 'high',
      description: 'Αυξημένος κίνδυνος αιμορραγίας',
      recommendation: 'Στενή παρακολούθηση INR και συμπτωμάτων αιμορραγίας'
    },
    // Medium risk interactions
    'coversyl_aspirin': {
      severity: 'medium',
      description: 'Πιθανή μείωση της αντιυπερτασικής δράσης',
      recommendation: 'Παρακολούθηση αρτηριακής πίεσης'
    }
  };

  // Normalize drug names for comparison
  const normalize = (name) => name.toLowerCase().replace(/\s+/g, '');
  const drug1_norm = normalize(drug1);
  const drug2_norm = normalize(drug2);

  // Check direct combinations
  const combination1 = `${drug1_norm}_${drug2_norm}`;
  const combination2 = `${drug2_norm}_${drug1_norm}`;

  return interactions[combination1] || interactions[combination2] || null;
};

module.exports = {
  verifyBarcode,
  getPatientInstructions,
  createInstruction,
  updateInstructionStatus,
  getAllInstructions,
  getInstructionById
};