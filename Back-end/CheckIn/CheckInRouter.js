import { Router } from "express";
import {
  addCheckIn,
  deleteCheckIn,
  editCheckIn,
  getCheckIn,
  getCheckInById,
} from "./ChekInController.js";
const router = Router();
router.route("/").post(addCheckIn).get(getCheckIn);
router.route("/:id").put(editCheckIn).get(getCheckInById).delete(deleteCheckIn);
export default router;
