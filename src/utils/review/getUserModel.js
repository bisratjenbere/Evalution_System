import Course from "../../models/courseModel.js";
import User from "../../models/userModel.js";
async function getUserModel(req, evalType) {
  switch (evalType) {
    case "student":
      const evalutedCourse = await Course.findOne({
        department: req.user.department,
        batch: req.user.batch,
        _id: req.params.id,
        startDate: { $lt: new Date() },
        endDate: { $gt: new Date() },
      }).populate({ path: "instructor" });
      return evalutedCourse;
    case "self":
      return req.user;
    default:
      return User.findById(req.params.id);
  }
}

export default getUserModel;
