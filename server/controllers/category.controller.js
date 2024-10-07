const cloudinary = require("../config/cloudinary");
const Category = require("../models/category.model");

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

    // Handle image upload to Cloudinary
    let imageUrl = "";

    if (req.file) {
      // Use a Promise to handle the upload
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "category_images" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(new Error("Image upload failed"));
            }
            resolve(result.secure_url);
          }
        );

        // End the stream with the file buffer
        stream.end(req.file.buffer);
      });
    }

    // Create a new category document
    const newCategory = new Category({
      name,
      imageUrl: imageUrl,
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories
    res.status(200).json({
      success: true,
      categories,
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

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
