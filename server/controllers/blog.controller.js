const Blog = require("../models/blog.model");
const User = require("../models/user.model");
// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, content, category, coverImage, isDraft, isFeatured } =
      req.body;
    const userId = req.user.userId; // Assuming you're getting user ID from JWT token
    // console.log(userId);
    const blog = await Blog.findOne({
      title,
      author: userId,
    });
    if (blog) {
      return res.status(400).json({
        success: false,
        message: "Blog post already exists",
      });
    }

    const newBlog = new Blog({
      title,
      content,
      category,
      coverImage,
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
    const { title, content, category, coverImage } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content, category, coverImage },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog post updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
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
