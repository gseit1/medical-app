const express = require('express');
const router = express.Router();
const {
  verifyBarcode,
  getPatientInstructions,
  createInstruction,
  updateInstructionStatus,
  getAllInstructions,
  getInstructionById
} = require('../controllers/instructionController');
const { authenticateToken, requireNurse } = require('../middleware/auth');

// POST /api/instructions/verify-barcode - Verify barcode for patient
router.post('/verify-barcode', authenticateToken, verifyBarcode);

// GET /api/instructions/patient/:patientId - Get all instructions for a patient
router.get('/patient/:patientId', authenticateToken, getPatientInstructions);

// POST /api/instructions - Create new instruction (nurse only)
router.post('/', authenticateToken, requireNurse, createInstruction);

// GET /api/instructions - Get all instructions with patient data (nurse only)
router.get('/', authenticateToken, requireNurse, getAllInstructions);

// GET /api/instructions/:instructionId - Get specific instruction by ID
router.get('/:instructionId', authenticateToken, getInstructionById);

// PUT /api/instructions/:instructionId/status - Update instruction status (nurse only)
router.put('/:instructionId/status', authenticateToken, requireNurse, updateInstructionStatus);

module.exports = router;