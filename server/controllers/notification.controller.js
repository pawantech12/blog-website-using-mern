const Notification = require("../models/notification.model");

const getAllNotificationOfCurrentUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    const notifications = await Notification.find({ user: userId })
      .populate("post")
      .populate("comment")
      .populate("userId")
      .sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const markAllNotificationAsRead = async (req, res) => {
  const userId = req.user.userId;
  try {
    const notifications = await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  getAllNotificationOfCurrentUser,
  markAllNotificationAsRead,
};
