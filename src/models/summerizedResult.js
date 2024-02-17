import mongoose from "mongoose";

const summarizedResultSchema = new mongoose.Schema({
  empId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  selfReview: {
    type: Number,
    default: 0,
  },
  headReview: {
    type: Number,
    default: 0,
  },
  deanReview: {
    type: Number,
    default: 0,
  },
  directorReview: {
    type: Number,
    default: 0,
  },
  studentReview: {
    type: Number,
    default: 0,
  },
  teamLeaderReview: {
    type: Number,
    default: 0,
  },
  peerReview: {
    type: Number,
    default: 0,
  },
});

const SummarizedResult = mongoose.model(
  "SummarizedResult",
  summarizedResultSchema
);

export default SummarizedResult;
