import { StatusCodes } from "http-status-codes";
import Complaint from "../models/complaintModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handleFactory.js";

export const getAllComplaints = getAll(Complaint);
export const createComplaint = createOne(Complaint);
export const getComplaint = getOne(Complaint, { path: "userId" });
export const updateComplaint = updateOne(Complaint);
export const getComplaintByUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userComplaints = await Complaint.find({ userId });

  if (!userComplaints || userComplaints.length === 0)
    return next(
      new AppError(
        "No complaint is Found by Specified User ",
        StatusCodes.NOT_FOUND
      )
    );
  return res.status(StatusCodes.OK).json({
    status: "success",
    complaint: userComplaints,
  });
});

export const deleteComplaint = deleteOne(Complaint);
