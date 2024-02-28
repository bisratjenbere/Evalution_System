import AppraisalTemplate from "../models/apprisalTempleteModel.js";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
export const getAllAppraisalTemplates = getAll(AppraisalTemplate);

export const createAppraisalTemplate = createOne(AppraisalTemplate);

export const getAppraisalTemplate = getOne(AppraisalTemplate);

export const updateAppraisalTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await AppraisalTemplate.findByIdAndUpdate(
    id,
    {
      $addToSet: { questions: { $each: req.body.questions } },

      ...(req.body.evaluationType && {
        $set: { evaluationType: req.body.evaluationType },
      }),
    },
    { new: true, runValidators: true }
  );

  if (!doc) {
    return next(new AppError("No template found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

export { updateOne };
export const deleteAppraisalTemplate = deleteOne(AppraisalTemplate);
