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

const router = express.Router();

router.route("/").get(getAllCourses).post(createCourse);

router.route("/:id").get(getCourse).patch(updateCourse).delete(deleteCourse);

router.get("/active-courses-for-student", getActiveCoursesForStudent);
router.get("/courses-for-department", getCoursesForDepartment);

export default router;
