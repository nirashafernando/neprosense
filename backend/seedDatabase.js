import mongoose from 'mongoose';
import Donor from './src/models/Donor.js';
import Recipient from './src/models/Recipient.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample donors with complete realistic medical data
const sampleDonors = [
    {
        donorId: "DN001",
        name: "John Anderson",
        age: 35,
        weight: 75,
        gender: "male",
        location: "New York, NY",
        bloodGroup: "O+",
        hlaTyping: "A1,A2,B7,B8,DR3,DR4",
        bmi: 24.5,
        creatinine: 0.9,
        gfr: 95,
        systolicBP: 120,
        diastolicBP: 80,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN002",
        name: "Sarah Martinez",
        age: 28,
        weight: 62,
        gender: "female",
        location: "Los Angeles, CA",
        bloodGroup: "A+",
        hlaTyping: "A2,A3,B35,B44,DR1,DR7",
        bmi: 22.1,
        creatinine: 0.8,
        gfr: 100,
        systolicBP: 115,
        diastolicBP: 75,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN003",
        name: "Michael Chen",
        age: 42,
        weight: 80,
        gender: "male",
        location: "Chicago, IL",
        bloodGroup: "B+",
        hlaTyping: "A24,A26,B38,B62,DR4,DR11",
        bmi: 26.3,
        creatinine: 1.0,
        gfr: 90,
        systolicBP: 125,
        diastolicBP: 82,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN004",
        name: "Emily Johnson",
        age: 31,
        weight: 58,
        gender: "female",
        location: "Houston, TX",
        bloodGroup: "AB+",
        hlaTyping: "A1,A3,B7,B35,DR3,DR7",
        bmi: 21.8,
        creatinine: 0.85,
        gfr: 98,
        systolicBP: 118,
        diastolicBP: 78,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN005",
        name: "David Williams",
        age: 38,
        weight: 78,
        gender: "male",
        location: "Phoenix, AZ",
        bloodGroup: "O-",
        hlaTyping: "A2,A11,B15,B27,DR1,DR4",
        bmi: 25.2,
        creatinine: 0.95,
        gfr: 92,
        systolicBP: 122,
        diastolicBP: 80,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN006",
        name: "Lisa Thompson",
        age: 29,
        weight: 60,
        gender: "female",
        location: "Philadelphia, PA",
        bloodGroup: "A-",
        hlaTyping: "A3,A29,B44,B57,DR7,DR15",
        bmi: 22.5,
        creatinine: 0.82,
        gfr: 102,
        systolicBP: 116,
        diastolicBP: 76,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN007",
        name: "Robert Garcia",
        age: 45,
        weight: 85,
        gender: "male",
        location: "San Antonio, TX",
        bloodGroup: "B-",
        hlaTyping: "A1,A24,B8,B38,DR3,DR11",
        bmi: 27.1,
        creatinine: 1.1,
        gfr: 88,
        systolicBP: 128,
        diastolicBP: 84,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN008",
        name: "Jennifer Lee",
        age: 33,
        weight: 56,
        gender: "female",
        location: "San Diego, CA",
        bloodGroup: "AB-",
        hlaTyping: "A2,A3,B7,B44,DR4,DR7",
        bmi: 20.9,
        creatinine: 0.78,
        gfr: 105,
        systolicBP: 114,
        diastolicBP: 74,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN009",
        name: "James Brown",
        age: 40,
        weight: 82,
        gender: "male",
        location: "Dallas, TX",
        bloodGroup: "O+",
        hlaTyping: "A11,A24,B35,B51,DR1,DR15",
        bmi: 26.8,
        creatinine: 1.05,
        gfr: 89,
        systolicBP: 126,
        diastolicBP: 83,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    },
    {
        donorId: "DN010",
        name: "Patricia Davis",
        age: 36,
        weight: 64,
        gender: "female",
        location: "San Jose, CA",
        bloodGroup: "A+",
        hlaTyping: "A1,A2,B15,B44,DR3,DR11",
        bmi: 23.4,
        creatinine: 0.88,
        gfr: 96,
        systolicBP: 119,
        diastolicBP: 79,
        smoking: false,
        diabetes: false,
        hypertension: false,
        status: "active"
    }
];

