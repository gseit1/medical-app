const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { Patient } = require('./models');

async function testPatientAPI() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the specific patient mentioned in the log
    const patient = await Patient.findOne({ full_name: 'Αλέξανδρος Βασιλείου' });
    
    if (patient) {
      console.log('🔍 Found patient:', patient.full_name);
      console.log('📷 Profile image:', patient.profile_image);
      console.log('🆔 Patient ID:', patient._id);
      console.log('📊 All patient data:', {
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
      });
    } else {
      console.log('❌ Patient not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the test
testPatientAPI();