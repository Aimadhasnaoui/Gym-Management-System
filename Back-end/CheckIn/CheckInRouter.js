import { Router } from "express";
import {
  addCheckIn,
  deleteCheckIn,
  editCheckIn,
  getCheckIn,
  getCheckInById,
  getCheckInByMemberId,
} from "./ChekInController.js";
const router = Router();
router.route("/").post(addCheckIn).get(getCheckIn);
router.route("/:id").put(editCheckIn).get(getCheckInById).delete(deleteCheckIn);
router.route("/member-check-in/:id").get(getCheckInByMemberId);
export default router;
