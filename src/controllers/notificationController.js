import notification from "../models/notification.js";

const getAllNotifications = async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.body;

  const filtredNotifications = await notification.find({
    user: userId,
    read: false,
  });

  if (!filtredNotifications) {
    return res.status(400).json({ message: "No notifications found" });
  }

  res.json({ notifications: filtredNotifications });
};

const deleteNotification = async (req, res) => {
  const { id } = req.user._id;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }

  const deleteNotification = await notification.findById(id).exec();
  if (!deleteNotification) {
    return res
      .status(400)
      .json({ message: `Can't find a notification with id: ${id}` });
  }
  const result = await deleteNotification.deleteOne();
  if (!result) {
    return res
      .status(400)
      .json({ message: `Can't delete the notification with id: ${id}` });
  }
  res.json({ message: `Notification with id: ${id} deleted with success` });
};

const deleteAllNotifications = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const notificationsDeleteMany = await notification.deleteMany({ user: id });
  if (!notificationsDeleteMany) {
    return res
      .status(400)
      .json({ message: "Error Deleting all notifications as read" });
  }
  res.json({ message: `All notifications for user ${id}marked was deleted` });
};

const markOneNotificationasread = async (req, res) => {
  const { id } = req.body;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: `You must give a valid id: ${id}` });
  }
  const updateNotification = await notification.find({ id }).exec();
  if (!updateNotification) {
    return res.status(400).json({ message: "No notifications found" });
  }
  updateNotification.read = false;
  await updateNotification.save();
  res.json(updateNotification);
};

const markAllNotificationsAsRead = async (req, res) => {
  const userId = req.user._id;

  const notificationsUpdateMany = await notification.updateMany(
    { user: userId },
    { $set: { read: true } }
  );
  if (!notificationsUpdateMany) {
    return res
      .status(400)
      .json({ message: "Error Marking all notifications as read" });
  }
  res.json({ message: `All notifications for user ${userId}marked as read` });
};
export {
  getAllNotifications,
  deleteNotification,
  deleteAllNotifications,
  markOneNotificationasread,
  markAllNotificationsAsRead,
};
