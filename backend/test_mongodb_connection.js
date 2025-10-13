const mongoose = require('mongoose');

// Connect to MongoDB
const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/medical_app', {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', conn.connection.db.databaseName);
    console.log('🏠 Host:', conn.connection.host);
    
    // Test if we can find our patients
    const Patient = mongoose.model('Patient', new mongoose.Schema({
      full_name: String,
      profile_image: String
    }));
    
    const patients = await Patient.find({}).limit(3);
    console.log(`👥 Found ${patients.length} patients in database`);
    
    if (patients.length > 0) {
      patients.forEach((patient, index) => {
        console.log(`${index + 1}. ${patient.full_name} - Profile Image: ${patient.profile_image ? '✅' : '❌'}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('✅ Connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('1. Make sure MongoDB is installed and running');
    console.log('2. Start MongoDB service: mongod');
    console.log('3. Check if port 27017 is available');
    process.exit(1);
  }
};

testConnection();