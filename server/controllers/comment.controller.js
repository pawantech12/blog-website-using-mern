const mongoose = require("mongoose");
const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");
const Reply = require("../models/reply.model");
const {
  sendRealTimeNotification,
  deleteRealTimeNotification,
} = require("../socket");
const Notification = require("../models/notification.model");
const User = require("../models/user.model");

const createComment = async (req, res) => {
  const { content, blogId } = req.body;
  console.log("Comment content: ", content);
  console.log("Blog ID: ", blogId);

  if (!content || !blogId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userId = req.user.userId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const newComment = new Comment({
      content,
      author: userId,
      blog: blogId,
    });

    await newComment.save();

    const user = await User.findById(userId);

    const notification = new Notification({
      user: blog.author,
      userId: user._id,
      post: blog._id,
      type: "comment",
      comment: newComment._id,
      message: `${user.name} Commented on your post ${blog.title}`,
    });

    await notification.save();

    // Populate the notification before sending it
    const populatedNotification = await Notification.populate(notification, [
      { path: "userId", select: "name profileImg" },
      { path: "post", select: "title" },
      { path: "comment" },
    ]);

    // Emit real-time notification to the blog author
    sendRealTimeNotification(blog.author, populatedNotification);
    // Populate the author field after saving
    const populatedComment = await Comment.populate(newComment, {
      path: "author",
      select: "name profileImg",
    });

    res.status(201).json({
      message: "Comment created successfully",
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const fetchCommentsByBlogId = async (req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.find({ blog: blogId })
      .populate("author", "name profileImg")
      .populate({
        path: "replies",
        populate: [
          {
            path: "author",
            select: "name profileImg",
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const fetchAllCommentsOfCurrentUser = async (req, res) => {
  const userId = req.user.userId;
  try {
    // Fetch all blogs authored by the current user
    const blogs = await Blog.find({ author: userId }).select("_id"); // Get only blog IDs

    // Extract blog IDs into an array
    const blogIds = blogs.map((blog) => blog._id);

    // Fetch comments on these blogs, but exclude comments authored by the current user
    const comments = await Comment.find({
      blog: { $in: blogIds },
      author: { $ne: userId },
    })
      .populate("author", "name profileImg")
      .populate({
        path: "replies",
        populate: {
          path: "author",
          select: "name profileImg",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  console.log("Received commentId: ", commentId);

  const userId = req.user?.userId;
  console.log("Received userId: ", userId);

  try {
    const comment = await Comment.findById(commentId).populate(
      "author",
      "name"
    );

    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.author._id.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    // Delete the notification
    const blog = await Blog.findById(comment.blog);

    const deleteNotification = await Notification.findOneAndDelete({
      user: blog.author,
      userId: userId,
      post: blog._id,
      type: "comment",
      comment: commentId,
      message: `${comment.author.name} Commented on your post ${blog.title}`,
    });

    if (deleteNotification) {
      deleteRealTimeNotification(blog.author, deleteNotification._id);
    }

    // Delete the comment by its ID
    await Comment.findByIdAndDelete(commentId);

    return res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Like a comment
const likeComment = async (req, res) => {
  const { commentId } = req.params;
  console.log("comment id: ", commentId);
  const userId = req.user.userId;
  console.log("user id: ", userId);

  try {
    const comment = await Comment.findById(commentId).populate(
      "author",
      "name profileImg"
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author._id.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot Like to your own comment",
        success: false,
      });
    }

    // If the user has disliked the comment, remove the dislike
    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // If the user has already liked the comment, remove the like
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Otherwise, add the like
      comment.likes.push(userId);
    }

    await comment.save();
    res.status(200).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Dislike a comment
const dislikeComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;

  try {
    const comment = await Comment.findById(commentId).populate(
      "author",
      "name profileImg"
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author._id.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot Dislike to your own comment",
        success: false,
      });
    }

    // If the user has liked the comment, remove the like
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // If the user has already disliked the comment, remove the dislike
    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // Otherwise, add the dislike
      comment.dislikes.push(userId);
    }

    await comment.save();
    res.status(200).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const replyToComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  if (!content) {
    return res.status(400).json({ message: "Reply content is required" });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }

    if (comment.author.toString() === userId.toString()) {
      return res.status(400).json({
        message: "You cannot reply to your own comment",
        success: false,
      });
    }

    // Log the comment to check its structure
    console.log("Comment retrieved:", comment);

    // Create a new reply comment
    const newReply = new Reply({
      content,
      author: userId,
      commentId: comment._id, // Ensure the reply has a blog reference if needed
    });

    // Save the new reply
    await newReply.save();

    // Add the reply to the comment
    comment.replies.push(newReply._id);
    await comment.save();

    // Populate the new reply
    const populatedReply = await Reply.findById(newReply._id).populate(
      "author",
      "name profileImg"
    );

    res.status(201).json({
      message: "Reply added successfully",
      success: true,
      reply: populatedReply,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", success: false, error: error.message });
  }
};

module.exports = {
  createComment,
  fetchCommentsByBlogId,
  fetchAllCommentsOfCurrentUser,
  deleteComment,
  likeComment,
  dislikeComment,
  replyToComment,
};
