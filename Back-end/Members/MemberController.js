import Member from "./Members.js";
import { cathFunction } from "../utils/CathFunction.js";

export const addMember = cathFunction(async (req, res, next) => {
    const member = await Member.create(req.body);
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
    res.status(200).json({ success: true, message: "Member deleted successfully" });
});
