const express = require("express");
const {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogById,
  getAllBlogs,
  saveBlogPost,
  unsaveBlogPost,
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
router.route("/get-blog/:id").get(authenticateToken, getBlogById);
router.route("/get-blogs").get(authenticateToken, getAllBlogs);
router.route("/delete-blog/:id").delete(authenticateToken, deleteBlogPost);
router.route("/save-blog/:id").put(authenticateToken, saveBlogPost);
router.route("/unsave-blog/:id").put(authenticateToken, unsaveBlogPost);

module.exports = router;
