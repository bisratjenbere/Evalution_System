import express from "express";
import * as courseController from "../controllers/courseController.js";

const router = express.Router();

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);
router.get("/my-course", courseController.getActiveCoursesForStudent);
router.get("/department-course", courseController.getCoursesForDepartment);
router
  .route("/:id")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

export default router;
