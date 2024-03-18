import catchAsync from "../utils/catchAsync.js";
import mapResult from "../utils/results/mapResult.js";
import { roleMappings } from "../utils/results/mapResult.js";
import FinalResult from "../models/resultDetail.js";
import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import getActiveCycle from "../utils/review/getActiveCycle.js";
import EvaluationResult from "../models/apprisalResultModel.js";
import AppraisalTemplate from "../models/apprisalTempleteModel.js";
export const getFinalResult = async (req, res, next) => {
  try {
    const percentMappings = {
      self: 0.1,
      acadamicPeer: 0.15,
      adminPeer: 0.12,
      teamLeader: 0.13,
      head: 0.35,
      dean: 0.35,
      director: 0.35,
      student: 0.5,
    };
    const result = await mapResult(req);
    let documentToBeInserted = {};
    for (let curr of result) {
      switch (curr.role) {
        case "student":
          documentToBeInserted["byStudent"] = {
            total: curr.total,
            countOfReviewer: curr.count,
          };
          break;
        case "peer":
          documentToBeInserted["byPeer"] = {
            total: curr.total,
            countOfReviewer: curr.count,
          };
          break;
        case "head":
          documentToBeInserted["byHead"] = curr.total;
          break;
        case "dean":
          documentToBeInserted["byDean"] = curr.total;
          break;
        case "director":
          documentToBeInserted["byDirector"] = curr.total;
          break;
        case "teamLeader":
          documentToBeInserted["byTeamLeader"] = curr.total;
          break;

        case "self":
          documentToBeInserted["self"] = curr.total;
          break;
      }
    }
    const activeCycle = (await getActiveCycle())._id;
    documentToBeInserted["department"] = req.user.department;
    documentToBeInserted["evaluatedUserName"] = req.user._id;
    documentToBeInserted["cycle"] = activeCycle;

    const existingDocument = await FinalResult.findOneAndUpdate(
      {
        cycle: activeCycle,
        evaluatedUserName: req.user._id,
      },
      documentToBeInserted,
      { upsert: true, new: true }
    );
    await existingDocument.calculateRanks();

    const percentedResult = result.map((curr) => {
      const acadamicRole = [
        "instructor",
        "director",
        "head",
        "dean",
        "assistance",
        "acadamic",
      ];
      let percent;
      if (curr.role === "peer") {
        percent = acadamicRole.includes(req.user.role)
          ? percentMappings["acadamicPeer"]
          : percentMappings["adminPeer"];
      } else {
        percent = percentMappings[curr.role];
      }

      return {
        total: curr.total * percent,
        count: curr.count,
        role: curr.role,
        outOf: percent * 100,
      };
    });

    const totalPercent = Object.values(percentMappings).reduce(
      (acc, val) => acc + val,
      0
    );

    res.status(StatusCodes.OK).json({
      totalPercent,
      data: percentedResult,
    });
  } catch (error) {
    next(error);
  }
};
export const getDetailedResult = async (req, res, next) => {
  try {
    const activeCycle = await getActiveCycle();

    const detailedResult = await EvaluationResult.find({
      cycle: activeCycle,
      evaluatedUserId: req.user._id,
    }).populate("appraisalTemplateId");
    const responseData = detailedResult.map((curr) => {
      const { appraisalTemplateId } = curr;
      const questions = appraisalTemplateId.questions;
      const results = curr.results;
      const evaluterRole = curr.evaluterRole;
      const questionRatingMap = new Map();
      results.forEach((curr, index) => {
        const questionText = questions[index].questionText;
        const key = `${questionText}-${evaluterRole}`;
        const existingEntry = questionRatingMap.get(key);
        if (existingEntry) {
          existingEntry.rating += curr.rating;
        } else {
          questionRatingMap.set(key, {
            evaluterRole,
            rating: curr.rating,
            questionText,
          });
        }
      });
      const questionWithRating = Array.from(questionRatingMap.values());
      return questionWithRating;
    });

    const data = [].concat(...responseData);
    res.status(StatusCodes.OK).json({
      statuss: "sucess",
      data: data,
    });
  } catch (error) {
    console.error("Error aggregating data:", error);
  }
};

export const approveEvalutionResult = catchAsync(async (req, res, next) => {
  const evaluationResultID = req.params.id;

  const evaluationResult = await FinalResult.findById(evaluationResultID);

  if (!evaluationResult) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Evaluation result not found" });
  }
  evaluationResult.status = "Approved";
  evaluationResult.ApprovedDate = new Date();
  evaluationResult.ApprovedBy = req.user._id;
  await evaluationResult.save();

  res
    .status(StatusCodes.OK)
    .json({ message: "Evaluation result approved successfully" });
});
export const deleteEvalutionResult = catchAsync(async (req, res, next) => {
  const evalutionToBeDeleted = await FinalResult.findByIdAndDelete(
    req.params.id
  );

  if (!evalutionToBeDeleted) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Evaluation result not found" });
  }

  res
    .status(StatusCodes.OK)
    .json({ message: "Evaluation result deleted successfully" });
});
export const getAllEvalutinResult = catchAsync(async (req, res, next) => {
  const activeCycle = await getActiveCycle();
  const evaluationResults = await FinalResult.find({
    cycle: activeCycle,
  });

  if (!evaluationResults || evaluationResults.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "No evaluation results found" });
  }

  res.status(StatusCodes.OK).json({ data: evaluationResults });
});

export const getEvalutionByDepartmentID = catchAsync(async (req, res, next) => {
  const departmentID = req.params.id;
  const activeCycle = await getActiveCycle();
  const evaluationResults = await FinalResult.find({
    department: departmentID,
    cycle: activeCycle,
  });
  if (!evaluationResults || evaluationResults.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "No evaluation results found for the specified department",
    });
  }
  res.status(StatusCodes.OK).json({ data: evaluationResults });
});

export const getTeamLeaderEvalution = catchAsync(async (req, res, next) => {
  const activeCycle = await getActiveCycle();
  const evaluationResults = await FinalResult.find({
    cycle: activeCycle,
  }).populate("evaluatedUserName");

  if (!evaluationResults || evaluationResults.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "No evaluation results found" });
  }

  const filteredEvalution = evaluationResults.filter((curr, index) => {
    return (
      curr.evaluatedUserName.college === req.user.college &&
      curr.evaluatedUserName.role === "teamLeader"
    );
  });
  res.status(StatusCodes.OK).json({ data: filteredEvalution });
});

export const getHeadEvalution = catchAsync(async (req, res, next) => {
  const activeCycle = await getActiveCycle();
  const evaluationResults = await FinalResult.find({
    cycle: activeCycle,
  }).populate("evaluatedUserName");

  if (!evaluationResults || evaluationResults.length === 0) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "No evaluation results found" });
  }

  const filteredEvalution = evaluationResults.filter((curr, index) => {
    return (
      curr.evaluatedUserName.college === req.user.college &&
      curr.evaluatedUserName.role === "head"
    );
  });
  res.status(StatusCodes.OK).json({ data: filteredEvalution });
});
