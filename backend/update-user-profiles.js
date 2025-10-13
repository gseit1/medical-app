const mongoose = require('mongoose');
const { User } = require('./models');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medical-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function updateUsersWithProfiles() {
  try {
    // Sample profile images (using professional medical avatars)
    const profileImages = {
      nurse: [
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1594824475968-1c6c3738ce8e?w=150&h=150&fit=crop&crop=face'
      ],
      patient: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      ]
    };

    // Greek medical professional names
    const greekNames = {
      nurse: [
        'Μαρία Παπαδοπούλου',
        'Αννα Γιαννακοπούλου', 
        'Ελένη Κωνσταντίνου',
        'Κατερίνα Δημητρίου'
      ],
      patient: [
        'Νίκος Παπαδόπουλος',
        'Γιάννης Αντωνίου',
        'Δημήτρης Μιχαηλίδης',
        'Σοφία Νικολάου',
        'Ευαγγελία Περιστέρη'
      ]
    };

    // Get all users
    const users = await User.find({});
    
    console.log(`Found ${users.length} users to update`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const role = user.role;
      
      // Assign profile image and full name based on role
      const roleImages = profileImages[role] || profileImages.patient;
      const roleNames = greekNames[role] || greekNames.patient;
      
      const imageIndex = i % roleImages.length;
      const nameIndex = i % roleNames.length;
      
      await User.findByIdAndUpdate(user._id, {
        profile_image: roleImages[imageIndex],
        full_name: roleNames[nameIndex]
      });
      
      console.log(`Updated user ${user.username}: ${roleNames[nameIndex]} (${role})`);
    }

    // If no users exist, create some sample users
    if (users.length === 0) {
      console.log('No users found. Creating sample users with profiles...');
      
      // First create a nurse user (no patient_id required)
      const nurseUser = new User({
        username: 'nurse1',
        password: '$2b$10$hash1', // This would be properly hashed
        role: 'nurse',
        full_name: 'Μαρία Παπαδοπούλου',
        profile_image: profileImages.nurse[0]
      });
      await nurseUser.save();
      console.log(`Created sample user: ${nurseUser.full_name} (${nurseUser.role})`);
      
      // For patient users, we need to find existing patients or use the one we created
      const existingPatients = await mongoose.model('Patient').find({});
      if (existingPatients.length > 0) {
        const patientUser = new User({
          username: 'patient1',
          password: '$2b$10$hash2', // This would be properly hashed  
          role: 'patient',
          full_name: 'Νίκος Παπαδόπουλος',
          profile_image: profileImages.patient[0],
          patient_id: existingPatients[0]._id
        });
        await patientUser.save();
        console.log(`Created sample user: ${patientUser.full_name} (${patientUser.role})`);
      }
    }

    console.log('\n🔥 USER PROFILE UPDATE SUMMARY 🔥');
    console.log('✅ All users updated with professional profile images');
    console.log('✅ Greek names assigned to all users');
    console.log('✅ Medical professional avatars applied');
    console.log('\n👩‍⚕️ Nurses: Professional medical staff photos');
    console.log('👨‍💼 Patients: Diverse patient profile photos');
    console.log('\nProfile system ready! 🎉');

  } catch (error) {
    console.error('Error updating user profiles:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the update
updateUsersWithProfiles();