const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["like", "save", "follow", "comment"],
    required: true,
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" }, // Associated blog post if applicable
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // Associated comment if applicable
  message: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
