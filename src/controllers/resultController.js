import catchAsync from "../utils/catchAsync.js";

import FinalResult from "../models/resultDetail.js";
import { StatusCodes } from "http-status-codes";

import getActiveCycle from "../utils/review/getActiveCycle.js";
import EvaluationResult from "../models/apprisalResultModel.js";

import { getAll, deleteMany } from "./handleFactory.js";

import roleWeights from "../utils/results/roleWeights.js";
import Course from "../models/courseModel.js";
import { sendNotification } from "../utils/notificationService.js";
import AppError from "../utils/appError.js";
import User from "../models/userModel.js";

export const getFinalResult = async (req, res, next) => {
  try {
    const cycle = await getActiveCycle();

    const resultOfCurrentEmployee = await FinalResult.findOne({
      evaluatedUserName: req.user._id,
      cycle: cycle._id,
    });
    if (resultOfCurrentEmployee) await resultOfCurrentEmployee.calculateRanks();

    const user = req.user;

    const weights = await calculateWeights(user, resultOfCurrentEmployee);

    res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        status: resultOfCurrentEmployee?.status,
        weights,
      },
    });
  } catch (error) {
    console.error("Error in getFinalResult:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEmployeeFinalResult = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const cycleId = req.params.cycleId;

    const resultOfCurrentEmployee = await FinalResult.findOne({
      evaluatedUserName: userId,
      cycle: cycleId,
    });
    if (resultOfCurrentEmployee) await resultOfCurrentEmployee.calculateRanks();

    const user = await User.findById(userId);

    const weights = await calculateWeights(user, resultOfCurrentEmployee);

    res.status(StatusCodes.OK).json({
      status: "success",
      data: {
        status: resultOfCurrentEmployee?.status,
        weights,
      },
    });
  } catch (error) {
    console.error("Error in getFinalResult:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const calculateWeights = async (user, result) => {
  try {
    const roleWeight = roleWeights[user.role] || roleWeights["other"];
    let calculatedResult = [];

    const acadamicRole = [
      "head",
      "director",
      "dean",
      "instructor",
      "assistance",
      "acadamic",
    ];
    let peerResult, studentResult, managerResult;

    peerResult = result?.byPeer ? result.byPeer.total * roleWeight.peer : 0;

    if (acadamicRole.includes(user.role)) {
      const isInstructor = result?.byStudent.total ? true : false;

      managerResult =
        user.role === "head"
          ? result?.byDean
            ? result.byDean * roleWeight.dean
            : 0
          : result?.byHead
          ? result.byHead * roleWeight.head
          : 0;
      if (isInstructor) {
        studentResult = result?.byStudent
          ? result.byStudent.total * roleWeight.student
          : 0;

        calculatedResult[0] = {
          name: "Student",
          score: studentResult,
          rank: result?.byStdRank,
        };
        calculatedResult[1] = {
          name: "Peer",
          score: peerResult,
          rank: result?.byPeerRank,
        };
        const managerLabel = user.role === "head" ? "Director" : "head";
        const managerRank =
          user.role === "head" ? result?.byDeanRank : result?.byHeadRank;

        calculatedResult[2] = {
          name: managerLabel,
          score: managerResult,
          rank: managerRank,
        };

        calculatedResult[3] = {
          total: studentResult + peerResult + managerResult,
        };
      } else {
        const total = (peerResult + managerResult) * 2;
        const managerLabel = user.role === "head" ? "Dean" : "head";
        const managerRank =
          user.role === "head" ? result?.byDeanRank : result?.byHeadRank;

        calculatedResult[0] = {
          name: "Peer",
          score: peerResult,
          rank: result?.byPeerRank,
        };
        calculatedResult[1] = {
          name: managerLabel,
          score: managerResult,
          rank: managerRank,
        };
        calculatedResult[2] = {};
        calculatedResult[3] = {
          total,
        };
      }
    } else {
      const selfResult = result?.bySelf ? result.bySelf * roleWeight.self : 0;

      const managerLabel =
        user.role === "teamLeader" ? "Director" : "TeamLeader";
      const managerRank =
        user.role === "teamLeader"
          ? result?.byDirectorRank
          : result?.byTeamLeaderRank;
      managerResult =
        user.role === "teamLeader"
          ? result?.byDirector
            ? result.byDirector * roleWeight.director
            : 0
          : result?.byTeamLeader
          ? result.byTeamLeaderRank * roleWeight.teamLeader
          : 0;
      const total = ((selfResult + peerResult + managerResult) * 100) / 35;
      calculatedResult[0] = {
        name: "self",
        score: selfResult,
        rank: result?.bySelfRank,
      };
      calculatedResult[1] = {
        name: "Peer",
        score: peerResult,
        rank: result?.byPeerRank,
      };
      calculatedResult[2] = {
        name: managerLabel,
        score: managerResult,
        rank: managerRank,
      };
      calculatedResult[3] = {
        total,
      };
    }

    return calculatedResult;
  } catch (err) {
    console.error("Error in calculateWeights:", err);
    throw err;
  }
};

const isUserInstructor = async (userId) => {
  const courses = await Course.find({});
  return courses.length > 0;
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
  const usersToNotify = [];
  const evaluationResultID = req.params.id;
  const activeCycle = await getActiveCycle();
  const evaluationResult = await FinalResult.findOne({
    evaluatedUserName: evaluationResultID,
    cycle: activeCycle._id,
  });

  if (!evaluationResult) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Evaluation result not found" });
  }
  evaluationResult.status = "Approved";
  evaluationResult.ApprovedDate = new Date();
  evaluationResult.ApprovedBy = req.user._id;
  await evaluationResult.save();
  usersToNotify.push({ _id: evaluationResultID });
  await sendNotification(
    usersToNotify,
    "Evaluation Result Approved",
    `Your evaluation result has been approved.`
  );
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

export const geAllResult = getAll(FinalResult);
export const getAllDetail = getAll(EvaluationResult);

export const deleteAllFinal = deleteMany(FinalResult);
export const deleteAllDetail = deleteMany(EvaluationResult);

export const getSubordinateEmployeesWithResults = catchAsync(
  async (req, res, next) => {
    const depId = req.user.department;
    const { role } = req.user;
    const cycle = await getActiveCycle();

    let employees;
    if (role === "director") {
      const director = await User.findById(req.user._id);
      employees = await User.find({
        college: director.college,
        role: "teamLeader",
      }).populate({ path: "department" });
    } else if (role === "dean") {
      employees = await User.find({
        college: req.user.college,
        role: "head",
      }).populate({ path: "department" });
    } else {
      employees =
        role === "teamLeader"
          ? await User.find({
              department: depId,
              role: {
                $nin: ["student", "teamLeader", "head", "dean", "director"],
              },
            }).populate({ path: "department" })
          : await User.find({
              department: depId,
              role: {
                $nin: ["student", "teamLeader", "head", "dean"],
              },
            }).populate({ path: "department" });
    }

    if (!employees || employees.length === 0)
      return next(
        new AppError("No Employees Found with this department ID", 404)
      );

    const results = [];
    for (const employee of employees) {
      const employeeResult = await FinalResult.findOne({
        evaluatedUserName: employee._id,
        cycle: cycle._id,
      });
      if (employeeResult) {
        const totalResult = calculateTotalResult(employeeResult);
        results.push({
          employee,
          totalResult,
          evaluationStatus: employeeResult.status,
        });
      } else {
        results.push({
          employee,
          totalResult: null,
          evaluationStatus: "Evaluation not found",
        });
      }
    }

    res.status(StatusCodes.OK).json({ status: "success", data: results });
  }
);

const calculateTotalResult = (result) => {
  let total = 0;
  if (result.byPeer && result.byPeer.total !== undefined) {
    total += result.byPeer.total;
  }
  if (result.byStudent && result.byStudent.total !== undefined) {
    total += result.byStudent.total;
  }
  if (result.byDean !== undefined) {
    total += result.byDean;
  }
  if (result.byDirector !== undefined) {
    total += result.byDirector;
  }
  if (result.byTeamLeader !== undefined) {
    total += result.byTeamLeader;
  }
  if (result.byHead !== undefined) {
    total += result.byHead;
  }
  if (result.bySelf !== undefined) {
    total += result.bySelf;
  }
  return total;
};

export const getEvaluationDataAnalyics = catchAsync(async (req, res, next) => {
  const evaluationData = [];
  const thresholds = [90, 80, 70];

  const evaluationTypes = [
    "byStudent",
    "byPeer",
    "byHead",
    "byDirector",
    "byDean",
    "byTeamLeader",
  ];
  for (const type of evaluationTypes) {
    for (const threshold of thresholds) {
      const query = { [type]: { $gt: threshold } };
      const count = await FinalResult.countDocuments(query);
      evaluationData.push({
        evaluationType: type,
        threshold: `Above ${threshold}`,
        count: count,
      });
    }
  }
  return res
    .status(StatusCodes.OK)
    .json({ status: "success", data: evaluationData });
});
