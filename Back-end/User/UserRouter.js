import { Router } from "express";
import { addUser, editUser, getUser, getUserById, deleteUser, changePassword } from "./UserController.js";
import { authorize } from "../utils/verifyToken.js";
import { validate } from "../utils/validate.js";
import { userCreateSchema, userUpdateSchema, changePasswordSchema } from "../utils/validators.js";

const router = Router();

// Any authenticated user may change their OWN password (uses req.user.id).
// Declared before "/:id" so it isn't captured as an id.
router.route("/change-password").put(validate(changePasswordSchema), changePassword);

router
  .route("/")
  .post(authorize("admin"), validate(userCreateSchema), addUser)
  .get(authorize("admin"), getUser);

router
  .route("/:id")
  .put(authorize("admin"), validate(userUpdateSchema), editUser)
  .get(authorize("admin"), getUserById)
  .delete(authorize("admin"), deleteUser);

export default router;
