const cloudinary = require("../config/cloudinary");
const Category = require("../models/category.model");
const Blog = require("../models/blog.model");
const crypto = require("crypto");
// Helper function to compute hash of image buffer
const computeImageHash = (buffer) => {
  return crypto.createHash("md5").update(buffer).digest("hex");
};
// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      // Compute hash of the image buffer
      const imageBuffer = req.file.buffer;
      const imageHash = computeImageHash(imageBuffer);

      // Check if the image with the same hash already exists in the database
      const existingCategory = await Category.findOne({ imageHash });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with the same image already exists",
        });
      }

      // Upload image to Cloudinary and get the public_id and secure_url
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_website/category_images" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(new Error("Image upload failed"));
            }
            resolve(result);
          }
        );
        stream.end(imageBuffer); // Upload the image buffer
      });

      imageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;

      // Save the new category with the image hash
      const newCategory = new Category({
        name,
        imageUrl: imageUrl,
        imageHash: imageHash, // Save the computed hash
        publicId: publicId,
      });

      await newCategory.save();

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        category: newCategory,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};
// Get all categories with blog post count
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories

    // For each category, count the blog posts associated with it
    const categoriesWithPostCount = await Promise.all(
      categories.map(async (category) => {
        const blogPostCount = await Blog.countDocuments({
          category: category._id, // Count blog posts where the category matches
        });

        return {
          ...category._doc, // Spread category details
          blogPostCount, // Add blog post count to the category object
        };
      })
    );

    res.status(200).json({
      success: true,
      categories: categoriesWithPostCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
      error: error.message,
    });
  }
};
// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete image from Cloudinary
    if (deletedCategory.publicId) {
      await cloudinary.uploader.destroy(deletedCategory.publicId);
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

const getAllBlogsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const blogs = await Blog.find({ category: categoryId })
      .populate("author", "name")
      .populate("category", "name");
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog posts",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  getAllBlogsByCategoryId,
};
