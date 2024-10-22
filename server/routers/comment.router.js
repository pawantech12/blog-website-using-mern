const express = require("express");
const {
  authenticateToken,
} = require("../middlewares/authenticateToken.middleware");
const {
  createComment,
  fetchCommentsByBlogId,
  deleteComment,
  likeComment,
  dislikeComment,
  replyToComment,
  fetchAllCommentsOfCurrentUser,
} = require("../controllers/comment.controller");
const router = express.Router();

router.route("/create-comment").post(authenticateToken, createComment);
router.route("/fetch-comments/:blogId").get(fetchCommentsByBlogId);
router
  .route("/fetch-all-comments")
  .get(authenticateToken, fetchAllCommentsOfCurrentUser);
router.route("/:commentId/like").put(authenticateToken, likeComment);
router.route("/:commentId/dislike").put(authenticateToken, dislikeComment);
router.route("/:commentId/reply").post(authenticateToken, replyToComment);
router
  .route("/delete-comment/:commentId")
  .delete(authenticateToken, deleteComment);

module.exports = router;
