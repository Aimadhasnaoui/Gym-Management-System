import Plan from "./Plans.js";
import { cathFunction } from "../utils/CathFunction.js";

export const addPlan = cathFunction(async (req, res, next) => {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, data: plan });
});

export const editPlan = cathFunction(async (req, res, next) => {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return next(new Error("Plan not found"));
    res.status(200).json({ success: true, data: plan });
});

export const getPlan = cathFunction(async (req, res, next) => {
    const plans = await Plan.find();
    res.status(200).json({ success: true, data: plans });
});

export const getPlanById = cathFunction(async (req, res, next) => {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return next(new Error("Plan not found"));
    res.status(200).json({ success: true, data: plan });
});

export const deletePlan = cathFunction(async (req, res, next) => {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return next(new Error("Plan not found"));
    res.status(200).json({ success: true, message: "Plan deleted successfully" });
});
