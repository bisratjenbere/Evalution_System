import express from "express";
import {
  getAllAppraisalTemplates,
  createAppraisalTemplate,
  getAppraisalTemplate,
  updateAppraisalTemplate,
  deleteAppraisalTemplate,
} from "../controllers/appraisalTemplateController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllAppraisalTemplates)
  .post(authorizePermissions("hr", "student"), createAppraisalTemplate);

router
  .route("/:id")
  .get(getAppraisalTemplate)
  .patch(authorizePermissions("hr"), updateAppraisalTemplate)
  .delete(authorizePermissions("hr"), deleteAppraisalTemplate);

export default router;
