import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js';
import Donor from '../src/models/Donor.js';
import Recipient from '../src/models/Recipient.js';
import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Sri Lankan realistic test data
const sriLankanDonors = [
    {
        donorId: 'D001',
        name: 'Kasun Perera',
        age: 32,
        weight: 72,
        gender: 'male',
        bloodGroup: 'O+',
        hlaTyping: 'A1,A2,B8,B44,DR1,DR4',
        location: 'Colombo',
        hospital: 'National Hospital of Sri Lanka',
        contactNumber: '+94 77 123 4567',
        bmi: 24.5,
        creatinine: 0.9,
        gfr: 105,
        systolicBP: 118,
        diastolicBP: 78,
        smoking: false,
        diabetes: false,
        hypertension: false
    },
    {
        donorId: 'D002',
        name: 'Nimal Fernando',
        age: 28,
        weight: 68,
        gender: 'male',
        bloodGroup: 'A+',
        hlaTyping: 'A1,A3,B7,B8,DR3,DR4',
        location: 'Kandy',
        hospital: 'Teaching Hospital Kandy',
        contactNumber: '+94 71 234 5678',
        bmi: 22.8,
        creatinine: 0.85,
        gfr: 115,
        systolicBP: 115,
        diastolicBP: 75,
        smoking: false,
        diabetes: false,
        hypertension: false
    },
    {
        donorId: 'D003',
        name: 'Chamari Silva',
        age: 35,
        weight: 65,
        gender: 'female',
        bloodGroup: 'B+',
        hlaTyping: 'A2,A3,B7,B35,DR3,DR7',
        location: 'Galle',
        hospital: 'Karapitiya Teaching Hospital',
        contactNumber: '+94 76 345 6789',
        bmi: 23.5,
        creatinine: 0.92,
        gfr: 98,
        systolicBP: 120,
        diastolicBP: 80,
        smoking: false,
        diabetes: false,
        hypertension: false
    },
    {
        donorId: 'D004',
        name: 'Ranil Wickramasinghe',
        age: 45,
        weight: 78,
        gender: 'male',
        bloodGroup: 'AB+',
        hlaTyping: 'A1,A2,B8,B44,DR1,DR3',
        location: 'Negombo',
        hospital: 'Negombo General Hospital',
        contactNumber: '+94 77 456 7890',
        bmi: 26.2,
        creatinine: 1.0,
        gfr: 90,
        systolicBP: 125,
        diastolicBP: 82,
        smoking: false,
        diabetes: false,
        hypertension: true
    },
    {
        donorId: 'D005',
        name: 'Priyanka Jayawardena',
        age: 29,
        weight: 58,
        gender: 'female',
        bloodGroup: 'O+',
        hlaTyping: 'A1,A3,B7,B8,DR3,DR4',
        location: 'Anuradhapura',
        hospital: 'Anuradhapura Teaching Hospital',
        contactNumber: '+94 71 567 8901',
        bmi: 21.8,
        creatinine: 0.88,
        gfr: 112,
        systolicBP: 110,
        diastolicBP: 72,
        smoking: false,
        diabetes: false,
        hypertension: false
    },
    {
        donorId: 'D006',
        name: 'Roshan de Silva',
        age: 38,        weight: 75,
        gender: 'male',        bloodGroup: 'A+',
        hlaTyping: 'A2,A3,B7,B35,DR4,DR7',
        location: 'Kurunegala',
        hospital: 'Kurunegala Teaching Hospital',
        contactNumber: '+94 76 678 9012',
        bmi: 25.0,
        creatinine: 0.95,
        gfr: 95,
        systolicBP: 122,
        diastolicBP: 79,
        smoking: true,
        diabetes: false,
        hypertension: false
    },
    {
        donorId: 'D007',
        name: 'Malini Rathnayake',
        age: 42,        weight: 62,
        gender: 'female',        bloodGroup: 'B+',
        hlaTyping: 'A1,A2,B8,B44,DR1,DR4',
        location: 'Jaffna',
        hospital: 'Jaffna Teaching Hospital',
        contactNumber: '+94 77 789 0123',
        bmi: 24.0,
        creatinine: 0.91,
        gfr: 100,
        systolicBP: 118,
        diastolicBP: 76,
        smoking: false,
        diabetes: false,
        hypertension: false
    },
    {
        donorId: 'D008',
        name: 'Lakshan Gunasekara',
        age: 50,
        weight: 80,
        gender: 'male',
        bloodGroup: 'O+',
        hlaTyping: 'A1,A3,B7,B35,DR3,DR4',
        location: 'Matara',
        hospital: 'Matara General Hospital',
        contactNumber: '+94 71 890 1234',
        bmi: 27.5,
        creatinine: 1.05,
        gfr: 85,
        systolicBP: 130,
        diastolicBP: 85,
        smoking: false,
        diabetes: true,
        hypertension: true
    },
    {
        donorId: 'D009',
        name: 'Sanduni Wijesinghe',
        age: 26,        weight: 52,
        gender: 'female',        bloodGroup: 'AB+',
        hlaTyping: 'A1,A2,B7,B8,DR1,DR3',
        location: 'Batticaloa',
        hospital: 'Batticaloa Teaching Hospital',
        contactNumber: '+94 76 901 2345',
        bmi: 22.0,
        creatinine: 0.82,
        gfr: 118,
        systolicBP: 112,
        diastolicBP: 74,
        smoking: false,
        diabetes: false,
        hypertension: false
    },
    {
        donorId: 'D010',
        name: 'Thilina Bandara',
        age: 33,        weight: 70,
        gender: 'male',        bloodGroup: 'A+',
        hlaTyping: 'A2,A3,B8,B35,DR3,DR7',
        location: 'Ratnapura',
        hospital: 'Ratnapura General Hospital',
        contactNumber: '+94 77 012 3456',
        bmi: 23.8,
        creatinine: 0.93,
        gfr: 102,
        systolicBP: 120,
        diastolicBP: 78,
        smoking: false,
        diabetes: false,
        hypertension: false
    }
];

