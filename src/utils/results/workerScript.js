import calculateByEvaluatorRole from "./calculateByRole.js";

export const calculateRole = async (userId, role) => {
  console.log(userId, role);
  try {
    const resultByRole = await calculateByEvaluatorRole(userId, role);

    parentPort.postMessage(resultByRole);
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
};
