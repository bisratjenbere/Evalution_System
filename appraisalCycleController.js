import { StatusCodes } from "http-status-codes";
import AppraisalCycle from "./src/models/apprisalCycleModel.js";
import AppError from "./src/utils/appError.js";
import catchAsync from "./src/utils/catchAsync.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./src/controllers/handleFactory.js";
export const getAllAppraisalCycles = getAll(AppraisalCycle);
export const createAppraisalCycle = createOne(AppraisalCycle);
export const getAppraisalCycle = getOne(AppraisalCycle);
export const updateAppraisalCycle = updateOne(AppraisalCycle);
export const deleteAppraisalCycle = deleteOne(AppraisalCycle);
export const getActiveApprisalCycle = catchAsync(async (req, res, next) => {
  const activeCycle = await AppraisalCycle.find({ status: "active" });
  if (!activeCycle || activeCycle.length === 0) {
    return new AppError(
      "There is No apprisal cycle initated",
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).json({
    status: "success",
    result: activeCycle,
  });
});
