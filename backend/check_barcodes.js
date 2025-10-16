const mongoose = require('mongoose');
const { Patient } = require('./models');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical_app';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function checkBarcodes() {
  try {
    const patients = await Patient.find().select('full_name barcode amka');
    console.log('\n📋 Patients in Database:\n');
    
    if (patients.length === 0) {
      console.log('❌ No patients found in database!');
    } else {
      patients.forEach((p, index) => {
        console.log(`${index + 1}. ${p.full_name}`);
        console.log(`   AMKA: ${p.amka}`);
        console.log(`   Barcode: ${p.barcode || '❌ NO BARCODE'}`);
        console.log('');
      });
    }
    
    const withBarcodes = patients.filter(p => p.barcode);
    console.log(`\n✅ Total patients: ${patients.length}`);
    console.log(`✅ Patients with barcodes: ${withBarcodes.length}`);
    console.log(`❌ Patients without barcodes: ${patients.length - withBarcodes.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkBarcodes();
