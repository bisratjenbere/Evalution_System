import mongoose from "mongoose";
const collegeSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  collegeDean: {
    type: String,
    trim: true,
  },
  collegeCode: {
    type: String,
    trim: true,
    unique: true,
  },
});

const College = mongoose.model("College", collegeSchema);

export default College;
