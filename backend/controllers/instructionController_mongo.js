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
    const instruction = await MedicalInstruction.findOne({
      patient_id: patientId,
      barcode: barcode
    });

    console.log('Instruction found:', instruction ? 'Yes' : 'No');

    if (!instruction) {
      // Check if barcode exists for a different patient
      const otherInstruction = await MedicalInstruction.findOne({ barcode: barcode });

      if (otherInstruction) {
        return res.json({
          success: false,
          verified: false,
          message: '❌ Το barcode ανήκει σε άλλον ασθενή!'
        });
      }

      return res.json({
        success: false,
        verified: false,
        message: '❌ Το barcode δεν βρέθηκε!'
      });
    }

    // Success - barcode matches this patient
    res.json({
      success: true,
      verified: true,
      message: '✅ Το φάρμακο είναι σωστό για αυτόν τον ασθενή!',
      instruction: {
        id: instruction._id,
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

// Verify barcode by instruction ID (for URL-based verification)
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

    // Find the specific instruction
    const instruction = await MedicalInstruction.findOne({
      _id: instructionId,
      patient_id: patientId
    });

    console.log('Instruction found:', instruction ? 'Yes' : 'No');
    if (instruction) {
      console.log('Instruction:', {
        id: instruction._id,
        description: instruction.description,
        barcode: instruction.barcode,
        status: instruction.status,
        patient_id: instruction.patient_id
      });
    }

    if (!instruction) {
      return res.json({
        success: false,
        verified: false,
        message: '❌ Η οδηγία δεν βρέθηκε'
      });
    }

    // Check if instruction is already completed
    if (instruction.status === 'Completed') {
      return res.json({
        success: false,
        verified: false,
        alreadyCompleted: true,
        message: '❌ Η οδηγία έχει εκτελεστεί',
        instruction: {
          id: instruction._id,
          description: instruction.description,
          barcode: instruction.barcode,
          status: instruction.status,
          patient_id: instruction.patient_id
        }
      });
    }

    // Success - instruction exists and is valid
    res.json({
      success: true,
      verified: true,
      message: '✅ Το φάρμακο είναι σωστό για αυτόν τον ασθενή!',
      instruction: {
        id: instruction._id,
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
    const instruction = await MedicalInstruction.findOne({
      patient_id: patientId,
      barcode: barcode
    }).populate('patient_id');

    console.log('Patient instructions found:', instruction ? 'Yes' : 'No');

    if (instruction) {
      // SUCCESS: Correct medication for this patient
      return res.json({
        success: true,
        verified: true,
        safetyCheck: 'PASS',
        message: '✅ ΣΩΣΤΟ ΦΑΡΜΑΚΟ - Ασφαλής για χορήγηση',
        instruction: {
          id: instruction._id,
          description: instruction.description,
          barcode: instruction.barcode,
          status: instruction.status,
          patient_id: instruction.patient_id
        },
        patient: {
          id: instruction.patient_id._id,
          name: instruction.patient_id.full_name
        }
      });
    }

    // Check if this barcode belongs to a different patient
    const otherInstruction = await MedicalInstruction.findOne({ barcode }).populate('patient_id');

    if (otherInstruction) {
      // DANGER: Medication belongs to different patient
      return res.json({
        success: false,
        verified: false,
        safetyError: true,
        safetyCheck: 'FAIL_WRONG_PATIENT',
        message: `🚨 ΚΙΝΔΥΝΟΣ - Αυτό το φάρμακο ανήκει σε άλλον ασθενή: ${otherInstruction.patient_id.full_name}`,
        wrongPatient: {
          id: otherInstruction.patient_id._id,
          name: otherInstruction.patient_id.full_name,
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

// Mark instruction as completed
const completeInstruction = async (req, res) => {
  try {
    const instructionId = req.params.id;

    // First check if instruction exists and is not already completed
    const instruction = await MedicalInstruction.findById(instructionId);

    if (!instruction) {
      return res.status(404).json({ message: 'Instruction not found' });
    }

    if (instruction.status === 'Completed') {
      return res.status(400).json({ 
        message: 'Η οδηγία έχει ήδη εκτελεστεί',
        alreadyCompleted: true
      });
    }

    // Update instruction status
    const updatedInstruction = await MedicalInstruction.findByIdAndUpdate(
      instructionId,
      { 
        status: 'Completed',
        completed_at: new Date()
      },
      { new: true }
    );

    if (!updatedInstruction) {
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
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Instruction not found' });
    }
    res.status(500).json({ message: 'Server error completing instruction' });
  }
};

// Get all instructions for a patient
const getInstructionsByPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    const instructions = await MedicalInstruction.find({ patient_id: patientId })
      .sort({ createdAt: -1 });

    const formattedInstructions = instructions.map(inst => ({
      id: inst._id,
      description: inst.description,
      barcode: inst.barcode,
      status: inst.status,
      created_at: inst.createdAt,
      completed_at: inst.completed_at
    }));

    res.json(formattedInstructions);
  } catch (error) {
    console.error('Error fetching instructions:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid patient ID' });
    }
    res.status(500).json({ message: 'Server error fetching instructions' });
  }
};

// Create new instruction
const createInstruction = async (req, res) => {
  try {
    const { patient_id, description, barcode } = req.body;

    if (!patient_id || !description || !barcode) {
      return res.status(400).json({ message: 'Patient ID, description, and barcode are required' });
    }

    const newInstruction = new MedicalInstruction({
      patient_id,
      description,
      barcode
    });

    const savedInstruction = await newInstruction.save();

    res.status(201).json({
      message: 'Medical instruction created successfully',
      instructionId: savedInstruction._id
    });

  } catch (error) {
    console.error('Error creating instruction:', error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Barcode already exists' });
    }
    res.status(500).json({ message: 'Server error creating instruction' });
  }
};

module.exports = {
  verifyBarcode,
  verifyBarcodeById,
  verifySafety,
  completeInstruction,
  getInstructionsByPatient,
  createInstruction
};