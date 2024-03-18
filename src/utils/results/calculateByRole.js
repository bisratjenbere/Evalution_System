import EvaluationResult from "../../models/apprisalResultModel.js";
import FinalResult from "../../models/resultDetail.js";
import getActiveCycle from "../review/getActiveCycle.js";
import AppraisalTemplate from "../../models/apprisalTempleteModel.js";
import AppError from "../appError.js";
import { StatusCodes } from "http-status-codes";

const calculateByEvaluatorRole = async (userId, evaluatorRole) => {
  try {
    const currentCycle = await getActiveCycle();

    const roleEvaluations = await EvaluationResult.find({
      evaluatedUserId: userId,
      cycle: currentCycle,
      evaluterRole: evaluatorRole,
    });

    if (!roleEvaluations || roleEvaluations.length === 0)
      throw Error("you have't any associated Resut");

    const { questions } = await AppraisalTemplate.findById(
      roleEvaluations[0].appraisalTemplateId
    );

    const totalWeight = questions.reduce(
      (total, item) => total + item.weight,
      0
    );

    const numberOfEvaluations = roleEvaluations.length;

    if (numberOfEvaluations === 0) {
      return {
        role: evaluatorRole,
        total: 0,
        count: 0,
      };
    }

    const totalByRole = roleEvaluations.reduce((acc, evaluation) => {
      const currentTotal = (evaluation.total * 100) / totalWeight;

      return acc + currentTotal;
    }, 0);

    return {
      role: evaluatorRole,
      total: totalByRole / numberOfEvaluations,
      count: numberOfEvaluations,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export default calculateByEvaluatorRole;
