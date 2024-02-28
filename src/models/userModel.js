import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "firstName should be given!"],
  },
  lastName: {
    type: String,
    required: [true, "last name must be given!"],
  },
  salutation: {
    type: String,
    enum: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."],
  },
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  experience: {
    type: Number,
    default: 0,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Email must be given"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: [
      "student",
      "adminstrative",
      "acadamic",
      "instructor",
      "assistance",
      "admin",
      "director",
      "teamLeader",
      "head",
      "dean",
      "hr",
    ],
    default: "acadamic",
  },
  batch: {
    type: Number,
    min: 1,
  },

  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },

  password: {
    type: String,

    minlength: 8,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.index({ department: 1 });
userSchema.index({ college: 1 });
userSchema.index({ email: 1 });

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.changedpassword = function (jwtTimesStamp) {
  if (this.passwordChangeAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );

    return jwtTimesStamp < changedTimeStamp;
  }

  return false;
};
const User = mongoose.model("User", userSchema);
export default User;
