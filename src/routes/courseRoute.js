import express from "express";

import {
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getActiveCoursesForStudent,
  getCoursesForDepartment,
  uploadCourse,
} from "../controllers/courseController.js";

import { uploadMiddleware } from "../controllers/userController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get(
  "/active-courses-for-student",
  authorizePermissions("student"),
  getActiveCoursesForStudent
);

router.post("/upload", uploadMiddleware, uploadCourse);
router.get(
  "/courses-for-department",
  authorizePermissions("head"),
  getCoursesForDepartment
);

router
  .route("/")
  .get(authorizePermissions("head"), getAllCourses)
  .post(authorizePermissions("head", "student"), createCourse);
router
  .route("/:id")
  .get(getCourse)
  .patch(authorizePermissions("head"), updateCourse)
  .delete(authorizePermissions("head"), deleteCourse);

export default router;
