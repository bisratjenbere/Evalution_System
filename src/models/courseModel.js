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
      trim: true,
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
    section: {
      type: Number,
      default: 1,
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

courseSchema.index(
  { code: 1, batch: 1, section: 1, department: 1 },
  { unique: true }
);

courseSchema.virtual("isActive").get(function () {
  const currentDate = new Date();
  return this.startDate <= currentDate && this.endDate >= currentDate;
});
const Course = mongoose.model("Course", courseSchema);
courseSchema.path("batch").validate(async function (value) {
  const count = await mongoose.models.Course.countDocuments({
    _id: { $ne: this._id },
    batch: this.batch,
    code: this.code,
    department: this.department,
    section: this.section,
  });

  return !count;
});
export default Course;
