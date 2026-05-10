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
    const { email, password } = req.body;
    const user = await User.findOne({ Email: email });
    if (!user) return next(new Error("No account found with this email address"));
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new Error("Incorrect password"));

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    const isProd = process.env.ProjectEnv === 'production';
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const member = user.role === 'member'
        ? await Member.findOne({ userId: user._id }).populate('Plan')
        : null;

    res.status(200).json({
        success: true,
        data: {
            role: user.role === 'admin' ? 'admin' : 'member',
            userId: user._id,
            name: user.FullName,
            memberId: member?._id ?? null,
        },
        member,
    });
});

export const Me = cathFunction(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('FullName role');
    if (!user) return next(new Error("User not found"));

    let memberId = null;
    if (user.role === 'member') {
        const member = await Member.findOne({ userId: user._id }).select('_id');
        memberId = member?._id ?? null;
    }

    res.status(200).json({
        success: true,
        data: {
            role: user.role === 'admin' ? 'admin' : 'member',
            userId: user._id,
            name: user.FullName,
            memberId,
        },
    });
});

export const Logout = (req, res) => {
    const isProd = process.env.ProjectEnv === 'production';
    res.clearCookie('token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
    res.status(200).json({ success: true });
};