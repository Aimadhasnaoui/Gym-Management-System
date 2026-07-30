import CheckIn from "./Checkin.js";
import { cathFunction } from "../utils/CathFunction.js";
import { issueNonce } from "../utils/qrNonces.js";

export const addCheckIn = cathFunction(async (req, res, next) => {
  // const existingCheckin = await CheckIn.findOne({
  //     MemberId: req.body.MemberId,
  //     CheckIn: {
  //         $gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
  //         $lt: new Date(new Date().setHours(23, 59, 59, 999)) // End of today
  //     }
  // });
  // if (existingCheckin) {
  //     return next(new Error("Vous avez déjà fait votre check-in pour aujourd'hui...", 400));
  // }
  const checkIn = await CheckIn.create(req.body);
  await checkIn.populate("MemberId", "FullName");
  res.status(201).json({ success: true, data: checkIn });
});

export const editCheckIn = cathFunction(async (req, res, next) => {
  const checkIn = await CheckIn.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!checkIn) return next(new Error("Check-in not found", 404));
  res.status(200).json({ success: true, data: checkIn });
});

export const getCheckIn = cathFunction(async (req, res, next) => {
  let filter = {};
  if (req.query.check === "today") {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    filter.CheckIn = { $gte: startOfDay, $lte: endOfDay };
  }
  if (req.query.memberId) {
    filter.MemberId = req.query.memberId;
  }
  const checkIns = await CheckIn.find(filter).populate("MemberId", "FullName");
  res.status(200).json({ success: true, data: checkIns });
});

export const getCheckInById = cathFunction(async (req, res, next) => {
  const checkIn = await CheckIn.findById(req.params.id).populate(
    "MemberId",
    "FullName",
  );
  if (!checkIn) return next(new Error("Check-in not found", 404));
  res.status(200).json({ success: true, data: checkIn });
});
export const getCheckInByMemberId = cathFunction(async (req, res, next) => {
  const checkIn = await CheckIn.find({ MemberId: req.params.id }).populate(
    "MemberId",
    "FullName",
  );
  if (!checkIn) return next(new Error("Check-in not found", 404));
  res.status(200).json({ success: true, data: checkIn });
});

export const deleteCheckIn = cathFunction(async (req, res, next) => {
  const checkIn = await CheckIn.findByIdAndDelete(req.params.id);
  if (!checkIn) return next(new Error("Check-in not found", 404));
  res
    .status(200)
    .json({ success: true, message: "Check-in deleted successfully" });
});

// The check-in display polls this to keep a fresh, scannable code on screen.
export const getQrCode = cathFunction(async (req, res) => {
  res.status(200).json({ success: true, data: issueNonce() });
});
