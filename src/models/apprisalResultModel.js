import mongoose from "mongoose";
const evaluationResultSchema = new mongoose.Schema({
  evaluatedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  evaluter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  evaluterRole: {
    type: String,
    enum: ["student", "teamLeader", "head", "self", "peer", "director", "dean"],
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
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

  total: {
    type: Number,
    default: 0,
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

evaluationResultSchema.pre("save", function (next) {
  const sumOfRatings = this.results.reduce(
    (total, result) => total + result.rating,
    0
  );
  this.total = sumOfRatings;
  next();
});

const EvaluationResult = mongoose.model(
  "EvaluationResult",
  evaluationResultSchema
);

export default EvaluationResult;
