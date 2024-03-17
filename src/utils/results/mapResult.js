import calculateByEvaluatorRole from "./calculateByRole.js";
export const roleMappings = {
  teamLeader: ["director", "peer", "self"],
  head: ["dean", "peer", "student"],
  dean: ["student", "peer", "head"],
  instructor: ["student", "peer", "head"],
  academic: ["peer", "head", "student"],
  administrative: ["self", "peer", "teamLeader"],
  other: ["peer", "head"],
  director: ["head", "student", "peer"],
};
const mapResult = async (req) => {
  const employeeRole = req.user.role;
  let rolesToCalculate;
  if (!roleMappings[employeeRole]) {
    rolesToCalculate = roleMappings["other"];
  } else {
    rolesToCalculate = roleMappings[employeeRole];
  }

  const result = [];

  for (const role of rolesToCalculate) {
    const resultByRole = await calculateByEvaluatorRole(req.user._id, role);
    result.push(resultByRole);
  }

  return result;
};

export default mapResult;
