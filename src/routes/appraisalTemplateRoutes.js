import express from "express";
import {
  getAllAppraisalTemplates,
  createAppraisalTemplate,
  getAppraisalTemplate,
  updateAppraisalTemplate,
  deleteAppraisalTemplate,
  importAppraisalTemplate,
} from "../controllers/appraisalTemplateController.js";

import { uploadMiddleware } from "../controllers/userController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllAppraisalTemplates)
  .post(authorizePermissions("hr"), createAppraisalTemplate);
router
  .route("/:id")
  .delete(authorizePermissions("hr", deleteAppraisalTemplate));

router.post("/upload", uploadMiddleware, importAppraisalTemplate);

router
  .route("/get-templete")
  .get(getAppraisalTemplate)
  .patch(authorizePermissions("hr"), updateAppraisalTemplate)
  .delete(authorizePermissions("hr"), deleteAppraisalTemplate);

export default router;
