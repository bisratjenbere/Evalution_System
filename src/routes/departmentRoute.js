import express from "express";
import {
  deleteDepartment,
  updateDepartment,
  createDepartment,
  getDepartment,
  getAllDepartment,
} from "../controllers/departmentController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";
import {
  reviewByStudent,
  reviewBySelf,
} from "../controllers/reviewController.js";
const router = express.Router();
router.post("/review/:id", reviewByStudent);

router
  .route("/")
  .get(getAllDepartment)
  .post(authorizePermissions("admin"), createDepartment);

router
  .route("/:id")
  .get(getDepartment)
  .patch(authorizePermissions("admin"), updateDepartment)
  .delete(authorizePermissions("admin"), deleteDepartment);

export default router;
