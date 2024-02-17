import mongoose from "mongoose";
import validator from "validator";
const courseSchema = new mongoose.Schema({
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
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
