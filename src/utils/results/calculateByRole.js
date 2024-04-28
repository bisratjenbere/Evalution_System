import EvaluationResult from "../../models/apprisalResultModel.js";
import FinalResult from "../../models/resultDetail.js";
import AppraisalTemplate from "../../models/apprisalTempleteModel.js";
import generateUpdatedResult from "./generateUpdatedResult.js";
const calculateByEvaluatorRole = async (
  userId,
  evaluatorRole,
  currentCycle,
  department,
  evaluter
) => {
  try {
    const roleEvaluations = await EvaluationResult.find({
      evaluatedUserId: userId,
      cycle: currentCycle._id,
      evaluterRole: evaluatorRole,
    });

    if (!roleEvaluations || roleEvaluations.length === 0) {
      throw new Error("No associated evaluations found");
    }

    const templete = await AppraisalTemplate.findById(
      roleEvaluations[0].appraisalTemplateId
    );

    const { questions } = templete;
    const totalWeight = questions.reduce(
      (total, item) => total + item.weight,
      0
    );

    const numberOfEvaluations = roleEvaluations.length;

    const aggregate =
      numberOfEvaluations === 0
        ? { total: 0, count: 0 }
        : {
            total:
              calculateTotalByRole(roleEvaluations, totalWeight) /
              numberOfEvaluations,
            count: numberOfEvaluations,
          };

    const updatedResult = generateUpdatedResult({
      evaluatorRole,
      aggregate,
      currentCycle,
      userId,
      department,
      evaluter,
    });

    const finalResult = await FinalResult.findOneAndUpdate(
      { cycle: currentCycle, evaluatedUserName: userId },
      { $set: updatedResult },
      { upsert: true, new: true }
    );

    return finalResult;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const calculateTotalByRole = (roleEvaluations, totalWeight) => {
  return roleEvaluations.reduce((acc, evaluation) => {
    const currentTotal = (evaluation.total * 100) / totalWeight;

    return acc + currentTotal;
  }, 0);
};

export default calculateByEvaluatorRole;
