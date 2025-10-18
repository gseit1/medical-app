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
  barcode: {
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
  medication_name: {
    type: String,
    default: null
  },
  dosage: {
    type: String,
    default: null
  },
  frequency: {
    type: String,
    default: null
  },
  duration: {
    type: String,
    default: null
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
  icd10_code: {
    type: String,
    default: null
  },
  icd10_description: {
    type: String,
    default: null
  },
  instructions: {
    type: String,
    default: null
  },
  drug_interactions: [{
    _id: mongoose.Schema.Types.ObjectId,
    interaction_with: String,
    severity: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      default: 'Moderate'
    },
    description: String,
    recommendation: String
  }],
  safety_alerts: [{
    _id: mongoose.Schema.Types.ObjectId,
    alert_type: {
      type: String,
      enum: ['Contraindication', 'Warning', 'Caution', 'Info'],
      default: 'Info'
    },
    severity: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Critical'],
      default: 'Moderate'
    },
    message: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  completed_at: {
    type: Date,
    default: null
  },
  completed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  completed_by_name: {
    type: String,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
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