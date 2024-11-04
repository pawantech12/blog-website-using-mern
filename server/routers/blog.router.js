const express = require("express");
const {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogById,
  getAllBlogs,
  // saveBlogPost,
  // unsaveBlogPost,
  getAllUserBlogs,
  getBlogsFromFollowing,
  getAllBlogsByUserId,
  likeBlog,
  unlikeBlog,
  incrementBlogViews,
  getUserBlogsSummary,
} = require("../controllers/blog.controller");
const {
  authenticateToken,
} = require("../middlewares/authenticateToken.middleware");
const upload = require("../config/multer");

const router = express.Router();
// blog routes
router
  .route("/create-blog")
  .post(authenticateToken, upload.single("coverImage"), createBlogPost);
router
  .route("/update-blog/:id")
  .put(authenticateToken, upload.single("coverImage"), updateBlogPost);
router.route("/all-blogs").get(getAllUserBlogs);
router.route("/following-blogs").get(authenticateToken, getBlogsFromFollowing);
router.route("/get-blog/:id").get(incrementBlogViews, getBlogById);
router.route("/get-blogs").get(authenticateToken, getAllBlogs);
router.route("/user/:id/blogs").get(getAllBlogsByUserId);
router.route("/delete-blog/:id").delete(authenticateToken, deleteBlogPost);
router.route("/:blogId/like").post(authenticateToken, likeBlog);
router.route("/:blogId/unlike").post(authenticateToken, unlikeBlog);
router.route("/get-blog-summary").get(authenticateToken, getUserBlogsSummary);

module.exports = router;
