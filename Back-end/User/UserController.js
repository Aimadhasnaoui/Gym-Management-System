import User from "./User.js";
import Member from "../Members/Members.js";
import { cathFunction } from "../utils/CathFunction.js";
import jwt from "jsonwebtoken";

export const addUser = cathFunction(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
});

export const editUser = cathFunction(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
    const { Email, password } = req.body;
    const user = await User.findOne({ Email });
    if (!user) return next(new Error("User not found"));
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new Error("Invalid credentials"));

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123', {
        expiresIn: '30d'
    });

    const member = user.role === 'user'
        ? await Member.findOne({ userId: user._id }).populate('Plan')
        : null;

    res.status(200).json({ success: true, token, data: user, member });
});