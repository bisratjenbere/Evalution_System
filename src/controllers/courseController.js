import { StatusCodes } from "http-status-codes";
import Course from "../models/courseModel.js";
import catchAsync from "../utils/catchAsync.js";
import XLSX from "xlsx";
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
  const studentBatch = req.user?.batch;
  const studentSection = req.user?.section;

  const allCourse = await Course.find({
    batch: studentBatch,
    section: studentSection,
  }).populate({ path: "instructor" });

  const activeCourses = allCourse.filter((course) => course.isActive);

  return res.status(StatusCodes.OK).json({
    status: "success",
    data: activeCourses,
  });
});

export const getCoursesForDepartment = catchAsync(async (req, res, next) => {
  const department = req.user.department;
  const departmentCourses = await Course.find({ department }).populate([
    { path: "instructor" },
    { path: "department" },
  ]);
  const activeCourses = departmentCourses.filter((course) => course.isActive);
  return res.status(StatusCodes.OK).json({
    status: "success",
    courses: activeCourses,
  });
});

async function processDataAndSave(data, req) {
  try {
    const headDeptID = req.user.department;

    for (let row = 1; row < data.length; row++) {
      const newCourse = new Course({
        code: data[row][0],
        name: data[row][1],
        batch: parseInt(data[row][2]),
        semester: parseInt(data[row][3]),
        section: parseInt(data[row][4]),
        department: headDeptID,
        startDate: new Date(data[row][5]),
        endDate: new Date(data[row][6]),
      });

      await newCourse.save();
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const uploadCourse = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const success = await processDataAndSave(data, req);

    if (success) {
      return res.json({ status: "sucess", msg: "Courses successfully saved." });
    } else {
      return res.json({ status: "failed", msg: "Error processing data." });
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: "failed", msg: "Error uploading file." });
  }
};
