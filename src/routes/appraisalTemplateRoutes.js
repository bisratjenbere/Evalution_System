import express from "express";
import * as appraisalTemplateController from "../controllers/appraisalTemplateController.js";

const router = express.Router();

router
  .route("/")
  .get(appraisalTemplateController.getAllAppraisalTemplates)
  .post(appraisalTemplateController.createAppraisalTemplate);

router
  .route("/:id")
  .get(appraisalTemplateController.getAppraisalTemplate)
  .patch(appraisalTemplateController.updateAppraisalTemplate)
  .delete(appraisalTemplateController.deleteAppraisalTemplate);

export default router;
