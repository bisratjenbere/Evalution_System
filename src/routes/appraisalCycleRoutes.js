import express from "express";
import * as appraisalCycleController from "../controllers/appraisalCycleController.js";

const router = express.Router();

router
  .route("/")
  .get(appraisalCycleController.getAllAppraisalCycles)
  .post(appraisalCycleController.createAppraisalCycle);

router
  .route("/:id")
  .get(appraisalCycleController.getAppraisalCycle)
  .patch(appraisalCycleController.updateAppraisalCycle)
  .delete(appraisalCycleController.deleteAppraisalCycle);

export default router;
