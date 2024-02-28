// Import necessary modules and dependencies
import express from "express";
import {
  getAllAppraisalCycles,
  createAppraisalCycle,
  getAppraisalCycle,
  updateAppraisalCycle,
  deleteAppraisalCycle,
  getActiveApprisalCycle,
} from "../controllers/appraisalCycleController.js";

import { authorizePermissions } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/active").get(getActiveApprisalCycle);
router
  .route("/")
  .get(getAllAppraisalCycles)
  .post(authorizePermissions("hr"), createAppraisalCycle);
router
  .route("/:id")
  .get(getAppraisalCycle)
  .patch(updateAppraisalCycle)
  .delete(deleteAppraisalCycle);

export default router;
