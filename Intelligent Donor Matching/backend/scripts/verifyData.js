import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donor from '../src/models/Donor.js';
import Recipient from '../src/models/Recipient.js';
import connectDB from '../src/config/db.js';

dotenv.config();

const verifyData = async () => {
    try {
        await connectDB();

        console.log('\n' + '='*70);
        console.log('DATABASE VERIFICATION');
        console.log('='*70 + '\n');

        const donors = await Donor.find({}).sort({ donorId: 1 });
        const recipients = await Recipient.find({}).sort({ recipientId: 1 });

        console.log(`✅ Donors in database: ${donors.length}`);
        console.log(`✅ Recipients in database: ${recipients.length}\n`);

        console.log('📊 DONOR-RECIPIENT PAIRS:');
        console.log('='*70);

        for (let i = 0; i < Math.min(donors.length, recipients.length); i++) {
            const donor = donors[i];
            const recipient = recipients[i];

            console.log(`\nPair ${i + 1}:`);
            console.log(`  Donor ${donor.donorId}:`);
            console.log(`    Age: ${donor.age}, BMI: ${donor.bmi}, eGFR: ${donor.gfr}`);
            console.log(`    Blood: ${donor.bloodGroup}, HLA: ${donor.hlaTyping}`);
            console.log(`    HTN: ${donor.hypertension}, DM: ${donor.diabetes}, Smoking: ${donor.smoking}`);
            
            console.log(`  Recipient ${recipient.recipientId}:`);
            console.log(`    Age: ${recipient.age}, Blood: ${recipient.bloodGroup}`);
            console.log(`    HLA: ${recipient.hlaTyping}`);
            console.log(`    Dialysis: ${recipient.dialysisYears} years, Prev Transplants: ${recipient.previousTransplants}`);
        }

        console.log('\n' + '='*70);
        console.log('✅ Data verification complete!');
        console.log('='*70);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

verifyData();
