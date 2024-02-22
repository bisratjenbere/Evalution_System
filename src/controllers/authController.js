// Import statements using ESM syntax
import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "./../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { comparePassword, passwordResetToken } from "../utils/passwordUtils.js";
import { createJwt, sendToken } from "../utils/tokenUtils.js";

import { NODE_ENV } from "../config/environments.js";
// import Email from "../utils/email.js";

export const signup = catchAsync(async (req, res, next) => {
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ status: "sucess", data: user });
});
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const loggedInUser = await User.findOne({ email }).select("+password");

  const isValidUser =
    loggedInUser && (await comparePassword(password, loggedInUser.password));

  if (!isValidUser) {
    return next(
      new AppError(`Incorrect email or password`, StatusCodes.UNAUTHORIZED)
    );
  }

  const token = await createJwt({
    userId: loggedInUser._id,
    role: loggedInUser.role,
  });

  await sendToken(loggedInUser, req, res);
});
export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  const resetToken = passwordResetToken(user);
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, req, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await comparePassword(req.body.password, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }
  user.password = hashPassword(req.body.password);
  await user.save();
  await sendToken(user, req, res);
});
