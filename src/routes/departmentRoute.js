import express from "express";
import * as departmentController from "../controllers/departmentController.js";

import { authorizePermissions } from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .get(departmentController.getAllDepartment)
  .post(authorizePermissions("admin"), departmentController.createDepartment);

router;
router
  .route("/:id")
  .get(departmentController.getDepartment)
  .patch(authorizePermissions("admin"), departmentController.updateDepartment)
  .delete(authorizePermissions("admin"), departmentController.deleteDepartment);

export default router;
