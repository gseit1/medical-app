const mongoose = require('mongoose');
const { Patient, User, MedicalInstruction } = require('./models');

// Connect to MongoDB and completely clear all data
const clearDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect('mongodb://127.0.0.1:27017/medical_app');
    console.log('✅ Connected to MongoDB');
    
    // Show current counts
    const patientCount = await Patient.countDocuments();
    const userCount = await User.countDocuments();
    const instructionCount = await MedicalInstruction.countDocuments();
    
    console.log(`\n📊 Current database contents:`);
    console.log(`   Patients: ${patientCount}`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Medical Instructions: ${instructionCount}`);
    
    // Completely drop all collections
    console.log('\n🗑️ Dropping all collections...');
    
    try {
      await Patient.collection.drop();
      console.log('   ✅ Patients collection dropped');
    } catch (e) {
      console.log('   ℹ️ Patients collection was already empty');
    }
    
    try {
      await User.collection.drop();
      console.log('   ✅ Users collection dropped');
    } catch (e) {
      console.log('   ℹ️ Users collection was already empty');
    }
    
    try {
      await MedicalInstruction.collection.drop();
      console.log('   ✅ Medical Instructions collection dropped');
    } catch (e) {
      console.log('   ℹ️ Medical Instructions collection was already empty');
    }
    
    // Verify everything is cleared
    const finalPatientCount = await Patient.countDocuments();
    const finalUserCount = await User.countDocuments();
    const finalInstructionCount = await MedicalInstruction.countDocuments();
    
    console.log(`\n✅ Database cleared! Final counts:`);
    console.log(`   Patients: ${finalPatientCount}`);
    console.log(`   Users: ${finalUserCount}`);
    console.log(`   Medical Instructions: ${finalInstructionCount}`);
    
    await mongoose.connection.close();
    console.log('\n🔄 Database cleared successfully! Ready for fresh seeding.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database clearing failed:', error.message);
    process.exit(1);
  }
};

clearDatabase();