// Sample recipients with complete realistic medical data
const sampleRecipients = [
    {
        recipientId: "RC001",
        name: "Richard Wilson",
        age: 52,
        weight: 72,
        gender: "male",
        location: "Boston, MA",
        bloodGroup: "O+",
        hlaTyping: "A1,A2,B7,B8,DR3,DR4",
        waitingTime: 18,
        urgencyScore: 9,
        bmi: 25.8,
        creatinine: 5.2,
        gfr: 12,
        systolicBP: 145,
        diastolicBP: 92,
        dialysisYears: 3,
        diabetes: true,
        hypertension: true,
        previousTransplants: 0,
        status: "waiting"
    },
    {
        recipientId: "RC002",
        name: "Mary Rodriguez",
        age: 48,
        weight: 65,
        gender: "female",
        location: "Miami, FL",
        bloodGroup: "A+",
        hlaTyping: "A2,A3,B35,B44,DR1,DR7",
        waitingTime: 12,
        urgencyScore: 8,
        bmi: 26.2,
        creatinine: 6.1,
        gfr: 9,
        systolicBP: 150,
        diastolicBP: 95,
        dialysisYears: 2,
        diabetes: true,
        hypertension: true,
        previousTransplants: 0,
        status: "waiting"
    },
    {
        recipientId: "RC003",
        name: "Thomas Miller",
        age: 55,
        weight: 78,
        gender: "male",
        location: "Atlanta, GA",
        bloodGroup: "B+",
        hlaTyping: "A24,A26,B38,B62,DR4,DR11",
        waitingTime: 9,
        urgencyScore: 6,
        bmi: 27.5,
        creatinine: 4.8,
        gfr: 15,
        systolicBP: 142,
        diastolicBP: 90,
        dialysisYears: 1.5,
        diabetes: false,
        hypertension: true,
        previousTransplants: 0,
        status: "waiting"
    },
    {
        recipientId: "RC004",
        name: "Linda Moore",
        age: 45,
        weight: 60,
        gender: "female",
        location: "Seattle, WA",
        bloodGroup: "AB+",
        hlaTyping: "A1,A3,B7,B35,DR3,DR7",
        waitingTime: 14,
        urgencyScore: 7,
        bmi: 24.3,
        creatinine: 5.5,
        gfr: 11,
        systolicBP: 148,
        diastolicBP: 93,
        dialysisYears: 2.5,
        diabetes: false,
        hypertension: false,
        previousTransplants: 0,
        status: "waiting"
    },
    {
        recipientId: "RC005",
        name: "Charles Taylor",
        age: 60,
        weight: 70,
        gender: "male",
        location: "Denver, CO",
        bloodGroup: "O-",
        hlaTyping: "A2,A11,B15,B27,DR1,DR4",
        waitingTime: 24,
        urgencyScore: 10,
        bmi: 25.1,
        creatinine: 7.2,
        gfr: 7,
        systolicBP: 155,
        diastolicBP: 98,
        dialysisYears: 4,
        diabetes: true,
        hypertension: true,
        previousTransplants: 1,
        status: "waiting"
    },
    {
        recipientId: "RC006",
        name: "Barbara Anderson",
        age: 50,
        weight: 58,
        gender: "female",
        location: "Portland, OR",
        bloodGroup: "A-",
        hlaTyping: "A3,A29,B44,B57,DR7,DR15",
        waitingTime: 16,
        urgencyScore: 8,
        bmi: 23.8,
        creatinine: 5.8,
        gfr: 10,
        systolicBP: 152,
        diastolicBP: 94,
        dialysisYears: 3,
        diabetes: false,
        hypertension: true,
        previousTransplants: 0,
        status: "waiting"
    },
    {
        recipientId: "RC007",
        name: "Daniel Thomas",
        age: 58,
        weight: 76,
        gender: "male",
        location: "Austin, TX",
        bloodGroup: "B-",
        hlaTyping: "A1,A24,B8,B38,DR3,DR11",
        waitingTime: 11,
        urgencyScore: 7,
        bmi: 26.9,
        creatinine: 5.0,
        gfr: 13,
        systolicBP: 146,
        diastolicBP: 91,
        dialysisYears: 2,
        diabetes: true,
        hypertension: true,
        previousTransplants: 0,
        status: "waiting"
    },
    {
        recipientId: "RC008",
        name: "Susan Jackson",
        age: 47,
        weight: 62,
        gender: "female",
        location: "Minneapolis, MN",
        bloodGroup: "AB-",
        hlaTyping: "A2,A3,B7,B44,DR4,DR7",
        waitingTime: 20,
        urgencyScore: 9,
        bmi: 24.7,
        creatinine: 6.5,
        gfr: 8,
        systolicBP: 153,
        diastolicBP: 96,
        dialysisYears: 3.5,
        diabetes: false,
        hypertension: true,
        previousTransplants: 0,
        status: "waiting"
    },
    {
        recipientId: "RC009",
        name: "Christopher White",
        age: 53,
        weight: 74,
        gender: "male",
        location: "Las Vegas, NV",
        bloodGroup: "O+",
        hlaTyping: "A11,A24,B35,B51,DR1,DR15",
        waitingTime: 10,
        urgencyScore: 6,
        bmi: 26.1,
        creatinine: 4.5,
        gfr: 16,
        systolicBP: 140,
        diastolicBP: 88,
        dialysisYears: 1,
        diabetes: false,
        hypertension: false,
        previousTransplants: 0,
        status: "waiting"
    },
    {
        recipientId: "RC010",
        name: "Karen Harris",
        age: 49,
        weight: 67,
        gender: "female",
        location: "Charlotte, NC",
        bloodGroup: "A+",
        hlaTyping: "A1,A2,B15,B44,DR3,DR11",
        waitingTime: 15,
        urgencyScore: 8,
        bmi: 25.4,
        creatinine: 5.7,
        gfr: 10,
        systolicBP: 149,
        diastolicBP: 92,
        dialysisYears: 2.8,
        diabetes: true,
        hypertension: true,
        previousTransplants: 0,
        status: "waiting"
    }
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://nirasharosh_db_user:nirasha123@cluster0.1r6lksv.mongodb.net/?appName=Cluster0');

        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await Donor.deleteMany({});
        await Recipient.deleteMany({});
        console.log('🗑️  Cleared existing donors and recipients');

        // Insert sample donors
        const donors = await Donor.insertMany(sampleDonors);
        console.log(`✅ Added ${donors.length} donors to database`);

        // Insert sample recipients
        const recipients = await Recipient.insertMany(sampleRecipients);
        console.log(`✅ Added ${recipients.length} recipients to database`);

        console.log('\n📊 Database seeded successfully!');
        console.log(`\nSummary:`);
        console.log(`- Donors: ${donors.length}`);
        console.log(`- Recipients: ${recipients.length}`);
        console.log(`\n🎉 Ready for testing and demonstration!`);
        console.log(`\n💡 You can now:`);
        console.log(`  - View donors and recipients in the dashboard`);
        console.log(`  - Run predictions and matching algorithms`);
        console.log(`  - Generate reports for your presentation`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
