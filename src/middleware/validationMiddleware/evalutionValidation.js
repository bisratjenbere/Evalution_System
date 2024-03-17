import AppError from "../../utils/appError.js";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import withValidationErrors from "./validationError.js";
import { body, param } from "express-validator";
import Course from "../../models/courseModel.js";
import User from "../../models/userModel.js";

const validateArrayItems = (evalData) => {
  if (!Array.isArray(evalData)) {
    throw new AppError(
      "Evaluation data should be an array",
      StatusCodes.BAD_REQUEST
    );
  }

  const isValidArray = evalData.every(
    (item) =>
      typeof item === "object" && "rating" in item && "questionId" in item
  );

  if (!isValidArray) {
    throw new AppError(
      "Each item in evalData should be an object with 'rating' and 'questionId'",
      StatusCodes.BAD_REQUEST
    );
  }

  return true;
};

const validateEvaluationInput = withValidationErrors([
  body("templete").notEmpty().withMessage("Template ID is required"),
  body("evalData")
    .isArray()
    .withMessage("Evaluation data should be an array")
    .custom((evalData) => {
      return validateArrayItems(evalData);
    }),
]);

const validateIdParams = withValidationErrors([
  param("id").custom((value) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) {
      throw new AppError("Invalid id", StatusCodes.BAD_REQUEST);
    }
    return isValidMongoId;
  }),
]);

const validateCourseId = withValidationErrors([
  param("id").custom(async (value) => {
    const course = await Course.findById(value);
    if (!course) {
      throw new AppError("No Course found with that ID", StatusCodes.NOT_FOUND);
    }
  }),
]);

const ensureUserExists = async (value, { req }) => {
  const user = await User.findById(value);
  if (!user) {
    throw new AppError("No User found with that ID", StatusCodes.NOT_FOUND);
  }
  return user;
};

const ensureUserIsDepartmentMember = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const user = await ensureUserExists(value, { req });
    const reviewedUser = await User.findOne({
      department: req.user.department,
      _id: req.params.id,
      role: { $nin: ["student", "head", "teamLeader", "director", "dean"] },
    });

    if (!reviewedUser) {
      throw new AppError(
        `User is not a member of The department`,
        StatusCodes.FORBIDDEN
      );
    }

    return true;
  }),
]);

const ensureUserIsDepartmentHead = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const user = await ensureUserExists(value, { req });
    if (!user?.college.equals(req.user?.college)) {
      throw new AppError(
        `The user is not part of the college`,
        StatusCodes.NOT_FOUND
      );
    }

    if (!(user.role === "head" || user.role === "teamLeader")) {
      throw new AppError(
        `The User must be head or TeamLeader `,
        StatusCodes.FORBIDDEN
      );
    }
    let evalutedUserRoleValid = false;
    if (req.user.role === "director") {
      evalutedUserRoleValid = user.role === "teamLeader" ? true : false;
    } else {
      evalutedUserRoleValid = user.role === "head" ? true : false;
    }

    if (!evalutedUserRoleValid)
      throw new AppError(
        `The Evaluted User Must Have Valid Role`,
        StatusCodes.FORBIDDEN
      );

    return true;
  }),
]);
const ensureUserIsPeer = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const user = await ensureUserExists(value, { req });

    let isPeer = req.user.role === user.role;

    if (["director", "teamLeader", "dean", "head"].includes(req.user.role)) {
      isPeer = req.user.college.equals(user.college) && isPeer;
    } else {
      isPeer = req.user.department.equals(user.department);
    }

    if (!isPeer) {
      throw new AppError(
        `${user.firstName} is not your peer`,
        StatusCodes.FORBIDDEN
      );
    }
    return true;
  }),
]);

export {
  validateCourseId,
  validateEvaluationInput,
  validateIdParams,
  ensureUserIsDepartmentHead,
  ensureUserIsPeer,
  ensureUserIsDepartmentMember,
};
