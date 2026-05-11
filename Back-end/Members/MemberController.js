import Member from "./Members.js";
import User from "../User/User.js";
import { cathFunction } from "../utils/CathFunction.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

/** Generate a random readable password e.g. "Tz8#kR2m" */
const generatePassword = () => {
  const upper  = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower  = "abcdefghjkmnpqrstuvwxyz";
  const digits = "23456789";
  const special = "#@!";
  const all = upper + lower + digits + special;
  let pwd = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)],
  ];
  for (let i = 0; i < 4; i++) pwd.push(all[Math.floor(Math.random() * all.length)]);
  return pwd.sort(() => Math.random() - 0.5).join('');
};

export const addMember = cathFunction(async (req, res, next) => {
  const { FullName, Email, phone, address, Plan, startDate, endDate } = req.body;

  // 1 — Create the member
  const member = await Member.create({ FullName, Email, phone, address, Plan, startDate, endDate });

  // 2 — Auto-create a User account with a temp password
  const tempPassword = generatePassword();
  const user = await User.create({
    FullName,
    Email,
    password: tempPassword,
    role: "member",
  });

  // 3 — Link the user to the member
  member.userId = user._id;
  await member.save();

  // 4 — Send welcome email (non-blocking — don't fail the request if email fails)
  sendWelcomeEmail({ to: Email, fullName: FullName, email: Email, password: tempPassword })
    .catch(err => console.error("Welcome email failed:", err.message));

  res.status(201).json({ success: true, data: member });
});

export const editMember = cathFunction(async (req, res, next) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!member) return next(new Error("Member not found"));
  res.status(200).json({ success: true, data: member });
});

export const getMember = cathFunction(async (req, res, next) => {
  const members = await Member.find().populate("Plan");
  res.status(200).json({ success: true, data: members });
});

export const getMemberById = cathFunction(async (req, res, next) => {
  const member = await Member.findById(req.params.id).populate("Plan");
  if (!member) return next(new Error("Member not found"));
  res.status(200).json({ success: true, data: member });
});

export const deleteMember = cathFunction(async (req, res, next) => {
  const member = await Member.findByIdAndDelete(req.params.id);
  if (!member) return next(new Error("Member not found"));

  // Delete the linked user account so they can no longer log in
  if (member.userId) {
    await User.findByIdAndDelete(member.userId);
  }

  res.status(200).json({ success: true, message: "Member and linked user account deleted successfully" });
});