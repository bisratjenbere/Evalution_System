import mongoose from "mongoose";
const departmentSchema = new mongoose.Schema({
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

departmentSchema.index({ departmentCode: 1 }, { unique: true });

const Department = mongoose.model("Department", departmentSchema);

export default Department;
