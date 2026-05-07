import CheckIn from "./Checkin.js";
import { cathFunction } from "../utils/CathFunction.js";

export const addCheckIn = cathFunction(async (req, res, next) => {
    const checkIn = await CheckIn.create(req.body);
    res.status(201).json({ success: true, data: checkIn });
});

export const editCheckIn = cathFunction(async (req, res, next) => {
    const checkIn = await CheckIn.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!checkIn) return next(new Error("Check-in not found",404));
    res.status(200).json({ success: true, data: checkIn });
});

export const getCheckIn = cathFunction(async (req, res, next) => {
    const checkIns = await CheckIn.find().populate("MemberId");
    res.status(200).json({ success: true, data: checkIns });
});

export const getCheckInById = cathFunction(async (req, res, next) => {
    const checkIn = await CheckIn.findById(req.params.id).populate("MemberId");
    if (!checkIn) return next(new Error("Check-in not found",404));
    res.status(200).json({ success: true, data: checkIn });
});

export const deleteCheckIn = cathFunction(async (req, res, next) => {
    const checkIn = await CheckIn.findByIdAndDelete(req.params.id);
    if (!checkIn) return next(new Error("Check-in not found",404));
    res.status(200).json({ success: true, message: "Check-in deleted successfully" });
});
