const mongoose = require('mongoose');
const { Patient, User, MedicalInstruction } = require('./models');

// Connect to MongoDB and check current data
const checkDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect('mongodb://127.0.0.1:27017/medical_app');
    console.log('✅ Connected to MongoDB');
    
    // Check all patients in database
    const patients = await Patient.find({}).select('full_name amka medical_history profile_image');
    console.log(`\n📊 Found ${patients.length} patients in database:`);
    
    patients.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.full_name} (AMKA: ${patient.amka})`);
      console.log(`   Medical History: ${patient.medical_history || 'None'}`);
      console.log(`   Profile Image: ${patient.profile_image ? '✅ Has image' : '❌ No image'}`);
      console.log('');
    });
    
    // Check users
    const users = await User.find({}).select('username full_name role');
    console.log(`\n👥 Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.username} (${user.full_name}) - Role: ${user.role}`);
    });
    
    // Check medical instructions
    const instructions = await MedicalInstruction.find({}).populate('patient_id', 'full_name');
    console.log(`\n💊 Found ${instructions.length} medical instructions:`);
    instructions.forEach((inst, index) => {
      console.log(`${index + 1}. Patient: ${inst.patient_id?.full_name || 'Unknown'} - ${inst.description.substring(0, 50)}...`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Database check completed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    process.exit(1);
  }
};

checkDatabase();