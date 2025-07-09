import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';
import { problemsDataset, seedProblems } from '../data/problemsDataset.js';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codebattle';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting CodeBattle Problems Seeder...\n');
  
  try {
    // Connect to database
    await connectDB();
    
    // Seed problems
    console.log('📝 Seeding problems...');
    const problems = await seedProblems(Problem);
    
    console.log('\n📊 Seeding Summary:');
    console.log('===================');
    
    // Count by difficulty
    const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
    const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
    const hardCount = problems.filter(p => p.difficulty === 'Hard').length;
    
    console.log(`🟢 Easy Problems: ${easyCount}`);
    console.log(`🟡 Medium Problems: ${mediumCount}`);
    console.log(`🔴 Hard Problems: ${hardCount}`);
    console.log(`📈 Total Problems: ${problems.length}`);
    
    // Count by category
    const categories = {};
    problems.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    
    console.log('\n📂 Problems by Category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('🎯 Your CodeBattle platform is ready with sample problems!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n⚠️  Process interrupted');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️  Process terminated');
  await mongoose.connection.close();
  process.exit(0);
});

// Run the seeder
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
