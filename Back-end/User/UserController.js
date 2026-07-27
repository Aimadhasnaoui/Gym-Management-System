import User from "./User.js";
import Member from "../Members/Members.js";
import { cathFunction } from "../utils/CathFunction.js";
import { httpError } from "../utils/AppError.js";
import { hashToken } from "../utils/tokens.js";
import { recordLoginFailure, clearLoginAttempts } from "../utils/loginLockout.js";
import jwt from "jsonwebtoken";

export const addUser = cathFunction(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

export const editUser = cathFunction(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return next(new Error("User not found"));
  res.status(200).json({ success: true, data: user });
});

export const getUser = cathFunction(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

export const getUserById = cathFunction(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new Error("User not found"));
  res.status(200).json({ success: true, data: user });
});

export const deleteUser = cathFunction(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new Error("User not found"));
  res.status(200).json({ success: true, message: "User deleted successfully" });
});

export const Login = cathFunction(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ Email: email });
    if (!user) {
      recordLoginFailure(email);
      return next(httpError("No account found with this email address", 401));
    }
    if (!user.isActivated)
      return next(httpError("Account not activated. Please use the activation link sent to your email.", 403));
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      recordLoginFailure(email);
      return next(httpError("Incorrect password", 401));
    }
    clearLoginAttempts(email);

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );

  const isProd = process.env.ProjectEnv === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const member =
    user.role === "member"
      ? await Member.findOne({ userId: user._id }).populate("Plan")
      : null;

  res.status(200).json({
    success: true,
    data: {
      role: user.role === "admin" ? "admin" : "member",
      userId: user._id,
      token: token,
      name: user.FullName,
      memberId: member?._id ?? null,
    },
    member,
  });
});

export const Me = cathFunction(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("FullName role");
  if (!user) return next(new Error("User not found"));

  let memberId = null;
  if (user.role === "member") {
    const member = await Member.findOne({ userId: user._id }).select("_id");
    memberId = member?._id ?? null;
  }

  res.status(200).json({
    success: true,
    data: {
      role: user.role === "admin" ? "admin" : "member",
      userId: user._id,
      name: user.FullName,
      memberId,
    },
  });
});

export const Logout = (req, res) => {
  const isProd = process.env.ProjectEnv === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
  res.status(200).json({ success: true });
};
export const changePassword = cathFunction(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword)
        return next(new Error("Please provide both current and new password"));

    if (newPassword.length < 6)
        return next(new Error("New password must be at least 6 characters"));

    const user = await User.findById(req.user.id);
    if (!user) return next(new Error("User not found"));

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) return next(new Error("Current password is incorrect"));

    user.password = newPassword;
    await user.save(); // pre-save hook will hash the new password

    res.status(200).json({ success: true, message: "Password updated successfully" });
});

// GET /auth/activation/:uid/:token — check a link is valid before showing the form.
export const validateActivation = cathFunction(async (req, res, next) => {
  const { uid, token } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(uid))
    return next(httpError("Invalid or expired activation link", 400));

  const user = await User.findById(uid).select(
    "+activationTokenHash +activationTokenExpires",
  );
  if (
    !user ||
    user.isActivated ||
    !user.activationTokenHash ||
    !user.activationTokenExpires ||
    user.activationTokenExpires.getTime() < Date.now() ||
    user.activationTokenHash !== hashToken(token)
  ) {
    return next(httpError("Invalid or expired activation link", 400));
  }

  res.status(200).json({
    success: true,
    data: { name: user.FullName, email: user.Email },
  });
});

// POST /auth/set-password — { userId, token, password } — activate & set password.
export const setPassword = cathFunction(async (req, res, next) => {
  const { userId, token, password } = req.body;

  const user = await User.findById(userId).select(
    "+activationTokenHash +activationTokenExpires",
  );
  if (
    !user ||
    !user.activationTokenHash ||
    !user.activationTokenExpires ||
    user.activationTokenExpires.getTime() < Date.now() ||
    user.activationTokenHash !== hashToken(token)
  ) {
    return next(httpError("Invalid or expired activation link", 400));
  }

  user.password = password; // hashed by the pre-save hook
  user.isActivated = true;
  user.activationTokenHash = undefined;
  user.activationTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password set successfully. You can now sign in.",
  });
});