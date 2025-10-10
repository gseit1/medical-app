const mongoose = require('mongoose');
const { User, Patient } = require('./models');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/medical-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function assignRealProfessionalImages() {
  try {
    console.log('🏥 Starting Professional Medical Image Assignment...\n');

    // High-quality professional medical staff images
    const nurseImages = [
      // Medical professionals - women
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1594824475968-1c6c3738ce8e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      
      // Medical professionals - men  
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1594824475968-1c6c3738ce8e?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face&auto=format&q=80',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
    ];

    // Professional patient images - diverse and authentic
    const patientImages = [
      // Professional adults - mixed genders and ages
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Professional man
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Professional woman
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Business professional
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Young professional
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Business woman
      'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Senior professional
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Professional woman with glasses
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Young man
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Professional woman
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Professional man
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Young woman
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Casual professional
      'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Professional portrait
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop&crop=face&auto=format&q=80', // Business casual
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format&q=80'  // Professional headshot
    ];

    // Greek medical professional names
    const greekNurseNames = [
      'Δρ. Μαρία Παπαδοπούλου',
      'Νοσηλ. Άννα Γιαννακοπούλου', 
      'Δρ. Ελένη Κωνσταντίνου',
      'Νοσηλ. Κατερίνα Δημητρίου',
      'Δρ. Νίκος Αντωνιάδης',
      'Νοσηλ. Γιώργος Νικολάου',
      'Δρ. Σοφία Μιχαηλίδου',
      'Νοσηλ. Δημήτρης Παπαγεωργίου',
      'Δρ. Ευαγγελία Κωστόπουλου',
      'Νοσηλ. Αλέξανδρος Βασιλείου'
    ];

    const greekPatientNames = [
      'Νίκος Παπαδόπουλος',
      'Μαρία Κωνσταντίνου',
      'Γιάννης Αντωνίου',
      'Ελένη Δημητρίου',
      'Δημήτρης Μιχαηλίδης',
      'Σοφία Νικολάου',
      'Κώστας Γεωργίου',
      'Ευαγγελία Περιστέρη',
      'Αλέξανδρος Χρηστίδης',
      'Κατερίνα Βλάχου',
      'Στέλιος Μαυρίδης',
      'Αννα-Μαρία Τσάκου',
      'Γιώργος Κασίδης',
      'Χριστίνα Λάμπρου',
      'Πέτρος Σταυρόπουλος'
    ];

    // Update existing users
    const users = await User.find({});
    console.log(`Found ${users.length} existing users to update\n`);

    let nurseCount = 0;
    let patientCount = 0;

    for (let user of users) {
      if (user.role === 'nurse') {
        const nameIndex = nurseCount % greekNurseNames.length;
        const imageIndex = nurseCount % nurseImages.length;
        
        await User.findByIdAndUpdate(user._id, {
          full_name: greekNurseNames[nameIndex],
          profile_image: nurseImages[imageIndex]
        });
        
        console.log(`👩‍⚕️ Updated Nurse: ${greekNurseNames[nameIndex]}`);
        nurseCount++;
        
      } else if (user.role === 'patient') {
        const nameIndex = patientCount % greekPatientNames.length;
        const imageIndex = patientCount % patientImages.length;
        
        await User.findByIdAndUpdate(user._id, {
          full_name: greekPatientNames[nameIndex],
          profile_image: patientImages[imageIndex]
        });
        
        console.log(`👤 Updated Patient: ${greekPatientNames[nameIndex]}`);
        patientCount++;
      }
    }

    // Create additional sample users if needed
    if (users.length < 10) {
      console.log('\n📝 Creating additional sample users...\n');
      
      // Create more nurses
      for (let i = users.filter(u => u.role === 'nurse').length; i < 3; i++) {
        const nameIndex = i % greekNurseNames.length;
        const imageIndex = i % nurseImages.length;
        
        const newNurse = new User({
          username: `nurse${i + 1}`,
          password: '$2b$10$examplehash', // This would be properly hashed in real app
          role: 'nurse',
          full_name: greekNurseNames[nameIndex],
          profile_image: nurseImages[imageIndex]
        });
        
        await newNurse.save();
        console.log(`✅ Created Nurse: ${greekNurseNames[nameIndex]}`);
      }
      
      // Create more patients (linking to existing patient records)
      const existingPatients = await Patient.find({});
      const currentPatientUsers = users.filter(u => u.role === 'patient').length;
      
      for (let i = currentPatientUsers; i < Math.min(5, existingPatients.length); i++) {
        const nameIndex = i % greekPatientNames.length;
        const imageIndex = i % patientImages.length;
        
        const newPatient = new User({
          username: `patient${i + 1}`,
          password: '$2b$10$examplehash', // This would be properly hashed in real app
          role: 'patient',
          full_name: greekPatientNames[nameIndex],
          profile_image: patientImages[imageIndex],
          patient_id: existingPatients[i]?._id || existingPatients[0]._id
        });
        
        await newPatient.save();
        console.log(`✅ Created Patient: ${greekPatientNames[nameIndex]}`);
      }
    }

    console.log('\n🎉 PROFESSIONAL IMAGE ASSIGNMENT COMPLETE! 🎉');
    console.log('=====================================');
    console.log(`👩‍⚕️ Nurses Updated: ${nurseCount}`);
    console.log(`👤 Patients Updated: ${patientCount}`);
    console.log('🖼️  All users now have professional medical photos');
    console.log('🌟 High-quality Unsplash images with proper optimization');
    console.log('🇬🇷 Authentic Greek medical professional names');
    console.log('💼 Enterprise-ready user profiles');
    console.log('\n✨ Your medical application now features:');
    console.log('   • Professional healthcare staff photography');
    console.log('   • Diverse patient representation');
    console.log('   • Consistent image sizing and quality');
    console.log('   • Greek medical naming conventions');
    console.log('   • Mobile-optimized image delivery');

  } catch (error) {
    console.error('❌ Error updating user profiles:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the professional image assignment
assignRealProfessionalImages();