import mongoose from "mongoose";

const evaluationResultSchema = new mongoose.Schema({
  evaluatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  evaluterRole: {
    type: String,
    enum: ["self", "head", "director", "dean", "teamLeader", "peer", "student"],
    required: true,
  },
  cycle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppraisalCycle",
    required: true,
  },
  appraisalTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppraisalTemplate",
    required: true,
  },
  results: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AppraisalTemplate.questions._id",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
    },
  ],
});

const EvaluationResult = mongoose.model(
  "EvaluationResult",
  evaluationResultSchema
);

export default EvaluationResult;
