const express = require('express');
const router = express.Router();
const {
  verifyBarcode,
  verifyBarcodeById,
  completeInstruction,
  getAllInstructions,
  getInstructionsByPatient,
  createInstruction,
  verifySafety,
  checkMedicationCompleted,
  resetAllMedicationsStatus
} = require('../controllers/instructionController_mongo');
const { authenticateToken, requireNurse } = require('../middleware/auth');

// GET /api/instructions - Get all instructions (dashboard)
router.get('/', authenticateToken, getAllInstructions);

// GET /api/instructions/patient/:patientId - Get all instructions for a patient (MUST BE AFTER /)
router.get('/patient/:patientId', authenticateToken, getInstructionsByPatient);

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

// POST /api/instructions - Create new instruction (nurse only)
router.post('/', authenticateToken, requireNurse, createInstruction);

// POST /api/instructions/reset-all-status - Reset all medications to Pending (for testing)
router.post('/reset-all-status', authenticateToken, requireNurse, resetAllMedicationsStatus);

module.exports = router;
