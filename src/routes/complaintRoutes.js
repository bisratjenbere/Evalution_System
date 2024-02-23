import express from "express";
import {
  getAllComplaints,
  createComplaint,
  getComplaint,
  updateComplaint,
  getComplaintByUser,
  deleteComplaint,
} from "../controllers/complaintController.js";

const router = express.Router();

router.route("/").get(getAllComplaints).post(createComplaint);

router
  .route("/:id")
  .get(getComplaint)
  .patch(updateComplaint)
  .delete(deleteComplaint);

router.get("/user-complaints", getComplaintByUser);

export default router;
