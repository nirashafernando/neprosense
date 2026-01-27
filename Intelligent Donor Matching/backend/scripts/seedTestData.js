import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donor from '../src/models/Donor.js';
import Recipient from '../src/models/Recipient.js';
import connectDB from '../src/config/db.js';

// Load environment variables
dotenv.config();

// Blood group mapping (reverse of ABO encoding)
const ABO_MAP = {
    0: 'A+',
    1: 'B+',
    2: 'AB+',
    3: 'O+'
};

// Test data from CSV (15 features matching new model schema)
const testData = [
    { Donor_Age: 32, Donor_BMI: 24.5, Donor_eGFR: 105, Donor_HTN: 0, Donor_DM: 0, Donor_Smoking: 0, Donor_ABO: 3, Recipient_Age: 30, Recipient_ABO: 0, Recipient_PRA: 10, Dialysis_Years: 1.2, Previous_Transplants: 0, HLA_Match_Score: 6, ABO_Compatibility: 1, Age_Gap: 2 },
    { Donor_Age: 45, Donor_BMI: 27.8, Donor_eGFR: 92, Donor_HTN: 0, Donor_DM: 0, Donor_Smoking: 0, Donor_ABO: 0, Recipient_Age: 42, Recipient_ABO: 2, Recipient_PRA: 22, Dialysis_Years: 3.5, Previous_Transplants: 0, HLA_Match_Score: 5, ABO_Compatibility: 1, Age_Gap: 3 },
    { Donor_Age: 38, Donor_BMI: 26.2, Donor_eGFR: 88, Donor_HTN: 0, Donor_DM: 0, Donor_Smoking: 1, Donor_ABO: 1, Recipient_Age: 55, Recipient_ABO: 1, Recipient_PRA: 45, Dialysis_Years: 6.0, Previous_Transplants: 1, HLA_Match_Score: 4, ABO_Compatibility: 1, Age_Gap: 17 },
    { Donor_Age: 50, Donor_BMI: 29.1, Donor_eGFR: 82, Donor_HTN: 1, Donor_DM: 0, Donor_Smoking: 0, Donor_ABO: 3, Recipient_Age: 48, Recipient_ABO: 0, Recipient_PRA: 35, Dialysis_Years: 4.2, Previous_Transplants: 0, HLA_Match_Score: 3, ABO_Compatibility: 1, Age_Gap: 2 },
    { Donor_Age: 60, Donor_BMI: 31.4, Donor_eGFR: 70, Donor_HTN: 1, Donor_DM: 1, Donor_Smoking: 0, Donor_ABO: 0, Recipient_Age: 58, Recipient_ABO: 2, Recipient_PRA: 65, Dialysis_Years: 7.8, Previous_Transplants: 1, HLA_Match_Score: 3, ABO_Compatibility: 1, Age_Gap: 2 },
    { Donor_Age: 42, Donor_BMI: 25.0, Donor_eGFR: 96, Donor_HTN: 0, Donor_DM: 0, Donor_Smoking: 0, Donor_ABO: 3, Recipient_Age: 40, Recipient_ABO: 1, Recipient_PRA: 18, Dialysis_Years: 2.0, Previous_Transplants: 0, HLA_Match_Score: 5, ABO_Compatibility: 1, Age_Gap: 2 },
    { Donor_Age: 35, Donor_BMI: 23.8, Donor_eGFR: 110, Donor_HTN: 0, Donor_DM: 0, Donor_Smoking: 0, Donor_ABO: 1, Recipient_Age: 34, Recipient_ABO: 1, Recipient_PRA: 5, Dialysis_Years: 0.5, Previous_Transplants: 0, HLA_Match_Score: 6, ABO_Compatibility: 1, Age_Gap: 1 },
    { Donor_Age: 55, Donor_BMI: 30.5, Donor_eGFR: 68, Donor_HTN: 1, Donor_DM: 1, Donor_Smoking: 1, Donor_ABO: 1, Recipient_Age: 29, Recipient_ABO: 0, Recipient_PRA: 85, Dialysis_Years: 8.5, Previous_Transplants: 2, HLA_Match_Score: 2, ABO_Compatibility: 0, Age_Gap: 26 },
    { Donor_Age: 47, Donor_BMI: 28.9, Donor_eGFR: 75, Donor_HTN: 1, Donor_DM: 0, Donor_Smoking: 0, Donor_ABO: 0, Recipient_Age: 46, Recipient_ABO: 2, Recipient_PRA: 55, Dialysis_Years: 5.5, Previous_Transplants: 1, HLA_Match_Score: 3, ABO_Compatibility: 1, Age_Gap: 1 },
    { Donor_Age: 29, Donor_BMI: 22.4, Donor_eGFR: 115, Donor_HTN: 0, Donor_DM: 0, Donor_Smoking: 0, Donor_ABO: 3, Recipient_Age: 62, Recipient_ABO: 3, Recipient_PRA: 12, Dialysis_Years: 4.0, Previous_Transplants: 0, HLA_Match_Score: 4, ABO_Compatibility: 1, Age_Gap: 33 }
];

