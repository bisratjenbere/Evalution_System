import mongoose from "mongoose";
const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true,
  },
  numberOfDepartment: Number,
  dean: {
    type: String,
    unique: true,
  },
  collegeCode: {
    type: String,
    trim: true,
    unique: true,
  },
});

const College = mongoose.model("College", collegeSchema);

export default College;
