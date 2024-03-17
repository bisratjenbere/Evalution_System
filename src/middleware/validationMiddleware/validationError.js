import { validationResult } from "express-validator";
import AppError from "../../utils/appError.js";
import { StatusCodes } from "http-status-codes";
const withValidationErrors = (validateValues) => [
  ...validateValues,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMsg = errors.array().map((err) => err.msg);
      return next(new AppError(errorMsg.toString(), StatusCodes.BAD_REQUEST));
    }
    next();
  },
];

export default withValidationErrors;
