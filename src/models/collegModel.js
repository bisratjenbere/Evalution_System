import mongoose from "mongoose";
const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  numberOfDepartment: Number,
  dean: String,
  collegeCode: {
    type: String,
    trim: true,
    unique: true,
  },
});

const College = mongoose.model("College", collegeSchema);

export default College;
