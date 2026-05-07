import { Router } from "express";
import { addUser, editUser, getUser, getUserById, deleteUser } from "./UserController.js";
const router = Router();
router.route("/").post(addUser).get(getUser);
router.route("/:id").put(editUser).get(getUserById).delete(deleteUser);
export default router;