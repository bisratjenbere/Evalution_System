import mongoose from "mongoose";
const resultDetailSchema = new mongoose.Schema({
  cycle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AppraisalCycle",
    required: true,
  },
  evaluatedUserName: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  department: {
    type: mongoose.Types.ObjectId,
    ref: "Department",
  },
  byStudent: {
    total: { type: Number, default: 0 },
    countOfReviewer: { type: Number, default: 0 },
  },
  byPeer: {
    total: { type: Number, default: 0 },
    countOfReviewer: { type: Number, default: 0 },
  },
  byHead: Number,
  byTeamLeader: Number,
  byDean: Number,
  byDirector: Number,
  self: Number,
  Average: Number,
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Approved"],
  },
  byPeerRank: { type: Number },
  byStdRank: { type: Number },
  byHeadRank: { type: String },
  ApprovedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  ApprovedDate: Date,
});

resultDetailSchema.methods.calculateRanks = async function () {
  try {
    const higherScoreCountByPeer = await mongoose
      .model("FinalResult")
      .countDocuments({
        "byPeer.total": { $gt: this.byPeer.total },
      });

    const higherScoreCountByStudent = await mongoose
      .model("FinalResult")
      .countDocuments({
        "byStudent.total": { $gt: this.byStudent.total },
      });

    const higherScoreCountByHead = await mongoose
      .model("FinalResult")
      .countDocuments({
        byHead: { $gt: this.byHead },
      });

    this.byPeerRank = higherScoreCountByPeer + 1;
    this.byStdRank = higherScoreCountByStudent + 1;
    this.byHeadRank = (higherScoreCountByHead + 1).toString();

    await this.save();
  } catch (error) {
    console.error("Error calculating ranks:", error);
    throw error;
  }
};

const FinalResult = mongoose.model("FinalResult", resultDetailSchema);
export default FinalResult;
