import Member from "./Members.js";
import User from "../User/User.js";
import { cathFunction } from "../utils/CathFunction.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";
import { createActivationToken } from "../utils/tokens.js";

export const addMember = cathFunction(async (req, res, next) => {
  const { FullName, Email, phone, address, Plan, startDate, endDate } = req.body;

  // 1 — Create the member
  const member = await Member.create({ FullName, Email, phone, address, Plan, startDate, endDate });

  // 2 — Auto-create a User account WITHOUT a password. The member sets their
  //     own password through a one-time, time-limited activation link.
  const { token, hash, expires } = createActivationToken();
  const user = await User.create({
    FullName,
    Email,
    role: "member",
    isActivated: false,
    activationTokenHash: hash,
    activationTokenExpires: expires,
  });

  // 3 — Link the user to the member
  member.userId = user._id;
  await member.save();

  // 4 — Email the activation link (non-blocking — don't fail the request if email fails)
  const base = process.env.FRONTEND_URL?.replace(/\/$/, "") ?? "";
  const activationUrl = `${base}/activate?uid=${user._id}&token=${token}`;
  sendWelcomeEmail({ to: Email, fullName: FullName, activationUrl })
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