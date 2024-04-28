import express from "express";
import {
  getAllAppraisalTemplates,
  createAppraisalTemplate,
  getAppraisalTemplate,
  updateAppraisalTemplate,
  deleteAppraisalTemplate,
  importAppraisalTemplate,
  deleteAppraisalQuestion,
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
  .delete(authorizePermissions("hr"), deleteAppraisalTemplate)
  .patch(authorizePermissions("hr"), updateAppraisalTemplate);
router.post("/upload", uploadMiddleware, importAppraisalTemplate);

router.route("/get-templete").get(getAppraisalTemplate);
router.route("/question/:id").patch(deleteAppraisalQuestion);
export default router;
