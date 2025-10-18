const { Patient, MedicalInstruction, Referral } = require('../models');

// Get all patients with their medical instructions and referrals
const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .sort({ createdAt: -1 });

    // Manually populate medical instructions and referrals since they reference patient_id
    const patientsWithData = await Promise.all(patients.map(async (patient) => {
      const medicalInstructions = await MedicalInstruction.find({ patient_id: patient._id });
      const referrals = await Referral.find({ patient_id: patient._id });
      
      return {
        _id: patient._id,
        id: patient._id,
        full_name: patient.full_name,
        amka: patient.amka,
        afm: patient.afm,
        barcode: patient.barcode,
        blood_type: patient.blood_type,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        profile_image: patient.profile_image,
        medical_history: patient.medical_history,
        created_at: patient.createdAt,
        updated_at: patient.updatedAt,
        medical_instructions: medicalInstructions.map(inst => ({
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
          doctor_name: ref.doctor_name,
          referral_date: ref.referral_date,
          created_at: ref.createdAt
        }))
      };
    }));

    res.json(patientsWithData);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Server error fetching patients' });
  }
};

// Get all patients with medical instructions (for barcode generator)
const getAllPatientsWithInstructions = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    
    const patientsWithInstructions = await Promise.all(patients.map(async (patient) => {
      const medicalInstructions = await MedicalInstruction.find({ patient_id: patient._id });
      
      return {
        _id: patient._id,
        id: patient._id,
        full_name: patient.full_name,
        amka: patient.amka,
        afm: patient.afm,
        barcode: patient.barcode,
        blood_type: patient.blood_type,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
        profile_image: patient.profile_image,
        medical_history: patient.medical_history,
        medical_instructions: medicalInstructions.map(inst => ({
          id: inst._id,
          description: inst.description,
          barcode: inst.barcode,
          status: inst.status,
          created_at: inst.createdAt,
          completed_at: inst.completed_at
        }))
      };
    }));

    res.json(patientsWithInstructions);
  } catch (error) {
    console.error('Error fetching patients with instructions:', error);
    res.status(500).json({ message: 'Server error fetching patients with instructions' });
  }
};

// Get single patient by ID
const getPatientById = async (req, res) => {
  try {
    const patientId = req.params.id;
    
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    const medicalInstructions = await MedicalInstruction.find({ patient_id: patientId });
    const referrals = await Referral.find({ patient_id: patientId });

    const patientData = {
      _id: patient._id,
      id: patient._id,
      full_name: patient.full_name,
      amka: patient.amka,
      afm: patient.afm,
      barcode: patient.barcode,
      blood_type: patient.blood_type,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      profile_image: patient.profile_image,
      medical_history: patient.medical_history,
      created_at: patient.createdAt,
      updated_at: patient.updatedAt,
      medical_instructions: medicalInstructions.map(inst => ({
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
        doctor_name: ref.doctor_name,
        referral_date: ref.referral_date,
        created_at: ref.createdAt
      }))
    };

    res.json(patientData);
  } catch (error) {
    console.error('Error fetching patient:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(500).json({ message: 'Server error fetching patient' });
  }
};

// Get patient public info (minimal data for verification)
const getPatientPublicById = async (req, res) => {
  try {
    const patientId = req.params.id;
    
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return only basic public information
    const publicData = {
      id: patient._id,
      full_name: patient.full_name,
      amka: patient.amka
    };

    res.json(publicData);
  } catch (error) {
    console.error('Error fetching patient public info:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.status(500).json({ message: 'Server error fetching patient public info' });
  }
};

// Create a new patient (for testing/admin purposes)
const createPatient = async (req, res) => {
  try {
    const { full_name, amka, afm, blood_type } = req.body;
    
    // Validate required fields
    if (!full_name || !amka) {
      return res.status(400).json({ message: 'Full name and AMKA are required' });
    }
    
    // Check if patient with same AMKA already exists
    const existingPatient = await Patient.findOne({ amka });
    if (existingPatient) {
      return res.status(409).json({ message: 'Patient with this AMKA already exists' });
    }
    
    const newPatient = new Patient({
      full_name,
      amka,
      afm: afm || null,
      blood_type: blood_type || null
    });
    
    const savedPatient = await newPatient.save();
    
    res.status(201).json({
      message: 'Patient created successfully',
      patient: {
        id: savedPatient._id,
        full_name: savedPatient.full_name,
        amka: savedPatient.amka,
        afm: savedPatient.afm,
        blood_type: savedPatient.blood_type,
        created_at: savedPatient.createdAt
      }
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ message: 'Server error creating patient' });
  }
};

module.exports = {
  getAllPatients,
  getAllPatientsWithInstructions,
  getPatientById,
  getPatientPublicById,
  createPatient
};