// Import necessary modules and dependencies
import express from "express";
import {
  getAllColleges,
  createCollege,
  getCollege,
  updateCollege,
  deleteCollege,
} from "../controllers/collegeController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllColleges)
  .post(authorizePermissions("admin"), createCollege);

router
  .route("/:id")
  .get(getCollege)
  .patch(authorizePermissions("admin"), updateCollege)
  .delete(deleteCollege);

export default router;
