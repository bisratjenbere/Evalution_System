import mongoose from "mongoose";
const appraisalTemplateSchema = new mongoose.Schema({
  evaluationType: {
    type: String,
    enum: [
      "student-to-instructor",
      "head-to-instructor",
      "head-to-other-employee",
      "team-leader-to-employee",
      "dean-to-head",
      "director-to-team-leader",
      "self",
      "peer-instructor-to-instructor",
      "peer-academic-to-academic",
      "peer-administrative-to-administrative",
    ],
    required: true,
    default: "self",
  },

  language: {
    type: String,
    enum: ["Amhric", "English"],
    default: "English",
  },
  questions: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
      criteria: {
        type: String,
        required: true,
      },
      category: {
        type: String,
      },
      weight: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
    },
  ],
});
appraisalTemplateSchema.index(
  { evaluationType: 1, language: 1 },
  { unique: true }
);
const AppraisalTemplate = mongoose.model(
  "AppraisalTemplate",
  appraisalTemplateSchema
);

export default AppraisalTemplate;
