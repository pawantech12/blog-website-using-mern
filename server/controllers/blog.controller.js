const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");
// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, content, category, isDraft, isFeatured } = req.body;
    const userId = req.user.userId; // Assuming JWT user authentication

    let coverImageUrl = "";
    const blogExists = await Blog.findOne({ title, author: userId });
    if (blogExists) {
      return res.status(400).json({
        success: false,
        message: "Blog post already exists",
      });
    }

    // Upload image to Cloudinary if a file is provided
    if (req.file) {
      // Use a Promise to handle the upload
      coverImageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_images" },
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

    const newBlog = new Blog({
      title,
      content,
      category,
      coverImage: coverImageUrl,
      author: userId,
      isDraft,
      isFeatured,
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog post created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog post:", error); // Log the error for debugging
    res.status(500).json({
      success: false,
      message: "Failed to create blog post",
      error: error.message,
    });
  }
};

// Get all blog posts
const getAllBlogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogs = await Blog.find({ author: userId });
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

// Get a single blog post by ID
const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog post",
      error: error.message,
    });
  }
};

// Update a blog post
const updateBlogPost = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, content, category, isDraft, isFeatured } = req.body;

    let coverImageUrl = "";

    // Find the existing blog post
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Check if a new image is provided in the request
    if (req.file) {
      // Upload the new image to Cloudinary
      coverImageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "blog_images" },
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
    } else {
      // If no new image is uploaded, keep the existing one
      coverImageUrl = existingBlog.coverImage;
    }

    // Update the blog post in the database
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        category,
        coverImage: coverImageUrl,
        isDraft,
        isFeatured,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update blog post",
      error: error.message,
    });
  }
};

// Delete a blog post
const deleteBlogPost = async (req, res) => {
  try {
    const blogId = req.params.id;

    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog post",
      error: error.message,
    });
  }
};

// Save a blog post to user's saved posts
const saveBlogPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogId = req.params.id;
    // console.log("userId", userId);
    // console.log("blogId", blogId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if blog is already saved
    if (user.savedPosts.includes(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Blog post already saved",
      });
    }

    user.savedPosts.push(blogId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Blog post saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to save blog post",
      error: error.message,
    });
  }
};

// Remove a blog post from user's saved posts
const unsaveBlogPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const blogId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if blog is not in saved posts
    if (!user.savedPosts.includes(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Blog post not in saved posts",
      });
    }

    user.savedPosts = user.savedPosts.filter(
      (postId) => postId.toString() !== blogId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Blog post removed from saved posts",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to unsave blog post",
      error: error.message,
    });
  }
};

module.exports = {
  createBlogPost,
  getAllBlogs,
  getBlogById,
  updateBlogPost,
  deleteBlogPost,
  saveBlogPost,
  unsaveBlogPost,
};
