import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donor from '../src/models/Donor.js';
import Recipient from '../src/models/Recipient.js';

dotenv.config();

// Realistic donor data with varying HLA matches (matching exact schema)
const realisticDonors = [
  // PERFECT MATCH DONORS (HLA 6/6) - Should score 85-95%
  {
    donorId: 'D001',
    name: 'Sarah Johnson',
    age: 28,
    weight: 65,
    gender: 'female',
    location: 'Boston, MA',
    bloodGroup: 'O+',
    hlaTyping: 'A1,A2,B7,B8,DR3,DR4',
    bmi: 23.0,
    creatinine: 0.9,
    gfr: 110,
    systolicBP: 118,
    diastolicBP: 75,
    smoking: false,
    diabetes: false,
    hypertension: false,
    status: 'active'
  },
  {
    donorId: 'D002',
    name: 'Michael Chen',
    age: 32,
    weight: 75,
    gender: 'male',
    location: 'Seattle, WA',
    bloodGroup: 'A+',
    hlaTyping: 'A1,A2,B7,B8,DR3,DR4',
    bmi: 24.5,
    creatinine: 1.0,
    gfr: 105,
    systolicBP: 120,
    diastolicBP: 78,
    smoking: false,
    diabetes: false,
    hypertension: false,
    status: 'active'
  },
  
  // EXCELLENT MATCH DONORS (HLA 5/6) - Should score 75-85%
  {
    donorId: 'D003',
    name: 'Emily Rodriguez',
    age: 35,
    weight: 68,
    gender: 'female',
    location: 'Austin, TX',
    bloodGroup: 'B+',
    hlaTyping: 'A1,A2,B7,B35,DR3,DR4',  // 5/6 match with R001
    bmi: 25.0,
    creatinine: 0.95,
    gfr: 108,
    systolicBP: 122,
    diastolicBP: 80,
    smoking: false,
    diabetes: false,
    hypertension: false,
    status: 'active'
  },
  
  // GOOD MATCH DONORS (HLA 4/6) - Should score 65-75%
  {
    donorId: 'D004',
    name: 'David Kim',
    age: 29,
    weight: 80,
    gender: 'male',
    location: 'San Francisco, CA',
    bloodGroup: 'AB+',
    hlaTyping: 'A1,A3,B7,B8,DR3,DR7',  // 4/6 match
    bmi: 25.2,
    creatinine: 1.05,
    gfr: 100,
    systolicBP: 125,
    diastolicBP: 82,
    smoking: false,
    diabetes: false,
    hypertension: false,
    status: 'active'
  },
  
  // FAIR MATCH DONORS (HLA 3/6) - Should score 50-65%
  {
    donorId: 'D005',
    name: 'Lisa Thompson',
    age: 42,
    weight: 70,
    gender: 'female',
    location: 'Denver, CO',
    bloodGroup: 'O+',
    hlaTyping: 'A1,A3,B7,B35,DR3,DR7',  // 3/6 match
    bmi: 24.2,
    creatinine: 1.1,
    gfr: 95,
    systolicBP: 128,
    diastolicBP: 84,
    smoking: false,
    diabetes: false,
    hypertension: false,
    status: 'active'
  },
  
  // SUBOPTIMAL DONORS (various risk factors) - Should score 30-50%
  {
    donorId: 'D006',
    name: 'Robert Martinez',
    age: 50,
    weight: 90,
    gender: 'male',
    location: 'Phoenix, AZ',
    bloodGroup: 'A+',
    hlaTyping: 'A2,A3,B8,B35,DR4,DR7',  // 2/6 match
    bmi: 29.4,
    creatinine: 1.3,
    gfr: 82,
    systolicBP: 135,
    diastolicBP: 88,
    smoking: false,
    diabetes: false,
    hypertension: true,  // Risk factor
    status: 'active'
  },
  {
    donorId: 'D007',
    name: 'Jennifer Lee',
    age: 45,
    weight: 78,
    gender: 'female',
    location: 'Miami, FL',
    bloodGroup: 'B+',
    hlaTyping: 'A2,A3,B8,B44,DR1,DR7',  // 1/6 match
    bmi: 29.7,
    creatinine: 1.2,
    gfr: 88,
    systolicBP: 132,
    diastolicBP: 86,
    smoking: true,  // Risk factor
    diabetes: true,  // Risk factor
    hypertension: false,
    status: 'active'
  },
  
  // BLOOD INCOMPATIBLE DONORS - Should score <30%
  {
    donorId: 'D008',
    name: 'James Wilson',
    age: 38,
    weight: 85,
    gender: 'male',
    location: 'Chicago, IL',
    bloodGroup: 'A-',  // Incompatible with O+ recipient
    hlaTyping: 'A1,A2,B7,B8,DR3,DR4',  // 6/6 HLA match but blood incompatible
    bmi: 26.2,
    creatinine: 1.0,
    gfr: 102,
    systolicBP: 120,
    diastolicBP: 78,
    smoking: false,
    diabetes: false,
    hypertension: false,
    status: 'active'
  },
  
  // HIGH RISK DONORS
  {
    donorId: 'D009',
    name: 'Patricia Brown',
    age: 55,
    weight: 95,
    gender: 'female',
    location: 'Portland, OR',
    bloodGroup: 'AB+',
    hlaTyping: 'A3,A11,B35,B44,DR1,DR15',  // 0/6 match
    bmi: 33.6,
    creatinine: 1.5,
    gfr: 65,
    systolicBP: 145,
    diastolicBP: 92,
    smoking: true,
    diabetes: true,
    hypertension: true,
    status: 'active'
  },
  {
    donorId: 'D010',
    name: 'Christopher Davis',
    age: 60,
    weight: 88,
    gender: 'male',
    location: 'Atlanta, GA',
    bloodGroup: 'O+',
    hlaTyping: 'A11,A24,B27,B44,DR15,DR7',  // 0/6 match
    bmi: 29.7,
    creatinine: 1.4,
    gfr: 70,
    systolicBP: 140,
    diastolicBP: 90,
    smoking: false,
    diabetes: true,
    hypertension: true,
    status: 'active'
  }
];

