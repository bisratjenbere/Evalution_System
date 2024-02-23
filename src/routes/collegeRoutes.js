// Import necessary modules and dependencies
import express from "express";
import {
  getAllColleges,
  createCollege,
  getCollege,
  updateCollege,
  deleteCollege,
} from "../controllers/collegeController.js";

const router = express.Router();

router.route("/").get(getAllColleges).post(createCollege);

router.route("/:id").get(getCollege).patch(updateCollege).delete(deleteCollege);

export default router;
