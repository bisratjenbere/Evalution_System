import { StatusCodes } from "http-status-codes";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import { verifyJwt } from "../utils/tokenUtils.js";
import Jwt from "jsonwebtoken";

import { JWT_KEY } from "../config/environments.js";

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `You do not have the right permission to perform this action`,
          StatusCodes.FORBIDDEN
        )
      );
    } else {
      next();
    }
  };
};

export const authenticateUser = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError(
        "You are not logged in! Please log in to get access.",
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  const decoded = await verifyJwt(token);
  const freshUser = await User.findById(decoded.payload);
  if (!freshUser) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }

  if (freshUser.changedpassword(decoded.iat)) {
    return next(
      new AppError(`User recently changed password. Please log in again.`)
    );
  }
  req.user = freshUser;

  next();
});
