import express from "express";
import {
  deleteDepartment,
  updateDepartment,
  createDepartment,
  getDepartment,
  getAllDepartment,
} from "../controllers/departmentController.js";

const router = express.Router();

router.route("/").get(getAllDepartment).post(createDepartment);

router
  .route("/:id")
  .get(getDepartment)
  .patch(updateDepartment)
  .delete(deleteDepartment);

export default router;