const sriLankanRecipients = [
    {
        recipientId: 'R001',
        name: 'Samanthi Rajapaksa',
        age: 45,
        weight: 68,
        gender: 'female',
        bloodGroup: 'O+',
        hlaTyping: 'A1,A3,B8,B44,DR1,DR7',
        location: 'Colombo',
        hospital: 'National Hospital of Sri Lanka',
        contactNumber: '+94 77 234 5678',
        bmi: 26.5,
        creatinine: 8.2,
        gfr: 12,
        systolicBP: 145,
        diastolicBP: 92,
        dialysisYears: 3.5,
        waitingTime: 3.5,
        urgencyScore: 8,
        pra: 15,
        diabetes: true,
        hypertension: true,
        previousTransplants: 0
    },
    {
        recipientId: 'R002',
        name: 'Anil Dissanayake',
        age: 52,
        weight: 75,
        gender: 'male',
        bloodGroup: 'A+',
        hlaTyping: 'A1,A2,B7,B35,DR3,DR4',
        location: 'Kandy',
        hospital: 'Teaching Hospital Kandy',
        contactNumber: '+94 71 345 6789',
        bmi: 28.0,
        creatinine: 9.5,
        gfr: 8,
        systolicBP: 150,
        diastolicBP: 95,
        dialysisYears: 5.2,
        waitingTime: 5.2,
        urgencyScore: 9,
        pra: 25,
        diabetes: true,
        hypertension: true,
        previousTransplants: 0
    },
    {
        recipientId: 'R003',
        name: 'Nuwan Karunaratne',
        age: 38,
        weight: 70,
        gender: 'male',
        bloodGroup: 'B+',
        hlaTyping: 'A2,A3,B7,B8,DR3,DR7',
        location: 'Galle',
        hospital: 'Karapitiya Teaching Hospital',
        contactNumber: '+94 76 456 7890',
        bmi: 24.8,
        creatinine: 7.8,
        gfr: 14,
        systolicBP: 140,
        diastolicBP: 88,
        dialysisYears: 2.8,
        waitingTime: 2.8,
        urgencyScore: 7,
        pra: 10,
        diabetes: false,
        hypertension: true,
        previousTransplants: 0
    },
    {
        recipientId: 'R004',
        name: 'Dilini Amarasinghe',
        age: 41,
        weight: 72,
        gender: 'female',
        bloodGroup: 'AB+',
        hlaTyping: 'A1,A2,B8,B44,DR1,DR4',
        location: 'Negombo',
        hospital: 'Negombo General Hospital',
        contactNumber: '+94 77 567 8901',
        bmi: 27.2,
        creatinine: 8.8,
        gfr: 10,
        systolicBP: 148,
        diastolicBP: 90,
        dialysisYears: 4.0,
        waitingTime: 4.0,
        urgencyScore: 8,
        pra: 20,
        diabetes: true,
        hypertension: true,
        previousTransplants: 0
    },
    {
        recipientId: 'R005',
        name: 'Chathura Mendis',
        age: 29,
        weight: 62,
        gender: 'male',
        bloodGroup: 'O+',
        hlaTyping: 'A1,A3,B7,B8,DR3,DR4',
        location: 'Anuradhapura',
        hospital: 'Anuradhapura Teaching Hospital',
        contactNumber: '+94 71 678 9012',
        bmi: 23.5,
        creatinine: 6.5,
        gfr: 18,
        systolicBP: 135,
        diastolicBP: 85,
        dialysisYears: 1.5,
        waitingTime: 1.5,
        urgencyScore: 6,
        pra: 5,
        diabetes: false,
        hypertension: false,
        previousTransplants: 0
    },
    {
        recipientId: 'R006',
        name: 'Hasini Jayakody',
        age: 48,        weight: 66,
        gender: 'female',        bloodGroup: 'A+',
        hlaTyping: 'A1,A3,B7,B35,DR4,DR7',
        location: 'Kurunegala',
        hospital: 'Kurunegala Teaching Hospital',
        contactNumber: '+94 76 789 0123',
        bmi: 25.8,
        creatinine: 9.2,
        gfr: 9,
        systolicBP: 152,
        diastolicBP: 94,
        dialysisYears: 6.5,
        waitingTime: 6.5,
        urgencyScore: 9,
        pra: 35,
        diabetes: true,
        hypertension: true,
        previousTransplants: 1
    },
    {
        recipientId: 'R007',
        name: 'Ranjith Herath',
        age: 55,        weight: 78,
        gender: 'male',        bloodGroup: 'B+',
        hlaTyping: 'A2,A3,B8,B35,DR3,DR7',
        location: 'Jaffna',
        hospital: 'Jaffna Teaching Hospital',
        contactNumber: '+94 77 890 1234',
        bmi: 29.0,
        creatinine: 10.5,
        gfr: 6,
        systolicBP: 155,
        diastolicBP: 98,
        dialysisYears: 7.8,
        waitingTime: 7.8,
        urgencyScore: 10,
        pra: 45,
        diabetes: true,
        hypertension: true,
        previousTransplants: 1
    },
    {
        recipientId: 'R008',
        name: 'Chaminda Wickremaratne',
        age: 35,        weight: 65,
        gender: 'male',        bloodGroup: 'O+',
        hlaTyping: 'A1,A2,B7,B44,DR1,DR3',
        location: 'Matara',
        hospital: 'Matara General Hospital',
        contactNumber: '+94 71 901 2345',
        bmi: 22.5,
        creatinine: 7.0,
        gfr: 16,
        systolicBP: 138,
        diastolicBP: 86,
        dialysisYears: 2.2,
        waitingTime: 2.2,
        urgencyScore: 6,
        pra: 8,
        diabetes: false,
        hypertension: true,
        previousTransplants: 0
    },
    {
        recipientId: 'R009',
        name: 'Thanuja Edirisinghe',
        age: 60,        weight: 70,
        gender: 'female',        bloodGroup: 'AB+',
        hlaTyping: 'A1,A3,B8,B35,DR1,DR7',
        location: 'Batticaloa',
        hospital: 'Batticaloa Teaching Hospital',
        contactNumber: '+94 76 012 3456',
        bmi: 30.5,
        creatinine: 11.2,
        gfr: 5,
        systolicBP: 160,
        diastolicBP: 100,
        dialysisYears: 8.5,
        waitingTime: 8.5,
        urgencyScore: 10,
        pra: 55,
        diabetes: true,
        hypertension: true,
        previousTransplants: 2
    },
    {
        recipientId: 'R010',
        name: 'Sunil Gamage',
        age: 44,        weight: 73,
        gender: 'male',        bloodGroup: 'A+',
        hlaTyping: 'A2,A3,B7,B8,DR3,DR4',
        location: 'Ratnapura',
        hospital: 'Ratnapura General Hospital',
        contactNumber: '+94 77 123 4567',
        bmi: 26.0,
        creatinine: 8.5,
        gfr: 11,
        systolicBP: 142,
        diastolicBP: 89,
        dialysisYears: 3.8,
        waitingTime: 3.8,
        urgencyScore: 7,
        pra: 18,
        diabetes: true,
        hypertension: true,
        previousTransplants: 0
    }
];

