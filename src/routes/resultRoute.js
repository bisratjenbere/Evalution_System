import express from "express";
import {
  geAllResult,
  getFinalResult,
  getDetailedResult,
  approveEvalutionResult,
  deleteEvalutionResult,
  getAllEvalutinResult,
  getHeadEvalution,
  getTeamLeaderEvalution,
  getEvalutionByDepartmentID,
  getAllDetail,
  deleteAllDetail,
  deleteAllFinal,
  getSubordinateEmployeesWithResults,
  getEvaluationDataAnalyics,
  getEmployeeFinalResult,
} from "../controllers/resultController.js";
const router = express.Router();
router.route("/").get(geAllResult).delete(deleteAllFinal);
router.route("/detail").get(getAllDetail).delete(deleteAllDetail);
router.get("/final-result", getFinalResult);
router.get("/employee-result/:userId/:cycleId", getEmployeeFinalResult);
router.get("/anlytics", getEvaluationDataAnalyics);
router.get("/department-result", getSubordinateEmployeesWithResults);
router.get("/detailed-result", getDetailedResult);
router.patch("/approve-result/:id", approveEvalutionResult);
router.delete("/delete-result/:id", deleteEvalutionResult);
router.get("/head-results", getHeadEvalution);
router.get("/team-leader-results", getTeamLeaderEvalution);
router.get("/result-by-department/:id", getEvalutionByDepartmentID);
router.get("/", getAllEvalutinResult);

export default router;
