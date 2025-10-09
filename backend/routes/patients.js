const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getAllPatientsWithInstructions,
  getPatientById,
  createPatient,
  getPatientPublicInfo
} = require('../controllers/patientController_mongo');
const {
  authenticateToken,
  requireNurse,
  authorizePatientAccess
} = require('../middleware/auth');

// GET /api/patients - Get all patients (nurse only)
router.get('/', authenticateToken, requireNurse, getAllPatients);

// GET /api/patients/with-instructions - Get all patients with medical instructions (nurse only)
router.get('/with-instructions', authenticateToken, requireNurse, getAllPatientsWithInstructions);

// GET /api/patients/:id - Get specific patient (nurse or the patient themselves)
router.get('/:id', authenticateToken, authorizePatientAccess, getPatientById);

// POST /api/patients - Create new patient (nurse only)
router.post('/', authenticateToken, requireNurse, createPatient);

// GET /api/patients/:id/public - Get basic patient info (public access for barcode verification)
router.get('/:id/public', getPatientPublicInfo);

module.exports = router;
