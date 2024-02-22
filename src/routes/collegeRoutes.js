import express from "express";
import * as collegeController from "../controllers/collegeController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";
const router = express.Router();
router
  .route("/")
  .get(collegeController.getAllColleges)
  .post(authorizePermissions("admin"), collegeController.createCollege);
router.use(authorizePermissions("admin"));
router
  .route("/:id")
  .get(collegeController.getCollege)
  .patch(collegeController.updateCollege)
  .delete(collegeController.deleteCollege);
export default router;
