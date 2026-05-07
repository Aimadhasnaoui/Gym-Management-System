import { Router } from "express";
import { addMember, deleteMember, editMember, getMember, getMemberById } from "./MemberController.js";
const router = Router();
router.route("/").post(addMember).get(getMember);
router.route("/:id").put(editMember).get(getMemberById).delete(deleteMember);
export default router;