import mongoose from "mongoose";
import validator from "validator";
const complaintSchema = new mongoose.Schema({
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  resolvedDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return !this.issueDate || value >= this.issueDate;
      },
      message: "Resolved date must be equal to or after the issue date",
    },
  },
  status: {
    type: String,
    enum: ["open", "resolved", "in-progress", "pending", "closed"],
    default: "open",
    required: true,
  },
  resolvedText: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  detail: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000,
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
