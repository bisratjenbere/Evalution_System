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

appraisalTemplateSchema.pre("save", function (next) {
  const template = this;
  if (!template.isNew) {
    return next();
  }
  template.questions.forEach((question) => {
    question._id = new mongoose.Types.ObjectId();
  });
  next();
});

const AppraisalTemplate = mongoose.model(
  "AppraisalTemplate",
  appraisalTemplateSchema
);

export default AppraisalTemplate;
