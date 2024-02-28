import express from "express";

import {
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
  getActiveCoursesForStudent,
  getCoursesForDepartment,
} from "../controllers/courseController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get(
  "/active-courses-for-student",
  authorizePermissions("student"),
  getActiveCoursesForStudent
);
router.get(
  "/courses-for-department",
  authorizePermissions("head"),
  getCoursesForDepartment
);

router
  .route("/")
  .get(authorizePermissions("head"), getAllCourses)
  .post(authorizePermissions("head"), createCourse);
router
  .route("/:id")
  .get(getCourse)
  .patch(authorizePermissions("head"), updateCourse)
  .delete(authorizePermissions("head"), deleteCourse);

export default router;