const seedSriLankanData = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await connectDB();

        // First, clear existing data
        console.log('🗑️  Clearing existing data...');
        await Donor.deleteMany({});
        await Recipient.deleteMany({});
        console.log('✅ Existing data cleared');

        // Create or get a test user (doctor)
        let testUser = await User.findOne({ email: 'doctor@nephrosense.lk' });
        if (!testUser) {
            console.log('👨‍⚕️ Creating test doctor user...');
            const hashedPassword = await bcrypt.hash('doctor123', 10);
            testUser = await User.create({
                name: 'Dr. Kumara Wijeratne',
                email: 'doctor@nephrosense.lk',
                password: hashedPassword,
                role: 'Doctor'
            });
            console.log('✅ Test user created: doctor@nephrosense.lk / doctor123');
        }

        // Seed donors
        console.log('\n👥 Seeding 10 Sri Lankan donors...');
        const donorPromises = sriLankanDonors.map(donor => 
            Donor.create({ ...donor, user: testUser._id })
        );
        const createdDonors = await Promise.all(donorPromises);
        console.log(`✅ Successfully seeded ${createdDonors.length} donors`);

        // Seed recipients
        console.log('\n🏥 Seeding 10 Sri Lankan recipients...');
        const recipientPromises = sriLankanRecipients.map(recipient => 
            Recipient.create({ ...recipient, user: testUser._id })
        );
        const createdRecipients = await Promise.all(recipientPromises);
        console.log(`✅ Successfully seeded ${createdRecipients.length} recipients`);

        // Display summary
        console.log('\n📊 SEEDING SUMMARY');
        console.log('═'.repeat(60));
        console.log(`✅ Total Donors: ${createdDonors.length}`);
        console.log(`✅ Total Recipients: ${createdRecipients.length}`);
        console.log(`👨‍⚕️ Test User: doctor@nephrosense.lk`);
        console.log(`🔑 Password: doctor123`);
        console.log('═'.repeat(60));
        
        console.log('\n🏥 DONOR LOCATIONS:');
        const donorLocations = [...new Set(sriLankanDonors.map(d => d.location))];
        donorLocations.forEach(loc => {
            const count = sriLankanDonors.filter(d => d.location === loc).length;
            console.log(`   • ${loc}: ${count} donor(s)`);
        });

        console.log('\n🏥 RECIPIENT LOCATIONS:');
        const recipientLocations = [...new Set(sriLankanRecipients.map(r => r.location))];
        recipientLocations.forEach(loc => {
            const count = sriLankanRecipients.filter(r => r.location === loc).length;
            console.log(`   • ${loc}: ${count} recipient(s)`);
        });

        console.log('\n🩸 BLOOD GROUP DISTRIBUTION (Donors):');
        const bloodGroups = {};
        sriLankanDonors.forEach(d => {
            bloodGroups[d.bloodGroup] = (bloodGroups[d.bloodGroup] || 0) + 1;
        });
        Object.entries(bloodGroups).forEach(([bg, count]) => {
            console.log(`   • ${bg}: ${count}`);
        });

        console.log('\n✨ Database seeded successfully with Sri Lankan test data!');
        console.log('🚀 You can now login and start making predictions.\n');

        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedSriLankanData();
