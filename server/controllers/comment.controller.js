const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");

const createComment = async (req, res) => {
  const { content, blogId } = req.body;
  const userId = req.user.userId;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const newComment = new Comment({
      content,
      author: userId,
      blog: blogId,
    }).populate("author", "name profileImg");

    await newComment.save();

    // Populate the author field after saving
    newComment = await newComment
      .populate("author", "name profileImg")
      .execPopulate();

    res.status(201).json({
      message: "Comment created successfully",
      success: true,
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const fetchCommentsByBlogId = async (req, res) => {
  const { blogId } = req.params;
  try {
    const comments = await Comment.find({ blog: blogId })
      .populate("author", "name profileImg")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.userId;
  try {
    const comment = await Comment.findById(commentId);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    if (comment.author.toString() !== userId.toString()) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user" });
    }

    await comment.remove();

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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

module.exports = {
  createComment,
  fetchCommentsByBlogId,
  deleteComment,
  likeComment,
  dislikeComment,
};
