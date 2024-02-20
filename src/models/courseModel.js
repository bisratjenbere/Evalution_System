import mongoose, { mongo } from "mongoose";
import validator from "validator";
const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      match: /^[A-Za-z0-9]+$/,
    },
    semester: {
      type: Number,
      required: true,
    },
    batch: {
      type: Number,
      required: true,
      min: 1,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return !this.endDate || value < this.endDate;
        },
        message: "Start date must be before end date",
      },
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return !this.startDate || value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

courseSchema.index({ department: 1, instructor: 1 });
courseSchema.virtual("isActive").get(function () {
  const currentDate = new Date();
  return this.startDate <= currentDate && this.endDate >= currentDate;
});
const Course = mongoose.model("Course", courseSchema);

export default Course;