// Generate HLA typing string based on match score
function generateHLA(matchScore) {
    const alleles = ['A1', 'A2', 'B7', 'B8', 'DR3', 'DR4'];
    const baseHLA = ['A1', 'A2', 'B7', 'B8', 'DR3', 'DR4'];
    
    if (matchScore === 6) return baseHLA.join(',');
    if (matchScore === 5) return 'A1,A3,B7,B8,DR3,DR4';
    if (matchScore === 4) return 'A1,A3,B7,B35,DR3,DR4';
    if (matchScore === 3) return 'A1,A3,B7,B35,DR3,DR7';
    if (matchScore === 2) return 'A1,A3,B35,B44,DR3,DR7';
    return 'A3,A11,B35,B44,DR7,DR15';
}

const clearAndSeedData = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await Donor.deleteMany({});
        await Recipient.deleteMany({});
        console.log('✅ Database cleared');

        console.log('\n📊 Seeding test data...');
        console.log('='*70);

        const donors = [];
        const recipients = [];

        // Create test pairs
        for (let i = 0; i < testData.length; i++) {
            const data = testData[i];
            const donorId = `D${String(i + 1).padStart(3, '0')}`;
            const recipientId = `R${String(i + 1).padStart(3, '0')}`;

            // Calculate weight from BMI (assuming average height of 1.7m)
            const donorWeight = Math.round(data.Donor_BMI * 1.7 * 1.7);
            const recipientWeight = Math.round(24 * 1.7 * 1.7); // Default BMI for recipients

            // Estimate BP from hypertension status
            const donorSystolic = data.Donor_HTN ? 145 : 120;
            const donorDiastolic = data.Donor_HTN ? 92 : 80;
            const recipientSystolic = 130;
            const recipientDiastolic = 85;

            // Estimate creatinine from eGFR (inverse relationship)
            const donorCreatinine = Math.max(0.6, (100 / data.Donor_eGFR) * 1.2);

            // Generate HLA typing
            const donorHLA = generateHLA(6); // Base HLA for donor
            const recipientHLA = generateHLA(data.HLA_Match_Score); // Match score determines recipient HLA

            // Create donor
            const donor = {
                donorId: donorId,
                name: `Test Donor ${i + 1}`,
                age: data.Donor_Age,
                weight: donorWeight,
                gender: i % 2 === 0 ? 'male' : 'female',
                location: 'Test City',
                bloodGroup: ABO_MAP[data.Donor_ABO],
                hlaTyping: donorHLA,
                bmi: data.Donor_BMI,
                creatinine: donorCreatinine,
                gfr: data.Donor_eGFR,
                systolicBP: donorSystolic,
                diastolicBP: donorDiastolic,
                smoking: data.Donor_Smoking === 1,
                diabetes: data.Donor_DM === 1,
                hypertension: data.Donor_HTN === 1,
                status: 'active'
            };

            // Create recipient
            const recipient = {
                recipientId: recipientId,
                name: `Test Recipient ${i + 1}`,
                age: data.Recipient_Age,
                weight: recipientWeight,
                gender: i % 2 === 0 ? 'female' : 'male',
                location: 'Test City',
                bloodGroup: ABO_MAP[data.Recipient_ABO],
                hlaTyping: recipientHLA,
                waitingTime: Math.round(data.Dialysis_Years * 365),
                urgencyScore: data.Dialysis_Years > 5 ? 9 : data.Dialysis_Years > 3 ? 7 : 5,
                bmi: 24.0,
                creatinine: 8.0,
                gfr: 15.0,
                systolicBP: recipientSystolic,
                diastolicBP: recipientDiastolic,
                dialysisYears: data.Dialysis_Years,
                diabetes: false,
                hypertension: false,
                previousTransplants: data.Previous_Transplants,
                status: 'waiting'
            };

            donors.push(donor);
            recipients.push(recipient);

            console.log(`\n✓ Pair ${i + 1}:`);
            console.log(`  Donor: ${donorId} (${donor.bloodGroup}, ${donor.age}y, eGFR ${donor.gfr})`);
            console.log(`  Recipient: ${recipientId} (${recipient.bloodGroup}, ${recipient.age}y)`);
            console.log(`  HLA Match: ${data.HLA_Match_Score}/6, ABO Compatible: ${data.ABO_Compatibility ? 'Yes' : 'No'}`);
        }

        // Insert all donors and recipients
        await Donor.insertMany(donors);
        await Recipient.insertMany(recipients);

        console.log('\n' + '='*70);
        console.log(`✅ Successfully seeded ${donors.length} donors and ${recipients.length} recipients`);
        console.log('='*70);

        console.log('\n📋 Summary:');
        console.log(`   Donors: ${donors.length}`);
        console.log(`   Recipients: ${recipients.length}`);
        console.log(`   Perfect matches (6/6 HLA): ${testData.filter(d => d.HLA_Match_Score === 6).length}`);
        console.log(`   Good matches (5/6 HLA): ${testData.filter(d => d.HLA_Match_Score === 5).length}`);
        console.log(`   ABO incompatible: ${testData.filter(d => d.ABO_Compatibility === 0).length}`);

        console.log('\n✅ Database ready for testing!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

clearAndSeedData();
