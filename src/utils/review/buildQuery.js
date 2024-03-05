import determineEvaluatedUserId from "./determineEvalutedUserId.js";
async function buildEvaluationQuery(req, evalType, activeCycle) {
  const evaluationData = await determineEvaluatedUserId(
    req,
    evalType,
    activeCycle
  );

  return {
    ...evaluationData,
  };
}
export default buildEvaluationQuery;
