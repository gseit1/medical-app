const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const { Patient, User } = require('./models');

async function checkAndFixImages() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check patients without images
    const patientsWithoutImages = await Patient.find({ 
      $or: [
        { profile_image: null }, 
        { profile_image: { $exists: false } },
        { profile_image: '' }
      ] 
    });

    console.log(`📊 Found ${patientsWithoutImages.length} patients without profile images`);

    // Professional images for patients
    const patientImages = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
    ];

    // Update patients with images
    for (let i = 0; i < patientsWithoutImages.length; i++) {
      const patient = patientsWithoutImages[i];
      const imageUrl = patientImages[i % patientImages.length];
      
      await Patient.findByIdAndUpdate(patient._id, {
        profile_image: imageUrl
      });
      
      console.log(`🖼️  Updated ${patient.full_name} with image: ${imageUrl}`);
    }

    // Check users without images
    const usersWithoutImages = await User.find({ 
      $or: [
        { profile_image: null }, 
        { profile_image: { $exists: false } },
        { profile_image: '' }
      ] 
    });

    console.log(`📊 Found ${usersWithoutImages.length} users without profile images`);

    // Professional images for nurses
    const nurseImages = [
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1594824947235-0dc8bb5a2cce?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop&crop=face&auto=format&q=80'
    ];

    // Update users with images
    for (let i = 0; i < usersWithoutImages.length; i++) {
      const user = usersWithoutImages[i];
      let imageUrl;
      
      if (user.role === 'nurse') {
        imageUrl = nurseImages[i % nurseImages.length];
      } else {
        imageUrl = patientImages[i % patientImages.length];
      }
      
      await User.findByIdAndUpdate(user._id, {
        profile_image: imageUrl
      });
      
      console.log(`🖼️  Updated user ${user.full_name} (${user.role}) with image: ${imageUrl}`);
    }

    // Verify the updates
    const allPatients = await Patient.find().select('full_name profile_image');
    console.log('\n📸 All patients with their images:');
    allPatients.forEach(patient => {
      console.log(`${patient.full_name}: ${patient.profile_image ? '✅ Has image' : '❌ No image'}`);
    });

    const allUsers = await User.find().select('full_name role profile_image');
    console.log('\n👥 All users with their images:');
    allUsers.forEach(user => {
      console.log(`${user.full_name} (${user.role}): ${user.profile_image ? '✅ Has image' : '❌ No image'}`);
    });

  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
checkAndFixImages();