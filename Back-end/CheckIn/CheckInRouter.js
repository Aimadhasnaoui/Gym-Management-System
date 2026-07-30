import { Router } from "express";
import {
  addCheckIn,
  deleteCheckIn,
  editCheckIn,
  getCheckIn,
  getCheckInById,
  getCheckInByMemberId,
  getQrCode,
} from "./ChekInController.js";
import { authorize, authorizeSelfOrAdmin, authorizeCheckInCreate } from "../utils/verifyToken.js";
import { validate } from "../utils/validate.js";
import { checkInCreateSchema, checkInUpdateSchema } from "../utils/validators.js";

const router = Router();

router
  .route("/")
  // Members may check IN themselves; admins may create for anyone.
  .post(validate(checkInCreateSchema), authorizeCheckInCreate, addCheckIn)
  .get(authorize("admin"), getCheckIn);

// MUST stay above "/:id" — Express matches in registration order, and declared
// after it this would bind as :id = "qr" and blow up on the ObjectId cast.
router.route("/qr").get(authorize("admin"), getQrCode);

router
  .route("/:id")
  .put(authorize("admin"), validate(checkInUpdateSchema), editCheckIn)
  .get(authorize("admin"), getCheckInById)
  .delete(authorize("admin"), deleteCheckIn);

// A member may read their OWN check-in history; admins may read anyone's.
router.route("/member-check-in/:id").get(authorizeSelfOrAdmin, getCheckInByMemberId);

export default router;
