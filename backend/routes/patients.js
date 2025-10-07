const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient
} = require('../controllers/patientController');
const {
  authenticateToken,
  requireNurse,
  authorizePatientAccess
} = require('../middleware/auth');

// GET /api/patients - Get all patients (nurse only)
router.get('/', authenticateToken, requireNurse, getAllPatients);

// GET /api/patients/:id - Get specific patient (nurse or the patient themselves)
router.get('/:id', authenticateToken, authorizePatientAccess, getPatientById);

// POST /api/patients - Create new patient (nurse only)
router.post('/', authenticateToken, requireNurse, createPatient);

module.exports = router;
