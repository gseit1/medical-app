const { MedicalInstruction, Patient } = require('../models');

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
    const instructions = await MedicalInstruction.find({ 
      patient_id: patientId, 
      barcode: barcode 
    });

    console.log('Instructions found:', instructions.length);
    if (instructions.length > 0) {
      console.log('Instruction:', instructions[0]);
    }

    if (instructions.length === 0) {
      // Check if barcode exists for a different patient
      const otherInstructions = await MedicalInstruction.find({ barcode: barcode });

      if (otherInstructions.length > 0) {
        return res.json({
          success: false,
          verified: false,
          message: '❌ Το barcode ανήκει σε άλλον ασθενή!'
        });
      }

      return res.json({
        success: false,
        verified: false,
        message: '❌ Το barcode δεν αντιστοιχεί σε οδηγία για αυτόν τον ασθενή'
      });
    }

    const instruction = instructions[0];

    return res.json({
      success: true,
      verified: true,
      message: '✅ Το barcode είναι σωστό!',
      instruction: {
        id: instruction.id,
        description: instruction.description,
        barcode: instruction.barcode,
        status: instruction.status,
        patient_id: instruction.patient_id
      }
    });

  } catch (error) {
    console.error('Error verifying barcode:', error);
    res.status(500).json({ 
      success: false,
      verified: false,
      message: '❌ Σφάλμα κατά την επαλήθευση' 
    });
  }
};

// Verify barcode by instruction ID (for URL-based scanning)
const verifyBarcodeById = async (req, res) => {
  try {
    const { patientId, instructionId } = req.body;

    console.log('=== BARCODE VERIFICATION BY ID ===');
    console.log('Patient ID:', patientId);
    console.log('Instruction ID:', instructionId);

    if (!patientId || !instructionId) {
      return res.status(400).json({ 
        success: false,
        verified: false,
        message: '❌ Λείπουν απαραίτητα στοιχεία' 
      });
    }

    // Check if instruction exists and belongs to the specified patient
    const [instructions] = await pool.query(
      `SELECT id, description, barcode, status, patient_id
       FROM medical_instructions
       WHERE id = ? AND patient_id = ?`,
      [instructionId, patientId]
    );

    console.log('Instructions found:', instructions.length);
    if (instructions.length > 0) {
      console.log('Instruction:', instructions[0]);
    }

    if (instructions.length === 0) {
      // Check if instruction exists but for a different patient
      const [otherInstructions] = await pool.query(
        `SELECT patient_id FROM medical_instructions WHERE id = ?`,
        [instructionId]
      );

      if (otherInstructions.length > 0) {
        return res.json({
          success: false,
          verified: false,
          message: '❌ Η οδηγία ανήκει σε άλλον ασθενή!'
        });
      }

      return res.json({
        success: false,
        verified: false,
        message: '❌ Η οδηγία δεν βρέθηκε'
      });
    }

    const instruction = instructions[0];

    // Check if instruction is already completed
    if (instruction.status === 'Completed') {
      return res.json({
        success: false,
        verified: false,
        alreadyCompleted: true,
        message: '❌ Η οδηγία έχει εκτελεστεί',
        instruction: {
          id: instruction.id,
          description: instruction.description,
          barcode: instruction.barcode,
          status: instruction.status,
          patient_id: instruction.patient_id
        }
      });
    }

    return res.json({
      success: true,
      verified: true,
      message: '✅ Το φάρμακο είναι σωστό για αυτόν τον ασθενή!',
      instruction: {
        id: instruction.id,
        description: instruction.description,
        barcode: instruction.barcode,
        status: instruction.status,
        patient_id: instruction.patient_id
      }
    });

  } catch (error) {
    console.error('Error verifying barcode by ID:', error);
    res.status(500).json({ 
      success: false,
      verified: false,
      message: '❌ Σφάλμα κατά την επαλήθευση' 
    });
  }
};

