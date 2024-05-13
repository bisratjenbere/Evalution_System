import buildEvaluationQuery from "./buildQuery.js";
import AppError from "../appError.js";
import { StatusCodes } from "http-status-codes";
import getActiveCycle from "./getActiveCycle.js";
import EvaluationResult from "../../models/apprisalResultModel.js";
async function performCommonChecks(req, next, evalType, callback) {
  try {
    const activeCycle = await getActiveCycle();

    const startDate = activeCycle.startDate;
    const endDate = activeCycle.endDate;
    const today = new Date();

    const query = await buildEvaluationQuery(req, evalType, activeCycle);

    const evaluatedUser = await EvaluationResult.findOne(query).populate({
      path: "evaluatedUserId",
    });

    if (evaluatedUser) {
      return next(
        new AppError(
          `You've already evaluated ${evaluatedUser["evaluatedUserId"].firstName} ${evaluatedUser["evaluatedUserId"].lastName}  during this cycle.`,
          StatusCodes.FORBIDDEN
        )
      );
    }

    return callback(req, activeCycle);
  } catch (error) {
    return next(
      new AppError(
        "Error checking evaluation availability",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
}

export default performCommonChecks;
