const createDatabase = require('./createDatabase');
const seedDatabase = require('./seed');

async function setup() {
  try {
    console.log('🚀 Starting database setup...\n');
    
    // Step 1: Create database and tables
    await createDatabase();
    console.log('');
    
    // Step 2: Seed data
    await seedDatabase();
    
    console.log('\n🎉 Setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n💥 Setup failed:', error);
    process.exit(1);
  }
}

setup();