import mongoose from "mongoose";
const appraisalTemplateSchema = new mongoose.Schema({
  evaluationType: {
    type: String,
    enum: [
      "student-to-instructor",
      "head-to-instructor",
      "team-leader-to-empoyee",
      "dean-to-head",
      "director-to-team-leader",
      "self",
      "peer-academic-to-academic",
      "peer-administrative-to-administrative",
    ],
    required: true,
    default: "self",
  },
  questions: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId,
      },
      questionText: {
        type: String,
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

const AppraisalTemplate = mongoose.model(
  "AppraisalTemplate",
  appraisalTemplateSchema
);

export default AppraisalTemplate;
