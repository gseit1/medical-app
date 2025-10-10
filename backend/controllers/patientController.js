const { Patient, MedicalInstruction } = require('../models');

// Get all patients (nurse only)
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({})
      .select('full_name amka afm blood_type profile_image age gender diagnosis admission_date room_number bed_number condition vital_signs medications allergies emergency_contact created_at')
      .sort({ full_name: 1 });

    res.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error fetching patients' });
  }
};

// Get all patients with their medical instructions (for barcode generator)
const getAllPatientsWithInstructions = async (req, res) => {
  try {
    const patients = await Patient.find({})
      .select('full_name amka afm blood_type profile_image age gender diagnosis admission_date room_number bed_number condition vital_signs medications allergies emergency_contact created_at')
      .sort({ full_name: 1 });

    // Get medical instructions for each patient
    const patientsWithInstructions = await Promise.all(
      patients.map(async (patient) => {
        const instructions = await MedicalInstruction.find({ patient_id: patient._id })
          .sort({ created_at: -1 });
        
        return {
          ...patient.toObject(),
          medical_instructions: instructions
        };
      })
    );

    res.json(patientsWithInstructions);
  } catch (error) {
    console.error('Error fetching patients with instructions:', error);
    res.status(500).json({ message: 'Server error fetching patients with instructions' });
  }
};

// Get single patient with full details
const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;

    // Get patient basic info
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get medical instructions
    const instructions = await MedicalInstruction.find({ patient_id: patientId })
      .sort({ created_at: -1 });

    // Combine all data
    res.json({
      ...patient.toObject(),
      medical_instructions: instructions
    });

  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Server error fetching patient details' });
  }
};

// Create new patient
const createPatient = async (req, res) => {
  try {
    const { full_name, amka, afm, blood_type, age, gender, diagnosis, room_number, bed_number } = req.body;

    // Validate required fields
    if (!full_name || !amka || !afm) {
      return res.status(400).json({ message: 'Full name, AMKA, and AFM are required' });
    }

    // Create new patient
    const newPatient = new Patient({
      full_name,
      amka,
      afm,
      blood_type,
      age,
      gender,
      diagnosis,
      room_number,
      bed_number,
      admission_date: new Date(),
      condition: 'stable',
      profile_image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
    });

    const savedPatient = await newPatient.save();

    res.status(201).json({
      message: 'Patient created successfully',
      patientId: savedPatient._id
    });

  } catch (error) {
    console.error('Error creating patient:', error);
    if (error.code === 11000) {
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
    const patient = await Patient.findById(patientId)
      .select('full_name amka profile_image');

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
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
