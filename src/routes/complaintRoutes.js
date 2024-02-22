import express from "express";
import * as complaintController from "../controllers/complaintController.js";

const router = express.Router();

router
  .route("/")
  .get(complaintController.getAllComplaints)
  .post(complaintController.createComplaint);
router.get("my-complaint", complaintController.getComplaintByUser);

router
  .route("/:id")
  .get(complaintController.getComplaint)
  .patch(complaintController.updateComplaint)
  .delete(complaintController.deleteComplaint);

export default router;
