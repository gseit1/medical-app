const mongoose = require('mongoose');

// Patient Schema
const patientSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  amka: {
    type: String,
    required: true,
    unique: true
  },
  afm: {
    type: String,
    required: true,
    unique: true
  },
  blood_type: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Άνδρας', 'Γυναίκα'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  profile_image: {
    type: String,
    default: null
  },
  medical_history: {
    type: String,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Medical Instruction Schema
const medicalInstructionSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  barcode: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  completed_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Referral Schema
const referralSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  doctor_name: {
    type: String,
    required: true
  },
  referral_date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// User Schema (for authentication)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  full_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['nurse', 'patient'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  profile_image: {
    type: String,
    default: null
  },
  department: {
    type: String,
    default: null
  },
  specialization: {
    type: String,
    default: null
  },
  employee_id: {
    type: String,
    unique: true,
    sparse: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: function() {
      return this.role === 'patient';
    }
  }
}, {
  timestamps: true
});

// Create Models
const Patient = mongoose.model('Patient', patientSchema);
const MedicalInstruction = mongoose.model('MedicalInstruction', medicalInstructionSchema);
const Referral = mongoose.model('Referral', referralSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
  Patient,
  MedicalInstruction,
  Referral,
  User
};