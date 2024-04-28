import AppraisalTemplate from "../models/apprisalTempleteModel.js";
import XLSX from "xlsx";
import {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} from "./handleFactory.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { StatusCodes } from "http-status-codes";
export const getAllAppraisalTemplates = getAll(AppraisalTemplate);

export const createAppraisalTemplate = createOne(AppraisalTemplate);
export const updateAppraisalTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { questionId, updatedQuestion } = req.body;

  const doc = await AppraisalTemplate.findOneAndUpdate(
    { _id: id, "questions._id": questionId },
    {
      $set: {
        "questions.$.criteria": updatedQuestion.criteria,
        "questions.$.category": updatedQuestion.category,
        "questions.$.weight": updatedQuestion.weight,
      },
    },
    { new: true, runValidators: true }
  );

  if (!doc) {
    return next(
      new AppError("No question found with that ID in the template", 404)
    );
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

async function processTemplateDataAndSave(data, evaluationType, language) {
  try {
    const questions = [];

    for (let row = 1; row < data.length; row++) {
      const question = {
        criteria: data[row][0],
        category: data[row][1],
        weight: parseInt(data[row][2]),
      };
      questions.push(question);
    }

    const newTemplate = new AppraisalTemplate({
      evaluationType: evaluationType,
      language: language,
      questions: questions,
    });

    await newTemplate.save();

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const importAppraisalTemplate = async (req, res, next) => {
  try {
    const { evaluationType, language } = req.body;

    if (!evaluationType || !language) {
      return next(
        new AppError(
          " evaluation type, or language not provided.",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const success = await processTemplateDataAndSave(
      data,
      evaluationType,
      language
    );

    if (success) {
      res.status(StatusCodes.OK).json({
        success: "sucess",
        message: "Appraisal template successfully imported.",
      });
    } else {
      return next(
        new AppError(
          "Error importing appraisal template..",
          StatusCodes.NOT_FOUND
        )
      );
    }
  } catch (error) {
    return {
      success: false,
      message: "Internal server error.",
    };
  }
};

export { updateOne };

export const getAppraisalTemplate = catchAsync(async (req, res) => {
  const { language, evaluationType } = req.body;

  let template = await AppraisalTemplate.findOne({
    language,
    evaluationType,
  });

  if (!template && language !== "English") {
    template = await AppraisalTemplate.findOne({
      language: "English",
      evaluationType,
    });
  }

  if (!template) {
    return res.status(404).json({
      success: false,
      message: "Appraisal template not found.",
    });
  }

  return res.json({
    success: true,
    template,
  });
});
export const deleteAppraisalTemplate = deleteOne(AppraisalTemplate);

export const deleteAppraisalQuestion = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { questionId } = req.body;

  if (!questionId) {
    return next(
      new AppError("Question ID is missing from the request body", 400)
    );
  }

  const doc = await AppraisalTemplate.findOneAndUpdate(
    { _id: id },
    { $pull: { questions: { _id: questionId } } },
    { new: true }
  );

  if (!doc) {
    return next(new AppError("No template found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});
