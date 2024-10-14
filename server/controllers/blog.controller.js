const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");

// Helper function to compute hash of image buffer
const computeImageHash = (buffer) => {
  return crypto.createHash("md5").update(buffer).digest("hex");
};

// Helper function to delete an image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
  }
};

// Helper function to upload an image to Cloudinary
const uploadImageToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blog_images" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(new Error("Image upload failed"));
        }
        resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};

// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const {
      title,
      content,
      category: categoryName,
      isDraft,
      isFeatured,
    } = req.body;
    const userId = req.user.userId;

    // Check for existing blog post with the same title by the same user
    const blogExists = await Blog.findOne({ title, author: userId });
    if (blogExists) {
      return res.status(400).json({
        success: false,
        message: "Blog post with this title already exists",
      });
    }

    // Find the category by name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    let coverImageUrl = "";
    let publicId = "";

    // Check if an image is provided
    if (req.file) {
      // Compute hash of the image buffer
      const imageBuffer = req.file.buffer;
      const imageHash = computeImageHash(imageBuffer);

      // Check if the image with the same hash already exists in the database
      const existingBlogImage = await Blog.findOne({ imageHash });
      if (existingBlogImage) {
        return res.status(400).json({
          success: false,
          message: "Blog post with the same image already exists",
        });
      }

      // Upload the image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(req.file);
      coverImageUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;

      // Save the image hash for future duplicate checks
      const newBlog = new Blog({
        title,
        content,
        category: category._id,
        coverImage: coverImageUrl,
        imageHash, // Save the computed hash
        coverImagePublicId: publicId,
        author: userId,
        isDraft,
        isFeatured,
      });

      await newBlog.save();

      return res.status(201).json({
        success: true,
        message: "Blog post created successfully",
        blog: newBlog,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }
  } catch (error) {
    console.error("Error creating blog post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create blog post",
      error: error.message,
    });
  }
};

// Update a blog post
const updateBlogPost = async (req, res) => {
  try {
    const blogId = req.params.id;
    const {
      title,
      content,
      category: categoryName,
      isDraft,
      isFeatured,
    } = req.body;

    // Find the existing blog post
    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Find the category by name
    const category = await Category.findOne({ name: categoryName });
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category" });
    }

    let coverImageUrl = existingBlog.coverImage;
    let publicId = existingBlog.coverImagePublicId;
    let imageHash = existingBlog.coverImageHash;

    // Check if a new image is provided
    if (req.file) {
      // Compute hash of the image buffer
      const imageBuffer = req.file.buffer;
      const newImageHash = computeImageHash(imageBuffer);

      // Check for existing blog post with the same image hash
      const duplicateImage = await Blog.findOne({
        coverImageHash: newImageHash,
        author: existingBlog.author,
      });
      if (!duplicateImage) {
        // Delete the existing image from Cloudinary
        if (publicId) {
          await deleteImageFromCloudinary(publicId);
        }

        // Upload the new image to Cloudinary
        const uploadResult = await uploadImageToCloudinary(req.file);
        coverImageUrl = uploadResult.secure_url;
        publicId = uploadResult.public_id;
        imageHash = newImageHash; // Update the hash
      } else {
        return res.status(400).json({
          success: false,
          message: "Blog post with the same image already exists",
        });
      }
    }

    // Update the blog post in the database
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        content,
        category: category._id,
        coverImage: coverImageUrl,
        coverImagePublicId: publicId,
        coverImageHash: imageHash, // Save the updated image hash
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

    // Find the blog post to be deleted
    const blogToDelete = await Blog.findById(blogId);

    if (!blogToDelete) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found",
      });
    }

    // Delete the cover image from Cloudinary
    if (blogToDelete.coverImagePublicId) {
      await deleteImageFromCloudinary(blogToDelete.coverImagePublicId);
    }

    // Delete the blog post from the database
    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete blog post",
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

const getAllUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("category", "name")
      .populate("author", "name")
      .populate("likes")
      .sort({ createdAt: -1 });
    if (!blogs) {
      return res.status(404).json({
        success: false,
        message: "Blogs not found",
      });
    }
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
const getAllBlogsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const blogs = await Blog.find({ author: userId });
    if (!blogs) {
      return res.status(404).json({
        success: false,
        message: "Blogs not found",
      });
    }
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

const getBlogsFromFollowing = async (req, res) => {
  try {
    const userId = req.user.userId; // This is the currently logged-in user ID

    // Find the current user and populate the 'following' field with their data
    const currentUser = await User.findById(userId).populate("following");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get the IDs of the users being followed
    const followingUserIds = currentUser.following.map((user) => user._id);

    // Fetch blogs written by the users being followed
    const blogs = await Blog.find({
      author: { $in: followingUserIds },
    })
      .populate("author")
      .populate("category", "name");

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found from following users",
      });
    }

    res.status(200).json({
      success: true,
      followingUsers: currentUser.following,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// Get a single blog post by ID
const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId)
      .populate("author")
      .populate("category");

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

// Controller for liking a blog post
const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.userId; // Assumes user is authenticated

    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId); // Fetch the user to update likedPosts

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Check if the user has already liked the blog
    if (blog.likes.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Blog already liked" });
    }

    // Add userId to blog's likes
    blog.likes.push(userId);
    await blog.save();

    // Add blogId to user's likedPosts
    user.likedPosts.push(blogId);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Blog liked", likes: blog.likes });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const unlikeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }

    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId); // Fetch the user to update likedPosts

    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    // Check if the blog has the user ID in its likes
    if (!blog.likes.includes(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Blog not liked yet" });
    }

    // Remove userId from blog's likes
    blog.likes = blog.likes.filter(
      (like) => like.toString() !== userId.toString()
    );
    await blog.save();

    // Remove blogId from user's likedPosts
    user.likedPosts = user.likedPosts.filter(
      (postId) => postId.toString() !== blogId.toString()
    );
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Blog unliked", likes: blog.likes });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createBlogPost,
  getAllBlogs,
  getAllUserBlogs,
  getAllBlogsByUserId,
  getBlogsFromFollowing,
  getBlogById,
  updateBlogPost,
  deleteBlogPost,
  saveBlogPost,
  unsaveBlogPost,
  likeBlog,
  unlikeBlog,
};
