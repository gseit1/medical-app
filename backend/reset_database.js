const { MongoClient } = require('mongodb');
require('dotenv').config();

// More aggressive database reset
const resetDatabase = async () => {
  let client;
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    
    // Use MongoDB Atlas URI from .env
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
    console.log('📍 Using MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
    
    // Connect directly using MongoClient for more control
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    const db = client.db('medical_app');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📊 Found ${collections.length} collections:`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    
    // Delete all documents from each collection instead of dropping database
    console.log('\n�️ Clearing all documents from collections...');
    
    for (const col of collections) {
      const result = await db.collection(col.name).deleteMany({});
      console.log(`   ✅ ${col.name}: Deleted ${result.deletedCount} documents`);
    }
    
    // Verify collections are empty
    console.log('\n📊 Verifying collections are empty:');
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`   - ${col.name}: ${count} documents`);
    }
    
    console.log('\n🎉 Database completely cleared! Ready for fresh seeding.');
    
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
};

resetDatabase();