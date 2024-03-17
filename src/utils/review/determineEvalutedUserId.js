import getUserModel from "./getUserModel.js";

async function determineEvaluatedUserId(req, evalType, activeCycle) {
  let evaluatedUserId;
  switch (evalType) {
    case "student":
      const course = await getUserModel(req, "student");

      if (!course) {
        throw new Error("Student not found for evaluation");
      }

      evaluatedUserId = course.instructor._id;

      break;
    case "self":
      evaluatedUserId = req.user._id;
      break;
    default:
      evaluatedUserId = req.params.id;
  }

  return {
    evaluatedUserId,
    evaluter: req.user._id,
    evaluterRole: evalType,
    cycle: activeCycle._id,
    course:
      evalType === "student"
        ? (await getUserModel(req, "student"))._id
        : undefined,
  };
}

export default determineEvaluatedUserId;
