import { StatusCodes } from "http-status-codes";
import Course from "../models/courseModel.js";
import catchAsync from "../utils/catchAsync.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handleFactory.js";

export const getAllCourses = getAll(Course);

export const createCourse = createOne(Course);

export const getCourse = getOne(Course, [
  { path: "instructor" },
  { path: "department" },
]);

export const updateCourse = updateOne(Course);

export const deleteCourse = deleteOne(Course);
export const getActiveCoursesForStudent = catchAsync(async (req, res, next) => {
  const studentId = req.user._id;
  const studentDepartment = req.user.department;
  const studentBatch = req.user.batch;

  const allCourse = await Course.find({
    department: studentDepartment,
    batch: studentBatch,
  }).populate("instructor", "_id");

  const activeCourses = allCourse.filter((course) => course.isActive);

  res.status(StatusCodes.OK).json({
    status: "success",
    courses: activeCourses,
  });
});

export const getCoursesForDepartment = catchAsync(async (req, res, next) => {
  const department = req.user.department;
  const departmentCourses = await Course.find({ department }).populate(
    "instructor",
    "_id"
  );
  const activeCourses = departmentCourses.filter((course) => course.isActive);
  res.status(StatusCodes.OK).json({
    status: "success",
    courses: activeCourses,
  });
});