// Mark instruction as completed
const completeInstruction = async (req, res) => {
  try {
    const instructionId = req.params.id;

    // First check if instruction is already completed
    const [existingInstruction] = await pool.query(
      `SELECT status FROM medical_instructions WHERE id = ?`,
      [instructionId]
    );

    if (existingInstruction.length === 0) {
      return res.status(404).json({ message: 'Instruction not found' });
    }

    if (existingInstruction[0].status === 'Completed') {
      return res.status(400).json({ 
        message: 'Η οδηγία έχει ήδη εκτελεστεί',
        alreadyCompleted: true
      });
    }

    // Update instruction status
    const [result] = await pool.query(
      `UPDATE medical_instructions 
       SET status = 'Completed', completed_at = NOW()
       WHERE id = ? AND status != 'Completed'`,
      [instructionId]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ 
        message: 'Η οδηγία δεν μπορεί να ολοκληρωθεί',
        alreadyCompleted: true
      });
    }

    res.json({
      message: 'Η οδηγία σημειώθηκε ως ολοκληρωμένη',
      instructionId: instructionId,
      success: true
    });

  } catch (error) {
    console.error('Error completing instruction:', error);
    res.status(500).json({ message: 'Server error completing instruction' });
  }
};

// Get all instructions for a patient
const getInstructionsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const [instructions] = await pool.query(
      `SELECT id, description, barcode, status, created_at, completed_at
       FROM medical_instructions
       WHERE patient_id = ?
       ORDER BY created_at DESC`,
      [patientId]
    );

    res.json(instructions);

  } catch (error) {
    console.error('Error fetching instructions:', error);
    res.status(500).json({ message: 'Server error fetching instructions' });
  }
};

// Create new medical instruction
const createInstruction = async (req, res) => {
  try {
    const { patient_id, description, barcode } = req.body;

    if (!patient_id || !description || !barcode) {
      return res.status(400).json({ message: 'Patient ID, description, and barcode are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO medical_instructions (patient_id, description, barcode) VALUES (?, ?, ?)',
      [patient_id, description, barcode]
    );

    res.status(201).json({
      message: 'Medical instruction created successfully',
      instructionId: result.insertId
    });

  } catch (error) {
    console.error('Error creating instruction:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Barcode already exists' });
    }
    res.status(500).json({ message: 'Server error creating instruction' });
  }
};

