import AppError from "../utils/AppError";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { body, validationResult, param, check } from "express-validator";

const withValidationErrors = (validateValues) => [
  ...validateValues,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => err.msg);
      console.log(errorMsg);
      return next(new AppError(errorMsg.toString(), StatusCodes.BAD_REQUEST));
    }
    next();
  },
];

const validatePlaceInput = withValidationErrors([
  body("title").notEmpty().withMessage("Place should have a title"),
  check("Location.lat").notEmpty().withMessage("Latitude should be specified"),
  check("Location.lng").notEmpty().withMessage("Longitude should be specified"),
  body("createdBy")
    .notEmpty()
    .withMessage("Creator is required")
    .custom(async (value) => {
      const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
      if (!isValidMongoId)
        throw new AppError("Invalid Id", StatusCodes.BAD_REQUEST);
      const isValidCreator = await User.findById(value);
      if (!isValidCreator)
        throw new AppError(
          "Creator should be a valid user",
          StatusCodes.NOT_FOUND
        );
    }),
]);

const validateIdParams = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId)
      throw new AppError("Invalid id", StatusCodes.BAD_REQUEST);
    const place = await Place.find({ createdBy: value });
    if (!place)
      throw new AppError("No Place found with that ID", StatusCodes.NOT_FOUND);
  }),
]);

const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("Name should not be empty"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .toLowerCase()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user)
        throw new AppError("User already exists", StatusCodes.BAD_REQUEST);
    }),
  body("password").notEmpty().withMessage("Password is required"),
]);

const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
]);

export {
  validateIdParams,
  validateLoginInput,
  validateRegisterInput,
  validatePlaceInput,
};
