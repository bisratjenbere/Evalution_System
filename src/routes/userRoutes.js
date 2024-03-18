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
  uploadMiddleware,
  uploadEmployee,
} from "../controllers/userController.js";

import upload from "../middleware/multerMiddleware.js";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(authenticateUser);
router.post("/upload", uploadMiddleware, uploadEmployee);
router.route("/me").get(getMe, getUser);
router.route("/update-me").patch(getMe, upload.single("image"), updateMe);
router.route("/peers").get(getPeer);

router
  .route("/students/:id")
  .get(authorizePermissions("head"), getStudentByDepartmentId);

router
  .route("/employees/:id")
  .get(
    authorizePermissions("hr", "director", "teamLeader", "head", "admin"),
    getEmployeeByDepartmentId
  );
router.route("/delete-me").delete(deleteMe);
router
  .route("/")
  .post(authorizePermissions("head", "teamLeader", "admin", "hr"), createUser)
  .get(getAllUsers);
router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(authorizePermissions("head", "admin", "teamLeader"), deleteUser);
router
  .route("/assign-role/:id")
  .patch(authorizePermissions("admin"), assignRole);

export default router;
