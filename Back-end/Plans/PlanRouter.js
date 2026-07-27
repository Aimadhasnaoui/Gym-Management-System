import { Router } from "express";
import { addPlan, deletePlan, editPlan, getPlan, getPlanById } from "./PlansController.js";
import { authorize } from "../utils/verifyToken.js";
import { validate } from "../utils/validate.js";
import { planCreateSchema, planUpdateSchema } from "../utils/validators.js";

const router = Router();

// Reads are open to any authenticated user (members need to see their plan).
router
  .route("/")
  .post(authorize("admin"), validate(planCreateSchema), addPlan)
  .get(getPlan);

router
  .route("/:id")
  .put(authorize("admin"), validate(planUpdateSchema), editPlan)
  .get(getPlanById)
  .delete(authorize("admin"), deletePlan);

export default router;
