import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync.js";
import EvaluationResult from "../models/apprisalResultModel.js";
import buildEvaluationQuery from "../utils/review/buildQuery.js";
import performCommonChecks from "../utils/review/performCommenCheck.js";
import calculateByEvaluatorRole from "../utils/results/calculateByRole.js";
import FinalResult from "../models/resultDetail.js";
async function handleEvaluation(req, res, next, evalType) {
  performCommonChecks(req, next, evalType, async (req, activeCycle) => {
    try {
      const query = await buildEvaluationQuery(req, evalType, activeCycle);
      const newEvaluationResult = new EvaluationResult(query);
      newEvaluationResult["appraisalTemplateId"] = req.body.templete;
      newEvaluationResult["results"] = req.body.evalData;

      await newEvaluationResult.save();

      await calculateByEvaluatorRole(
        query.evaluatedUserId,
        evalType,
        activeCycle,
        req.user.department,
        req.user._id
      );

      res.status(200).json({
        status: "success",
        message: "Evaluation result saved and processed successfully.",
      });
    } catch (error) {
      console.error("Error saving or processing evaluation:", error);

      res.status(500).json({
        status: "error",
        message: "Failed to save or process evaluation.",
      });
    } finally {
    }
  });
}

export const reviewByPeer = catchAsync(async (req, res, next) => {
  handleEvaluation(req, res, next, "peer");
});

export const reviewBySelf = catchAsync(async (req, res, next) => {
  handleEvaluation(req, res, next, "self");
});

export const reviewByHead = catchAsync(async (req, res, next) => {
  handleEvaluation(req, res, next, "head");
});

export const reviewByDean = catchAsync(async (req, res, next) => {
  handleEvaluation(req, res, next, "dean");
});

export const reviewByTeamLeader = catchAsync(async (req, res, next) => {
  handleEvaluation(req, res, next, "teamLeader");
});

export const reviewByDirector = catchAsync(async (req, res, next) => {
  handleEvaluation(req, res, next, "director");
});

export const reviewByStudent = catchAsync(async (req, res, next) => {
  handleEvaluation(req, res, next, "student");
});
