import express from "express";
import {
  getFinalResult,
  getDetailedResult,
  approveEvalutionResult,
  deleteEvalutionResult,
  getAllEvalutinResult,
  getHeadEvalution,
  getTeamLeaderEvalution,
  getEvalutionByDepartmentID,
} from "../controllers/resultController.js";
const router = express.Router();
router.get("/final-result", getFinalResult);
router.get("/detailed-result", getDetailedResult);
router.patch("/approve-result/:id", approveEvalutionResult);
router.delete("/delete-result/:id", deleteEvalutionResult);
router.get("/head-results", getHeadEvalution);
router.get("/team-leader-results", getTeamLeaderEvalution);
router.get("/result-by-department/:id", getEvalutionByDepartmentID);
router.get("/", getAllEvalutinResult);

export default router;