// Safety verification - Check if scanned barcode matches patient's prescribed medication
const verifySafety = async (req, res) => {
  try {
    const { patientId, barcode } = req.body;

    console.log('=== SAFETY VERIFICATION ===');
    console.log('Patient ID:', patientId);
    console.log('Barcode:', barcode);

    if (!patientId || !barcode) {
      return res.status(400).json({ 
        success: false,
        verified: false,
        safetyError: true,
        message: 'Λείπουν απαραίτητα στοιχεία για την επαλήθευση' 
      });
    }

    // Check if barcode exists for this specific patient
    const [patientInstructions] = await pool.query(
      `SELECT mi.id, mi.description, mi.barcode, mi.status, mi.patient_id,
              p.full_name as patient_name
       FROM medical_instructions mi
       JOIN patients p ON mi.patient_id = p.id
       WHERE mi.patient_id = ? AND mi.barcode = ?`,
      [patientId, barcode]
    );

    console.log('Patient instructions found:', patientInstructions.length);

    if (patientInstructions.length > 0) {
      const instruction = patientInstructions[0];
      
      // SUCCESS: Correct medication for this patient
      return res.json({
        success: true,
        verified: true,
        safetyCheck: 'PASS',
        message: '✅ ΣΩΣΤΟ ΦΑΡΜΑΚΟ - Ασφαλής για χορήγηση',
        instruction: {
          id: instruction.id,
          description: instruction.description,
          barcode: instruction.barcode,
          status: instruction.status,
          patient_id: instruction.patient_id
        },
        patient: {
          id: instruction.patient_id,
          name: instruction.patient_name
        }
      });
    }

    // Check if this barcode belongs to a different patient
    const [otherPatientInstructions] = await pool.query(
      `SELECT mi.patient_id, p.full_name as other_patient_name, mi.description
       FROM medical_instructions mi
       JOIN patients p ON mi.patient_id = p.id
       WHERE mi.barcode = ?`,
      [barcode]
    );

    if (otherPatientInstructions.length > 0) {
      const otherInstruction = otherPatientInstructions[0];
      
      // DANGER: Medication belongs to different patient
      return res.json({
        success: false,
        verified: false,
        safetyError: true,
        safetyCheck: 'FAIL_WRONG_PATIENT',
        message: `🚨 ΚΙΝΔΥΝΟΣ - Αυτό το φάρμακο ανήκει σε άλλον ασθενή: ${otherInstruction.other_patient_name}`,
        wrongPatient: {
          id: otherInstruction.patient_id,
          name: otherInstruction.other_patient_name,
          medication: otherInstruction.description
        }
      });
    }

    // Medication not found in system
    return res.json({
      success: false,
      verified: false,
      safetyError: true,
      safetyCheck: 'FAIL_NOT_FOUND',
      message: '❌ ΑΓΝΩΣΤΟ ΦΑΡΜΑΚΟ - Το barcode δεν βρέθηκε στο σύστημα'
    });

  } catch (error) {
    console.error('Error in safety verification:', error);
    res.status(500).json({ 
      success: false,
      verified: false,
      safetyError: true,
      message: '⚠️ ΣΦΑΛΜΑ ΣΥΣΤΗΜΑΤΟΣ - Επικοινωνήστε με την τεχνική υποστήριξη'
    });
  }
};

// Get all medical instructions with patient data (MongoDB version)
const getAllInstructionsMongo = async (req, res) => {
  try {
    const instructions = await MedicalInstruction.find({})
      .populate('patient_id', 'full_name amka blood_type')
      .sort({ createdAt: -1 });

    res.json(instructions);
  } catch (error) {
    console.error('Error fetching instructions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Σφάλμα κατά την ανάκτηση των ιατρικών οδηγιών' 
    });
  }
};

// Update instruction status (MongoDB version)
const updateInstructionMongo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If completing the instruction, set completed_at
    if (updates.status === 'Completed') {
      updates.completed_at = new Date();
    }

    const instruction = await MedicalInstruction.findByIdAndUpdate(
      id, 
      updates, 
      { new: true }
    ).populate('patient_id', 'full_name amka blood_type');

    if (!instruction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Η ιατρική οδηγία δεν βρέθηκε' 
      });
    }

    res.json({ 
      success: true, 
      instruction,
      message: 'Η ιατρική οδηγία ενημερώθηκε επιτυχώς' 
    });
  } catch (error) {
    console.error('Error updating instruction:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Σφάλμα κατά την ενημέρωση της ιατρικής οδηγίας' 
    });
  }
};

// Get instruction by ID with patient data (MongoDB version)
const getInstructionByIdMongo = async (req, res) => {
  try {
    const { id } = req.params;

    const instruction = await MedicalInstruction.findById(id)
      .populate('patient_id', 'full_name amka blood_type');

    if (!instruction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Η ιατρική οδηγία δεν βρέθηκε' 
      });
    }

    res.json({ success: true, instruction });
  } catch (error) {
    console.error('Error fetching instruction:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Σφάλμα κατά την ανάκτηση της ιατρικής οδηγίας' 
    });
  }
};

module.exports = {
  verifyBarcode,
  verifyBarcodeById,
  completeInstruction,
  getInstructionsByPatient,
  createInstruction,
  verifySafety,
  // MongoDB versions
  getAllInstructionsMongo,
  updateInstructionMongo,
  getInstructionByIdMongo
};
