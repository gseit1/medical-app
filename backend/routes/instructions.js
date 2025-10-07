const express = require('express');
const router = express.Router();
const {
  verifyBarcode,
  completeInstruction,
  getInstructionsByPatient,
  createInstruction
} = require('../controllers/instructionController');
const { authenticateToken, requireNurse } = require('../middleware/auth');

// POST /api/instructions/verify-barcode - Verify barcode for patient
router.post('/verify-barcode', authenticateToken, verifyBarcode);

// PATCH /api/instructions/:id/complete - Mark instruction as completed
router.patch('/:id/complete', authenticateToken, completeInstruction);

// GET /api/instructions/patient/:patientId - Get all instructions for a patient
router.get('/patient/:patientId', authenticateToken, getInstructionsByPatient);

// POST /api/instructions - Create new instruction (nurse only)
router.post('/', authenticateToken, requireNurse, createInstruction);

module.exports = router;
