import multer from "multer";
import sharp from "sharp";
import User from "../models/userModel.js";
import Department from "../models/departmentModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as factory from "./handleFactory.js";
import { StatusCodes } from "http-status-codes";
import XLSX from "xlsx";
import { formatImage } from "../middleware/multerMiddleware.js";

import cloudinary from "cloudinary";
// import Email from "../utils/email.js";

import {
  generateRandomPassword,
  hashPassword,
} from "../utils/passwordUtils.js";
import EvaluationResult from "../models/apprisalResultModel.js";

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};
export const updateMe = catchAsync(async (req, res, next) => {
  const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "batch"
  );

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (req.file) {
    if (req.file && updatedUser.avatarPublicId) {
      await cloudinary.v2.uploader.destroy(updatedUser.avatarPublicId);
    }
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    updatedUser.avatar = response.secure_url;
    updatedUser.avatarPublicId = response.public_id;
  }

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

export const getPeer = catchAsync(async (req, res, next) => {
  let matchedUser = {};

  const currentUser = req.user;
  if (
    currentUser.role === "director" ||
    currentUser.role === "teamLeader" ||
    currentUser.role === "dean" ||
    currentUser.role === "head"
  ) {
    matchedUser["college"] = req.user.college;
  } else {
    matchedUser["department"] = req.user.department;
  }

  const peers = await User.find({
    ...matchedUser,
    role: currentUser.role,
    _id: { $ne: currentUser._id },
  });

  res.status(StatusCodes.OK).json({ status: "success", data: peers });
});

export const getStudentByDepartmentId = catchAsync(async (req, res, next) => {
  const depId = req.params.id;
  const students = await User.find({ department: depId, role: "student" });

  if (!students || students.length === 0) {
    return next(
      new AppError("No Student Found with this depId", StatusCodes.NOT_FOUND)
    );
  }
  return res.status(StatusCodes.OK).json({
    status: "success",
    data: students,
  });
});
export const getEmployeeByDepartmentId = catchAsync(async (req, res, next) => {
  const depId = req.params.id;
  const employee = await User.find({
    department: depId,
    role: { $ne: "student" },
  }).populate({ path: "department" });

  if (!employee || employee.length === 0)
    return new AppError("No Employee Found with this depId");

  res.status(StatusCodes.OK).json({ status: "success", data: employee });
});

export const getUnEvalutedEmployeeByDepartmentId = catchAsync(
  async (req, res, next) => {
    const depId = req.params.id;
    const employee = await User.find({
      department: depId,
      role: { $ne: "student" },
    }).populate({ path: "department" });

    if (!employee || employee.length === 0)
      return new AppError("No Employee Found with this depId");

    employee.filter(async (emp) => {
      const result = await EvaluationResult.findOne({
        evaluatedUserId: emp._id,
        evaluter: req.user._id,
      });
    });

    if (result.length)
      res.status(StatusCodes.OK).json({ status: "success", data: employee });
  }
);
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
export const createUser = catchAsync(async (req, res) => {
  let randomePassword;
  if (req.body.role === "student") {
    randomePassword = generateRandomPassword(6);
    req.body.password = await hashPassword(randomePassword);
  }
  const newUser = await User.create(req.body);
  // req.body.role && (await new Email("password reset token", randomePassword));

  res.status(StatusCodes.CREATED).json({ status: "success", data: newUser });
});
export const getUser = factory.getOne(User);
export const getAllUsers = factory.getAll(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
export const assignRole = catchAsync(async (req, res, next) => {
  if (req.body.role === "student")
    return next(new AppError("This Route is For Employee "));
  const password = generateRandomPassword(6);
  req.body.password = await hashPassword(password);
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(
      new AppError("There is No User Updated", StatusCodes.NOT_FOUND)
    );
  }
  // const emailInstance = new Email("credential sent");
  // await emailInstance.send();
  res.status(200).json({ message: "User updated and email sent successfully" });
});

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

export const uploadMiddleware = upload.single("course");

async function processEmployeeDataAndSave(data, req) {
  try {
    for (let row = 1; row < data.length; row++) {
      const newEmployee = new User({
        firstName: data[row][0],
        lastName: data[row][1],
        dateOfJoining: new Date(data[row][2]),
        email: data[row][3],
        salutation: data[row][4],
        experience: parseInt(data[row][5]),
        department: req.user.department,
        college: req.user.college,
      });

      await newEmployee.save();
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const uploadEmployee = async (req, res) => {
  try {
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const success = await processEmployeeDataAndSave(data, req);

    if (success) {
      return res.json({
        status: "sucess",
        msg: "Employee successfully saved.",
      });
    } else {
      return res.json({ status: "failed", msg: "Error processing data." });
    }
  } catch (error) {
    console.error(error);
    return res.json({ status: "failed", msg: "Error uploading file." });
  }
};
