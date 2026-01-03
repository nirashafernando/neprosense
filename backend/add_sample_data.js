/**
 * Add Sample Data via API
 * This script adds donors and recipients through the backend API
 * Run this after logging in as a Clinician user
 */

const API_BASE = 'http://localhost:5000/api';

// You need to replace this with your actual JWT token after logging in
const AUTH_TOKEN = 'YOUR_JWT_TOKEN_HERE';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`
};

// Sample Donors
const donors = [
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
        hypertension: false
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
        hypertension: false
    },
    // Add more donors as needed...
];

// Sample Recipients
const recipients = [
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
        previousTransplants: 0
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
        previousTransplants: 0
    },
    // Add more recipients as needed...
];

async function addData() {
    console.log('Starting to add sample data...\n');

    // Add donors
    console.log(`Adding ${donors.length} donors...`);
    for (const donor of donors) {
        try {
            const response = await fetch(`${API_BASE}/donors`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(donor)
            });
            const data = await response.json();
            if (data.success) {
                console.log(`✅ Added donor: ${donor.name}`);
            } else {
                console.log(`❌ Failed to add donor ${donor.name}:`, data.message);
            }
        } catch (error) {
            console.log(`❌ Error adding donor ${donor.name}:`, error.message);
        }
    }

    // Add recipients
    console.log(`\nAdding ${recipients.length} recipients...`);
    for (const recipient of recipients) {
        try {
            const response = await fetch(`${API_BASE}/recipients`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(recipient)
            });
            const data = await response.json();
            if (data.success) {
                console.log(`✅ Added recipient: ${recipient.name}`);
            } else {
                console.log(`❌ Failed to add recipient ${recipient.name}:`, data.message);
            }
        } catch (error) {
            console.log(`❌ Error adding recipient ${recipient.name}:`, error.message);
        }
    }

    console.log('\n✅ Sample data addition complete!');
}

// Uncomment to run:
// addData();

console.log(`
===========================================
INSTRUCTIONS TO ADD SAMPLE DATA
===========================================

1. Login to your NephroSense app as a Clinician user
2. Open the browser console (F12)
3. Copy your JWT token from localStorage:
   localStorage.getItem('token')
4. Replace 'YOUR_JWT_TOKEN_HERE' in this file with your token
5. Run: node add_sample_data.js

OR, you can use the frontend UI to manually add donors and recipients using the forms!
===========================================
`);
