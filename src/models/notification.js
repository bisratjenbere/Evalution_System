import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    title: { type: String, require: true },
    type: { type: Number, required: true },
    text: { type: String, require: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
notificationSchema.index({ user: 1, text: 1 }, { unique: true });
const Notfication = mongoose.model("notification", notificationSchema);
export default Notfication;
