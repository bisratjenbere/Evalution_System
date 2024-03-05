import AppraisalCycle from "../../models/apprisalCycleModel.js";

async function getActiveCycle() {
  const activeCycles = await AppraisalCycle.find({ status: "active" }).sort({
    startDate: -1,
  });

  return activeCycles[0];
}

export default getActiveCycle;
