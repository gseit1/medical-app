const mongoose = require('mongoose');
const { Patient } = require('./models');

const countPatients = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/medical_app');
    
    const count = await Patient.countDocuments();
    console.log(`\n📊 Total patients in database: ${count}`);
    
    const patients = await Patient.find({}).select('full_name amka profile_image');
    console.log('\n👥 Patient list:');
    patients.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.full_name} (AMKA: ${patient.amka})`);
      console.log(`   Image: ${patient.profile_image ? '✅ Has professional image' : '❌ No image'}`);
    });
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

countPatients();