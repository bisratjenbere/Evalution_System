import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authenticateUser);
router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router.route("/my-peer").get(userController.getPeer);

// router.use(authorizePermissions("admin", "teamLeader", "head", "hr"));

router.route("/students/:id", userController.getStudentByDepartmentId);
router.route("/employee/:id", userController.getEmployeeByDepartmentId);

router.route("add-user").post(userController.createUser);
router.route("assign-role").patch(userController.assignRole);
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
