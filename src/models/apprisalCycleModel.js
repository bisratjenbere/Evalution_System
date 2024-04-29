import mongoose from "mongoose";
const appraisalCycleSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["planned", "active", "completed"],
    required: true,
  },
  description: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return this.startDate ? value > this.startDate : true;
      },
      message: "End date must be after the start date",
    },
  },
});
appraisalCycleSchema.pre("save", async function (next) {
  const currentDate = new Date();

  if (currentDate >= this.startDate && currentDate <= this.endDate) {
    this.status = "active";
  }
  if (this.status === "active") {
    await this.constructor.updateMany(
      { status: "active", _id: { $ne: this._id } },
      { $set: { status: "completed" } }
    );
  }
  next();
});

const AppraisalCycle = mongoose.model("AppraisalCycle", appraisalCycleSchema);

export default AppraisalCycle;
