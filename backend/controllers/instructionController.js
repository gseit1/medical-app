const { pool } = require('../config/database');

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
    const [instructions] = await pool.query(
      `SELECT id, description, barcode, status, patient_id
       FROM medical_instructions
       WHERE patient_id = ? AND barcode = ?`,
      [patientId, barcode]
    );

    console.log('Instructions found:', instructions.length);
    if (instructions.length > 0) {
      console.log('Instruction:', instructions[0]);
    }

    if (instructions.length === 0) {
      // Check if barcode exists for a different patient
      const [otherInstructions] = await pool.query(
        `SELECT patient_id FROM medical_instructions WHERE barcode = ?`,
        [barcode]
      );

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

// Mark instruction as completed
const completeInstruction = async (req, res) => {
  try {
    const instructionId = req.params.id;

    // Update instruction status
    const [result] = await pool.query(
      `UPDATE medical_instructions 
       SET status = 'Ολοκληρωμένη', completed_at = NOW()
       WHERE id = ?`,
      [instructionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Instruction not found' });
    }

    res.json({
      message: 'Instruction marked as completed',
      instructionId: instructionId
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

module.exports = {
  verifyBarcode,
  completeInstruction,
  getInstructionsByPatient,
  createInstruction
};
