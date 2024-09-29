const express = require("express");
const {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogById,
  getAllBlogs,
} = require("../controllers/blog.controller");
const {
  authenticateToken,
} = require("../middlewares/authenticateToken.middleware");

const router = express.Router();
// blog routes
router.route("/create-blog").post(authenticateToken, createBlogPost);
router.route("/get-blog/:id").get(authenticateToken, getBlogById);
router.route("/get-blogs").get(authenticateToken, getAllBlogs);
router.route("/update-blog/:id").put(authenticateToken, updateBlogPost);
router.route("/delete-blog/:id").delete(authenticateToken, deleteBlogPost);

module.exports = router;
