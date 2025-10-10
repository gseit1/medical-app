const mongoose = require('mongoose');

// Patient Schema
const patientSchema = new mongoose.Schema({
  full_name: {
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
  profile_image: {
    type: String,
    default: null
  },
  age: {
    type: Number,
    required: false
  },
  gender: {
    type: String,
    enum: ['Άνδρας', 'Γυναίκα', 'Άλλο'],
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
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
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  completed_at: {
    type: Date,
    default: null
  },
  // Enhanced medication fields
  icd10_code: {
    type: String,
    required: false
  },
  icd10_description: {
    type: String,
    required: false
  },
  medication_name: {
    type: String,
    required: false
  },
  dosage: {
    type: String,
    required: false
  },
  frequency: {
    type: String,
    required: false
  },
  duration: {
    type: String,
    required: false
  },
  instructions: {
    type: String,
    required: false
  },
  drug_interactions: [{
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
    alert_type: {
      type: String,
      enum: ['Contraindication', 'Warning', 'Caution', 'Info']
    },
    message: String,
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    }
  }]
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
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['nurse', 'patient'],
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: function() {
      return this.role === 'patient';
    }
  },
  profile_image: {
    type: String,
    default: null
  },
  full_name: {
    type: String,
    required: true
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