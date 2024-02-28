import express from "express";
import {
  getAllComplaints,
  createComplaint,
  getComplaint,
  updateComplaint,
  getComplaintByUser,
  deleteComplaint,
} from "../controllers/complaintController.js";
import { authorizePermissions } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/user-complaints", getComplaintByUser);
router
  .route("/")
  .get(authorizePermissions("admin", "hr"), getAllComplaints)
  .post(createComplaint);

router.use(authorizePermissions("admin", "hr"));
router
  .route("/:id")
  .get(getComplaint)
  .patch(updateComplaint)
  .delete(deleteComplaint);

export default router;
