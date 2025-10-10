const express = require('express');
const router = express.Router();
const {
  verifyBarcode,
  verifyBarcodeById,
  completeInstruction,
  getInstructionsByPatient,
  createInstruction,
  verifySafety,
  checkMedicationCompleted
} = require('../controllers/instructionController_mongo');
const { 
  getAllInstructionsMongo,
  updateInstructionMongo,
  getInstructionByIdMongo
} = require('../controllers/instructionController');
const { authenticateToken, requireNurse } = require('../middleware/auth');

// POST /api/instructions/verify-barcode - Verify barcode for patient
router.post('/verify-barcode', authenticateToken, verifyBarcode);

// POST /api/instructions/verify-by-id - Verify barcode by instruction ID (public access for URL scanning)
router.post('/verify-by-id', verifyBarcodeById);

// POST /api/instructions/verify-safety - Safety verification: check if barcode matches patient's medication
router.post('/verify-safety', authenticateToken, verifySafety);

// POST /api/instructions/check-completed - Check if medication is already completed
router.post('/check-completed', authenticateToken, checkMedicationCompleted);

// PATCH /api/instructions/:id/complete - Mark instruction as completed
router.patch('/:id/complete', authenticateToken, completeInstruction);

// GET /api/instructions/patient/:patientId - Get all instructions for a patient
router.get('/patient/:patientId', authenticateToken, getInstructionsByPatient);

// POST /api/instructions - Create new instruction (nurse only)
router.post('/', authenticateToken, requireNurse, createInstruction);

// MongoDB-based endpoints for the new medical instructions view
// GET /api/instructions - Get all instructions with patient data (nurse only)
router.get('/', authenticateToken, requireNurse, getAllInstructionsMongo);

// GET /api/instructions/:id - Get specific instruction by ID
router.get('/:id', authenticateToken, getInstructionByIdMongo);

// PUT /api/instructions/:id - Update instruction (nurse only)
router.put('/:id', authenticateToken, requireNurse, updateInstructionMongo);

module.exports = router;
