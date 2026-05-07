import { Router } from "express";
import { addPlan, deletePlan, editPlan, getPlan, getPlanById } from "./PlansController.js";
const router = Router();
router.route("/").post(addPlan).get(getPlan);
router.route("/:id").put(editPlan).get(getPlanById).delete(deletePlan);
export default router;