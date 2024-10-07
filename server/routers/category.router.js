const express = require("express");

const {
  authenticateToken,
} = require("../middlewares/authenticateToken.middleware");
const upload = require("../config/multer");
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/category.controller");

const router = express.Router();
// blog routes
router
  .route("/create-category")
  .post(authenticateToken, upload.single("imageUrl"), createCategory);

router.route("/get-categories").get(authenticateToken, getCategories);
router.route("/delete-category/:id").delete(authenticateToken, deleteCategory);

module.exports = router;
