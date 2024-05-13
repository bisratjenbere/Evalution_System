import express from "express";
import {
  getAllNotifications,
  deleteNotification,
  markOneNotificationasread,
  deleteAllNotifications,
  markAllNotificationsAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router
  .route("/")
  .post(getAllNotifications)
  .delete(deleteNotification)
  .patch(markOneNotificationasread);

router
  .route("/all")
  .delete(deleteAllNotifications)
  .patch(markAllNotificationsAsRead);

export default router;
