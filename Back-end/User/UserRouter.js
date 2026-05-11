import { Router } from "express";
import { addUser, editUser, getUser, getUserById, deleteUser, changePassword } from "./UserController.js";

const router = Router();

router.route("/").post(addUser).get(getUser);
router.route("/change-password").put(changePassword);
router.route("/:id").put(editUser).get(getUserById).delete(deleteUser);

export default router;