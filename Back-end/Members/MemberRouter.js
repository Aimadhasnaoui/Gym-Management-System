import { Router } from "express";
import { addMember, deleteMember, editMember, getMember, getMemberById } from "./MemberController.js";
import { authorize, authorizeSelfOrAdmin } from "../utils/verifyToken.js";
import { validate } from "../utils/validate.js";
import { memberCreateSchema, memberUpdateSchema } from "../utils/validators.js";

const router = Router();

router
  .route("/")
  .post(authorize("admin"), validate(memberCreateSchema), addMember)
  .get(authorize("admin"), getMember);

router
  .route("/:id")
  .put(authorize("admin"), validate(memberUpdateSchema), editMember)
  .get(authorizeSelfOrAdmin, getMemberById)
  .delete(authorize("admin"), deleteMember);

export default router;
