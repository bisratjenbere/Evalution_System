import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
const createJwt = (payload) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: +process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
  });
  return token;
};
const verifyJwt = async (token) => {
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
const sendToken = (user, req, res) => {
  const token = createJwt(user._id);
  const tokenExpire =
    Date.now() + +process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000;

  res.cookie("jwt", token, {
    expires: new Date(tokenExpire),
    httpOnly: true,
  });
  user.password = undefined;
  return res.status(StatusCodes.OK).json({
    status: "sucess",
    token,
    data: user,
  });
};

export { verifyJwt, sendToken, createJwt };