// Realistic recipient data - 2 recipients to test with
const realisticRecipients = [
  {
    recipientId: 'R001',
    name: 'John Anderson',
    age: 34,
    weight: 72,
    gender: 'male',
    location: 'New York, NY',
    bloodGroup: 'O+',
    hlaTyping: 'A1,A2,B7,B8,DR3,DR4',  // Target HLA for perfect matches
    waitingTime: 30,  // months
    urgencyScore: 8,
    bmi: 23.5,
    creatinine: 6.5,
    gfr: 12,
    systolicBP: 130,
    diastolicBP: 85,
    diabetes: false,
    hypertension: true,
    dialysisYears: 2.5,
    pra: 15.0,  // Low sensitization
    previousTransplants: 0,
    status: 'waiting'
  },
  {
    recipientId: 'R002',
    name: 'Maria Garcia',
    age: 42,
    weight: 65,
    gender: 'female',
    location: 'Los Angeles, CA',
    bloodGroup: 'A+',
    hlaTyping: 'A2,A3,B8,B35,DR4,DR7',  // Different HLA profile
    waitingTime: 50,  // months
    urgencyScore: 10,
    bmi: 24.8,
    creatinine: 7.2,
    gfr: 10,
    systolicBP: 135,
    diastolicBP: 88,
    diabetes: true,
    hypertension: true,
    dialysisYears: 4.2,
    pra: 45.0,  // Moderate sensitization
    previousTransplants: 1,
    status: 'waiting'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data first
    console.log('\n🗑️  Clearing existing data...');
    await Donor.deleteMany({});
    await Recipient.deleteMany({});
    console.log('   ✓ Existing data cleared');

    // Insert donors
    console.log('\n📥 Inserting realistic donors...');
    await Donor.insertMany(realisticDonors);
    console.log(`   ✓ Inserted ${realisticDonors.length} donors`);

    // Insert recipients
    console.log('\n📥 Inserting realistic recipients...');
    await Recipient.insertMany(realisticRecipients);
    console.log(`   ✓ Inserted ${realisticRecipients.length} recipients`);

    // Display summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(70));
    
    console.log('\n📊 DONOR SUMMARY:');
    console.log('   • Perfect Matches (HLA 6/6): D001, D002 → Expected 85-95%');
    console.log('   • Excellent Match (HLA 5/6): D003 → Expected 75-85%');
    console.log('   • Good Match (HLA 4/6): D004 → Expected 65-75%');
    console.log('   • Fair Match (HLA 3/6): D005 → Expected 50-65%');
    console.log('   • Suboptimal (HLA 2/6, risk factors): D006, D007 → Expected 30-50%');
    console.log('   • Blood Incompatible: D008 → Expected <30%');
    console.log('   • High Risk: D009, D010 → Expected <30%');
    
    console.log('\n📊 RECIPIENT SUMMARY:');
    console.log('   • R001 (John Anderson): HLA A1,A2,B7,B8,DR3,DR4 - Low PRA (15%)');
    console.log('   • R002 (Maria Garcia): HLA A2,A3,B8,B35,DR4,DR7 - Moderate PRA (45%)');
    
    console.log('\n🧪 TEST INSTRUCTIONS:');
    console.log('   1. Login to the application');
    console.log('   2. Navigate to "Make Prediction" page');
    console.log('   3. Select recipient R001 (John Anderson)');
    console.log('   4. Click "Find Matches" to run batch prediction');
    console.log('   5. Expected results with R001:');
    console.log('      - D001, D002 should rank #1-#2 with 85-95% compatibility (Low Risk)');
    console.log('      - D003 should rank #3 with 75-85% compatibility (Low Risk)');
    console.log('      - D004-D005 should show 50-75% compatibility (Medium Risk)');
    console.log('      - D006-D010 should show <50% compatibility (High Risk)');
    console.log('\n   6. Try with recipient R002 to see different results');
    console.log('='.repeat(70));

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
