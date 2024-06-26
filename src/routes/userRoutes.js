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
  getuserByDepartmentId,
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
router.route("/assign-role/:id").patch(assignRole);
router.post("/upload", uploadMiddleware, uploadEmployee);
router.route("/me").get(getMe, getUser);
router.route("/update-me/:id").patch(getMe, upload.single("image"), updateMe);
router.route("/peers").get(getPeer);
router.route("/alluser").get(getuserByDepartmentId);
router
  .route("/students/:id")
  .get(authorizePermissions("head"), getStudentByDepartmentId);

router
  .route("/employees/:id")
  .get(
    authorizePermissions(
      "hr",
      "director",
      "teamLeader",
      "head",
      "dean",
      "admin"
    ),
    getEmployeeByDepartmentId
  );
router.route("/delete-me").delete(deleteMe);
router.route("/").post(createUser).get(getAllUsers);
router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(authorizePermissions("head", "admin", "teamLeader"), deleteUser);

export default router;
