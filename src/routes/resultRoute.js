import express from "express";
import {
  getFinalResult,
  getDetailedResult,
  approveEvalutionResult,
  deleteEvalutionResult,
  getAllEvalutinResult,
} from "../controllers/resultController.js";

const router = express.Router();

router.get("/final-result", getFinalResult);
router.get("/detailed-result", getDetailedResult);
router.patch("/approve-result/:id", approveEvalutionResult);
router.delete("/delete-result/:id", deleteEvalutionResult);
router.get("/all-results", getAllEvalutinResult);
router.get("/", getAllEvalutinResult);

export default router;
