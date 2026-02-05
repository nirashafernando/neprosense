import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donor from '../src/models/Donor.js';
import Recipient from '../src/models/Recipient.js';
import PredictionRequest from '../src/models/PredictionRequest.js';
import PredictionResult from '../src/models/PredictionResult.js';
import BatchPredictionRequest from '../src/models/BatchPredictionRequest.js';

dotenv.config();

async function clearDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all collections
    console.log('\n🗑️  Clearing database...');
    
    await Donor.deleteMany({});
    console.log('   ✓ Cleared Donors collection');
    
    await Recipient.deleteMany({});
    console.log('   ✓ Cleared Recipients collection');
    
    await PredictionRequest.deleteMany({});
    console.log('   ✓ Cleared PredictionRequests collection');
    
    await PredictionResult.deleteMany({});
    console.log('   ✓ Cleared PredictionResults collection');
    
    await BatchPredictionRequest.deleteMany({});
    console.log('   ✓ Cleared BatchPredictionRequests collection');

    console.log('\n✅ Database cleared successfully!');
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
