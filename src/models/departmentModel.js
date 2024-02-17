import mongoose from "mongoose";
const departmentSchema = new mongoose.Schema({
  departmentHead: {
    type: String,
    required: true,
    trim: true,
  },
  departmentName: {
    type: String,
    required: true,
    trim: true,
  },
  departmentCode: {
    type: String,
    trim: true,
    unique: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
