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
} = require("../controllers/comment.controller");
const router = express.Router();

router.route("/create-comment").post(authenticateToken, createComment);
router.route("/fetch-comments/:blogId").get(fetchCommentsByBlogId);
router.route("/:commentId/like").put(authenticateToken, likeComment);
router.route("/:commentId/dislike").put(authenticateToken, dislikeComment);
router
  .route("/delete-comment/:commentId")
  .delete(authenticateToken, deleteComment);

module.exports = router;
