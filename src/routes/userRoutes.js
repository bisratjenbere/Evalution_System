import express from "express";

import {
  getMe,
  updateMe,
  getPeer,
  getStudentByDepartmentId,
  getEmployeeByDepartmentId,
  deleteMe,
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  assignRole,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/me").get(getMe, getUser);
router.route("/update-me").patch(updateMe);
router.route("/peers").get(getPeer);
router.route("/students/:id").get(getStudentByDepartmentId);
router.route("/employees/:id").get(getEmployeeByDepartmentId);
router.route("/delete-me").delete(deleteMe);
router.route("/users").post(createUser).get(getAllUsers);
router.route("/users/:id").get(getUser).patch(updateUser).delete(deleteUser);
router.route("/assign-role/:id").patch(assignRole);

export default router;
