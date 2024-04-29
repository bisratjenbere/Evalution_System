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
  evaluter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  bySelf: Number,
  Average: Number,
  status: {
    type: String,
    enum: ["In Progress", "Completed", "Approved"],
    default: "In Progress",
  },
  byPeerRank: { type: Number },
  byStdRank: { type: Number },
  byHeadRank: { type: Number },
  byDeanRank: Number,
  bySelfRank: Number,
  byTeamLeaderRank: { type: Number },
  byDirectorRank: { type: Number },

  ApprovedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  ApprovedDate: Date,
});

resultDetailSchema.methods.calculateRanks = async function () {
  try {
    if (this.byPeer && this.byPeer.total !== undefined) {
      const higherScoreCountByPeer = await mongoose
        .model("FinalResult")
        .countDocuments({
          "byPeer.total": { $gt: this.byPeer.total },
          department: this.department,
        });
      this.byPeerRank = higherScoreCountByPeer + 1;
    }

    if (this.byStudent && this.byStudent.total !== undefined) {
      const higherScoreCountByStudent = await mongoose
        .model("FinalResult")
        .countDocuments({
          "byStudent.total": { $gt: this.byStudent.total },
          department: this.department,
        });
      this.byStdRank = higherScoreCountByStudent + 1;
    }

    if (this.byDean && this.byDean !== undefined) {
      const higherScoreCountByDean = await mongoose
        .model("FinalResult")
        .countDocuments({
          byDean: { $gt: this.byDean },
          department: this.department,
        });
      this.byDeanRank = higherScoreCountByDean + 1;
    }

    if (this.byDirector && this.byDirector !== undefined) {
      const higherScoreCountByDirector = await mongoose
        .model("FinalResult")
        .countDocuments({
          byDirector: { $gt: this.byDirector },
          department: this.department,
        });
      this.byDirectorRank = higherScoreCountByDirector + 1;
    }

    if (this.byTeamLeader && this.byTeamLeader !== undefined) {
      const higherScoreCountByTeamLeader = await mongoose
        .model("FinalResult")
        .countDocuments({
          byTeamLeader: { $gt: this.byTeamLeader },
          department: this.department,
        });
      this.byTeamLeaderRank = higherScoreCountByTeamLeader + 1;
    }

    if (this.byHead && this.byHead !== undefined) {
      const higherScoreCountByHead = await mongoose
        .model("FinalResult")
        .countDocuments({
          byHead: { $gt: this.byHead },
          department: this.department,
        });
      this.byHeadRank = higherScoreCountByHead + 1;
    }
    if (this.bySelf && this.bySelf !== undefined) {
      const higherScoreCountBySelf = await mongoose
        .model("FinalResult")
        .countDocuments({
          bySelf: { $gt: this?.bySelf },
          department: this.department,
        });
      this.bySelfRank = higherScoreCountBySelf + 1;
    }

    await this.save();
  } catch (error) {
    console.error("Error calculating ranks:", error);
    throw error;
  }
};

const FinalResult = mongoose.model("FinalResult", resultDetailSchema);
export default FinalResult;
