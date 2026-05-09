import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './User/User.js';
import Member from './Members/Members.js';
import Plan from './Plans/Plans.js';
import CheckIn from './CheckIn/Checkin.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.DatabaseConectionString);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany(),
    Member.deleteMany(),
    Plan.deleteMany(),
    CheckIn.deleteMany(),
  ]);
  console.log('Collections cleared');

  // --- Plans (duration in months) ---
  const [basic, premium, quarterly, annual] = await Plan.insertMany([
    { name: 'Monthly Basic',   price: 39,  duration: 1  },
    { name: 'Monthly Premium', price: 69,  duration: 1  },
    { name: 'Quarterly',       price: 99,  duration: 3  },
    { name: 'Annual',          price: 299, duration: 12 },
  ]);
  console.log('Created 4 plans');

  // --- Users ---
  // Admin is created separately; member users use their member email.
  // Each save() triggers the bcrypt pre-save hook — insertMany would bypass it.
  const admin = await new User({
    FullName: 'Admin User',
    Email: 'admin@fitcore.com',
    password: 'admin',
    role: 'admin',
  }).save();

  const memberUsersData = [
    { FullName: 'Alex Rivera',  Email: 'alex.rivera@example.com',  password: 'alex'   },
    { FullName: 'Jordan Kim',   Email: 'jordan.kim@example.com',   password: 'jordan' },
    { FullName: 'Sam Torres',   Email: 'sam.torres@example.com',   password: 'sam'    },
    { FullName: 'Morgan Lee',   Email: 'morgan.lee@example.com',   password: 'morgan' },
    { FullName: 'Casey Patel',  Email: 'casey.patel@example.com',  password: 'casey'  },
    { FullName: 'Riley Chen',   Email: 'riley.chen@example.com',   password: 'riley'  },
    { FullName: 'Drew Martin',  Email: 'drew.martin@example.com',  password: 'drew'   },
    { FullName: 'Quinn Walsh',  Email: 'quinn.walsh@example.com',  password: 'quinn'  },
  ];

  const [uAlex, uJordan, uSam, uMorgan, uCasey, uRiley, uDrew, uQuinn] =
    await Promise.all(memberUsersData.map(d => new User({ ...d, role: 'member' }).save()));

  console.log(`Created ${1 + memberUsersData.length} users`);

  // --- Members ---
  const [alex, jordan, sam, morgan, casey, riley, drew, quinn] = await Member.insertMany([
    {
      FullName: 'Alex Rivera', Email: 'alex.rivera@example.com',
      phone: '+1 555-0101', address: '123 Main St, Springfield',
      Plan: basic._id,
      startDate: new Date('2026-04-10'), endDate: new Date('2026-05-10'),
      status: 'Expiring',
      userId: uAlex._id,
    },
    {
      FullName: 'Jordan Kim', Email: 'jordan.kim@example.com',
      phone: '+1 555-0102', address: '456 Oak Ave, Springfield',
      Plan: annual._id,
      startDate: new Date('2026-01-01'), endDate: new Date('2027-01-01'),
      status: 'active',
      userId: uJordan._id,
    },
    {
      FullName: 'Sam Torres', Email: 'sam.torres@example.com',
      phone: '+1 555-0103', address: '789 Pine Rd, Springfield',
      Plan: basic._id,
      startDate: new Date('2026-04-01'), endDate: new Date('2026-05-01'),
      status: 'inactive',
      userId: uSam._id,
    },
    {
      FullName: 'Morgan Lee', Email: 'morgan.lee@example.com',
      phone: '+1 555-0104', address: '321 Elm St, Springfield',
      Plan: premium._id,
      startDate: new Date('2026-04-09'), endDate: new Date('2026-05-09'),
      status: 'Expiring',
      userId: uMorgan._id,
    },
    {
      FullName: 'Casey Patel', Email: 'casey.patel@example.com',
      phone: '+1 555-0105', address: '654 Maple Dr, Springfield',
      Plan: quarterly._id,
      startDate: new Date('2026-03-20'), endDate: new Date('2026-06-20'),
      status: 'active',
      userId: uCasey._id,
    },
    {
      FullName: 'Riley Chen', Email: 'riley.chen@example.com',
      phone: '+1 555-0106', address: '987 Cedar Ln, Springfield',
      Plan: basic._id,
      startDate: new Date('2026-04-12'), endDate: new Date('2026-05-12'),
      status: 'Expiring',
      userId: uRiley._id,
    },
    {
      FullName: 'Drew Martin', Email: 'drew.martin@example.com',
      phone: '+1 555-0107', address: '147 Birch Blvd, Springfield',
      Plan: annual._id,
      startDate: new Date('2025-12-01'), endDate: new Date('2026-12-01'),
      status: 'active',
      userId: uDrew._id,
    },
    {
      FullName: 'Quinn Walsh', Email: 'quinn.walsh@example.com',
      phone: '+1 555-0108', address: '258 Walnut Way, Springfield',
      Plan: quarterly._id,
      startDate: new Date('2026-01-01'), endDate: new Date('2026-04-01'),
      status: 'inactive',
      userId: uQuinn._id,
    },
  ]);
  console.log('Created 8 members');

  // --- Check-ins ---
  await CheckIn.insertMany([
    // Jordan Kim — frequent visitor
    { MemberId: jordan._id, CheckIn: new Date('2026-05-07T09:15:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-05-06T10:30:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-05-05T08:45:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-05-02T11:00:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-05-01T09:30:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-04-29T10:15:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-04-28T09:00:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-04-25T11:30:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-04-22T08:30:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-04-20T10:00:00') },
    { MemberId: jordan._id, CheckIn: new Date('2026-04-18T09:45:00') },
    // Alex Rivera
    { MemberId: alex._id, CheckIn: new Date('2026-05-07T14:20:00') },
    { MemberId: alex._id, CheckIn: new Date('2026-05-05T15:00:00') },
    { MemberId: alex._id, CheckIn: new Date('2026-05-03T13:30:00') },
    { MemberId: alex._id, CheckIn: new Date('2026-04-30T14:00:00') },
    // Morgan Lee
    { MemberId: morgan._id, CheckIn: new Date('2026-05-07T16:00:00') },
    { MemberId: morgan._id, CheckIn: new Date('2026-05-06T15:30:00') },
    { MemberId: morgan._id, CheckIn: new Date('2026-05-04T16:15:00') },
    { MemberId: morgan._id, CheckIn: new Date('2026-05-01T17:00:00') },
    { MemberId: morgan._id, CheckIn: new Date('2026-04-28T16:30:00') },
    // Casey Patel
    { MemberId: casey._id, CheckIn: new Date('2026-05-07T07:30:00') },
    { MemberId: casey._id, CheckIn: new Date('2026-05-06T07:15:00') },
    { MemberId: casey._id, CheckIn: new Date('2026-05-04T08:00:00') },
    // Riley Chen
    { MemberId: riley._id, CheckIn: new Date('2026-05-07T12:00:00') },
    { MemberId: riley._id, CheckIn: new Date('2026-05-05T11:45:00') },
    // Drew Martin
    { MemberId: drew._id, CheckIn: new Date('2026-05-07T18:00:00') },
    { MemberId: drew._id, CheckIn: new Date('2026-05-06T18:30:00') },
    { MemberId: drew._id, CheckIn: new Date('2026-05-05T17:45:00') },
    { MemberId: drew._id, CheckIn: new Date('2026-05-03T18:00:00') },
    // Sam Torres — old check-ins before expiry
    { MemberId: sam._id, CheckIn: new Date('2026-04-28T10:00:00') },
    { MemberId: sam._id, CheckIn: new Date('2026-04-25T11:00:00') },
  ]);
  console.log('Created 31 check-ins');

  console.log('\n✓ Database seeded successfully!');
  console.log('\nAdmin login:');
  console.log('  admin@fitcore.com  /  admin');
  console.log('\nMember logins (email / first name):');
  memberUsersData.forEach(u => console.log(`  ${u.Email.padEnd(30)} / ${u.password}`));

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('\n✗ Seed failed:', err.message);
  process.exit(1);
});
