import express from "express";
import {
  getAllAppraisalTemplates,
  createAppraisalTemplate,
  getAppraisalTemplate,
  updateAppraisalTemplate,
  deleteAppraisalTemplate,
} from "../controllers/appraisalTemplateController.js";

const router = express.Router();

router.route("/").get(getAllAppraisalTemplates).post(createAppraisalTemplate);

router
  .route("/:id")
  .get(getAppraisalTemplate)
  .patch(updateAppraisalTemplate)
  .delete(deleteAppraisalTemplate);

export default router;
