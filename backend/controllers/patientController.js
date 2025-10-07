const { pool } = require('../config/database');

// Get all patients (nurse only)
const getAllPatients = async (req, res) => {
  try {
    const [patients] = await pool.query(`
      SELECT id, full_name, amka, afm, blood_type, created_at
      FROM patients
      ORDER BY full_name
    `);

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error fetching patients' });
  }
};

// Get single patient with full details
const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Get patient basic info
    const [patients] = await pool.query(
      'SELECT * FROM patients WHERE id = ?',
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const patient = patients[0];

    // Get medical instructions
    const [instructions] = await pool.query(
      `SELECT id, description, barcode, status, created_at, completed_at
       FROM medical_instructions
       WHERE patient_id = ?
       ORDER BY created_at DESC`,
      [patientId]
    );

    // Get referrals
    const [referrals] = await pool.query(
      `SELECT id, description, referral_date, doctor_name, created_at
       FROM referrals
       WHERE patient_id = ?
       ORDER BY referral_date DESC`,
      [patientId]
    );

    // Combine all data
    res.json({
      ...patient,
      medical_instructions: instructions,
      referrals: referrals
    });

  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error fetching patient details' });
  }
};

// Create new patient
const createPatient = async (req, res) => {
  try {
    const { full_name, amka, afm, blood_type } = req.body;

    // Validate required fields
    if (!full_name || !amka || !afm) {
      return res.status(400).json({ message: 'Full name, AMKA, and AFM are required' });
    }

    // Insert patient
    const [result] = await pool.query(
      'INSERT INTO patients (full_name, amka, afm, blood_type) VALUES (?, ?, ?, ?)',
      [full_name, amka, afm, blood_type]
    );

    res.status(201).json({
      message: 'Patient created successfully',
      patientId: result.insertId
    });

  } catch (error) {
    console.error('Error creating patient:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'AMKA or AFM already exists' });
    }
    res.status(500).json({ message: 'Server error creating patient' });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient
};
