import { execSync } from 'child_process';

console.log('🔄 Starting database reset and seeding process...\n');

try {
    // Step 1: Clear database
    console.log('📍 Step 1: Clearing database...');
    execSync('node scripts/clearDatabase.js', { stdio: 'inherit' });
    
    console.log('\n');
    
    // Step 2: Seed Sri Lankan data
    console.log('📍 Step 2: Seeding Sri Lankan test data...');
    execSync('node scripts/seedSriLankanData.js', { stdio: 'inherit' });
    
    console.log('\n✅ Database reset and seeding completed successfully!');
} catch (error) {
    console.error('\n❌ Error during database reset:', error.message);
    process.exit(1);
}
