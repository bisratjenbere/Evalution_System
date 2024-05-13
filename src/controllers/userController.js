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
import Email from "../utils/email.js";

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
    "role",
    "phone",
    "address",
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

  await updatedUser.save();
  console.log(updatedUser);
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
  const { role } = req.user;

  let employee;
  if (role === "director") {
    const director = await User.findById(req.user._id);
    employee = await User.find({
      college: director.college,
      role: "teamLeader",
    }).populate({ path: "department" });
  } else if (role === "dean") {
    employee = await User.find({
      college: req.user.college,
      role: "head",
    }).populate({ path: "department" });
  } else {
    employee = await User.find({
      department: depId,
      role: { $nin: ["student", "teamLeader", "head"] },
    }).populate({ path: "department" });
  }

  if (!employee || employee.length === 0)
    return next(new AppError("No Employee Found with this department ID", 404));

  res.status(StatusCodes.OK).json({ status: "success", data: employee });
});

export const getUnEvalutedEmployeeByDepartmentId = catchAsync(
  async (req, res, next) => {
    const depId = req.params.id;
    const employee = await User.find({
      department: depId,
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

  req.body.department = req.user.department;

  req.body.college = req.user.college;
  const newUser = await User.create(req.body);
  console.log(newUser);
  if (req.body.role) {
    try {
      await new Email(newUser, null).sendGeneratedPassword(randomePassword);

      newUser.role = req.body.role;
      await newUser.save();
    } catch (error) {
      console.error("Error sending email:", error);
      await User.findByIdAndDelete(newUser._id);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "error", msg: "Failed to send email" });
    }
  }
  res
    .status(StatusCodes.CREATED)
    .json({ status: "success", msg: "sucessfully created" });
});
export const getUser = factory.getOne(User, [
  { path: "college" },
  { path: "department" },
]);
export const getAllUsers = factory.getAll(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
export const assignRole = catchAsync(async (req, res, next) => {
  const roleMappings = req.body;

  if (
    !roleMappings ||
    typeof roleMappings !== "object" ||
    Object.keys(roleMappings).length === 0
  ) {
    return next(
      new AppError("Invalid request format", StatusCodes.BAD_REQUEST)
    );
  }

  const promises = Object.entries(roleMappings).map(async ([userId, role]) => {
    if (role === "student") {
      return next(
        new AppError(
          `This Route is For Employee (User ID: ${userId})`,
          StatusCodes.OK
        )
      );
    }

    const password = generateRandomPassword(6);
    const generatedPassword = await hashPassword(password);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role, password: generatedPassword },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return next(
        new AppError(`User with ID ${userId} not found`, StatusCodes.NOT_FOUND)
      );
    }

    await new Email(updatedUser, null).sendGeneratedPassword(password);
  });

  await Promise.all(promises);

  res
    .status(200)
    .json({ message: "Users updated and emails sent successfully" });
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

export const getuserByDepartmentId = catchAsync(async (req, res, next) => {
  const { role } = req.user;

  let employee = await User.find({
    department: req.user.department,
    role: { $nin: ["teamLeader", "head"] },
  }).populate({ path: "department" });

  if (!employee || employee.length === 0)
    return next(new AppError("No Employee Found with this department ID", 404));

  res.status(StatusCodes.OK).json({ status: "success", data: employee });
});
