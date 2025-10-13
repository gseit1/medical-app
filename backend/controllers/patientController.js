const { Patient, User } = require('../models');

// Get all patients (nurse only)
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select('_id full_name name amka afm blood_type age gender phone profile_image medical_history createdAt')
      .sort({ full_name: 1 });

    const formattedPatients = patients.map(patient => ({
      id: patient._id,
      full_name: patient.full_name,
      name: patient.name || patient.full_name,
      amka: patient.amka,
      afm: patient.afm,
      blood_type: patient.blood_type,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      profile_image: patient.profile_image,
      medical_history: patient.medical_history,
      created_at: patient.createdAt
    }));

    res.json({ 
      success: true, 
      patients: formattedPatients 
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching patients' 
    });
  }
};

// Get all patients with their medical instructions (for barcode generator)
const getAllPatientsWithInstructions = async (req, res) => {
  try {
    const { MedicalInstruction } = require('../models');
    
    const patients = await Patient.find()
      .select('_id full_name name amka afm blood_type age gender phone profile_image medical_history createdAt')
      .sort({ full_name: 1 });

    // Get medical instructions for each patient
    const patientsWithInstructions = await Promise.all(
      patients.map(async (patient) => {
        const instructions = await MedicalInstruction.find({ patient_id: patient._id })
          .select('_id description barcode status createdAt completed_at')
          .sort({ createdAt: -1 });
        
        return {
          id: patient._id,
          full_name: patient.full_name,
          name: patient.name || patient.full_name,
          amka: patient.amka,
          afm: patient.afm,
          blood_type: patient.blood_type,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          profile_image: patient.profile_image,
          medical_history: patient.medical_history,
          created_at: patient.createdAt,
          medical_instructions: instructions.map(inst => ({
            id: inst._id,
            description: inst.description,
            barcode: inst.barcode,
            status: inst.status,
            created_at: inst.createdAt,
            completed_at: inst.completed_at
          }))
        };
      })
    );

    res.json({
      success: true,
      patients: patientsWithInstructions
    });
  } catch (error) {
    console.error('Error fetching patients with instructions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching patients with instructions' 
    });
  }
};

// Get single patient with full details
const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    const { MedicalInstruction, Referral } = require('../models');

    // Get patient basic info
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Patient not found' 
      });
    }

    // Get medical instructions
    const instructions = await MedicalInstruction.find({ patient_id: patientId })
      .select('_id description barcode status createdAt completed_at')
      .sort({ createdAt: -1 });

    // Get referrals
    const referrals = await Referral.find({ patient_id: patientId })
      .select('_id description referral_date doctor_name createdAt')
      .sort({ referral_date: -1 });

    // Combine all data
    const responseData = {
      id: patient._id,
      full_name: patient.full_name,
      name: patient.name || patient.full_name,
      amka: patient.amka,
      afm: patient.afm,
      blood_type: patient.blood_type,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      profile_image: patient.profile_image,
      medical_history: patient.medical_history,
      created_at: patient.createdAt,
      medical_instructions: instructions.map(inst => ({
        id: inst._id,
        description: inst.description,
        barcode: inst.barcode,
        status: inst.status,
        created_at: inst.createdAt,
        completed_at: inst.completed_at
      })),
      referrals: referrals.map(ref => ({
        id: ref._id,
        description: ref.description,
        referral_date: ref.referral_date,
        doctor_name: ref.doctor_name,
        created_at: ref.createdAt
      }))
    };

    res.json({
      success: true,
      patient: responseData
    });

  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching patient details' 
    });
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

// Get basic patient info (public access for barcode verification)
const getPatientPublicInfo = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Get only basic patient info for public access
    const [patients] = await pool.query(
      'SELECT id, full_name, amka FROM patients WHERE id = ?',
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patients[0]);
  } catch (error) {
    console.error('Error fetching patient public info:', error);
    res.status(500).json({ message: 'Server error fetching patient info' });
  }
};

module.exports = {
  getAllPatients,
  getAllPatientsWithInstructions,
  getPatientById,
  createPatient,
  getPatientPublicInfo
};
