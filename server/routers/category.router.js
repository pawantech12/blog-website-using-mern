const express = require("express");

const {
  authenticateToken,
} = require("../middlewares/authenticateToken.middleware");
const upload = require("../config/multer");
const {
  createCategory,
  getCategories,
  deleteCategory,
  getAllBlogsByCategoryId,
} = require("../controllers/category.controller");

const router = express.Router();
// blog routes
router
  .route("/create-category")
  .post(authenticateToken, upload.single("imageUrl"), createCategory);

router.route("/get-categories").get(getCategories);
router.route("/delete-category/:id").delete(authenticateToken, deleteCategory);
router.route("/get-blogs-by-category/:id").get(getAllBlogsByCategoryId);

module.exports = router;
