import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";
import { StatusCodes } from "http-status-codes";
import Email from "../utils/email.js";
import User from "../models/userModel.js";
import { sendNotification } from "../utils/notificationService.js";
const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
const deleteMany = (Model) =>
  catchAsync(async (req, res, next) => {
    const result = await Model.deleteMany({});
    if (result.deletedCount === 0) {
      return next(
        new AppError("No documents found matching the criteria", 404)
      );
    }
    res.status(204).json({
      status: "success",
      data: null,
      deletedCount: result.deletedCount,
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",

      data: doc,
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (Model.modelName === "AppraisalCycle") {
      const usersToNotify = await User.find();
      const { startDate, endDate, description } = req.body;
      await sendNotification(
        usersToNotify,
        "Evaluation Schedule Started",
        `Evaluation schedule started from ${startDate} to ${endDate}.`
      );
    }

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: doc,
    });
  });

const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(
        new AppError("No document found with that ID", StatusCodes.NOT_FOUND)
      );
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      data: doc /*  */,
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let query = features.query;
    if (Model.schema.paths.collegeId) {
      query = query.populate("collegeId");
    }
    if (Model.schema.paths.instructor) {
      query = query.populate("instructor");
    }
    if (Model.schema.paths.userId) {
      query = query.populate("userId");
    }
    const doc = await features.query;

    // SEND RESPONSE
    res.status(StatusCodes.OK).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });

export { deleteOne, updateOne, createOne, getOne, getAll, deleteMany };
