import Notification from "../models/notification.js";

export async function sendNotification(usersToNotify, title, text) {
  usersToNotify.map(async (user) => {
    const notification = new Notification({
      user: user._id,
      title,
      type: 1,
      text,
    });
    await notification.save();
  });
}
