import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './User/User.js';
import Member from './Members/Members.js';
import Plan from './Plans/Plans.js';
import CheckIn from './CheckIn/Checkin.js';

dotenv.config();

const maskedUri = (uri = '') => uri.replace(/\/\/([^:]+):[^@]+@/, '//$1:***@');

const reset = async () => {
  if (!process.argv.includes('--force')) {
    console.log('This will permanently delete ALL data (Users, Members, Plans, CheckIns).');
    console.log(`Target: ${maskedUri(process.env.DatabaseConectionString)}`);
    console.log('Re-run with --force to proceed: npm run reset -- --force');
    process.exit(1);
  }

  await mongoose.connect(process.env.DatabaseConectionString);
  console.log('Connected to MongoDB');

  const [users, members, plans, checkIns] = await Promise.all([
    User.deleteMany(),
    Member.deleteMany(),
    Plan.deleteMany(),
    CheckIn.deleteMany(),
  ]);

  const total = users.deletedCount + members.deletedCount + plans.deletedCount + checkIns.deletedCount;
  console.log(`\n✓ Cleared ${total} documents:`);
  console.log(`  Users:     ${users.deletedCount}`);
  console.log(`  Members:   ${members.deletedCount}`);
  console.log(`  Plans:     ${plans.deletedCount}`);
  console.log(`  CheckIns:  ${checkIns.deletedCount}`);
  console.log('\nDatabase is now empty. Run "npm run seed" to repopulate it.');

  await mongoose.disconnect();
};

reset().catch((err) => {
  console.error('\n✗ Reset failed:', err.message);
  process.exit(1);
});
