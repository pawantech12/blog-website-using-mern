const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const cloudinary = require("../config/cloudinary");
const crypto = require("crypto");
const Notification = require("../models/notification.model");
const {
  sendRealTimeNotification,
  deleteRealTimeNotification,
} = require("../socket");
const mongoose = require("mongoose");
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
      { folder: "blog_website/blog_images" },
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

    // Build the update object
    const updateFields = {};

    if (title !== undefined && title !== "") updateFields.title = title;
    if (content !== "") updateFields.content = content;
    if (isDraft !== undefined) updateFields.isDraft = isDraft;
    if (isFeatured !== undefined) updateFields.isFeatured = isFeatured;

    // Handle category if provided
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid category" });
      }
      updateFields.category = category._id;
    }

    // Handle image if provided
    if (req.file) {
      const imageBuffer = req.file.buffer;
      const newImageHash = computeImageHash(imageBuffer);

      const duplicateImage = await Blog.findOne({
        coverImageHash: newImageHash,
        author: existingBlog.author,
      });

      if (!duplicateImage) {
        if (existingBlog.coverImagePublicId) {
          await deleteImageFromCloudinary(existingBlog.coverImagePublicId);
        }

        const uploadResult = await uploadImageToCloudinary(req.file);
        updateFields.coverImage = uploadResult.secure_url;
        updateFields.coverImagePublicId = uploadResult.public_id;
        updateFields.coverImageHash = newImageHash;
      } else {
        return res.status(400).json({
          success: false,
          message: "Blog post with the same image already exists",
        });
      }
    }

    // Update the blog post in the database
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, updateFields, {
      new: true,
    });

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
    const blogs = await Blog.find({ author: userId })
      .populate("category", "name")
      .populate("author", "name");
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
    const blogs = await Blog.find({ author: userId }).populate(
      "category",
      "name"
    );
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
      .populate({
        path: "author",
        populate: "socialMedia",
      })
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

    if (userId === blog.author.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot like your own blog" });
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

    const notification = new Notification({
      user: blog.author,
      userId: user._id,
      post: blog._id,
      type: "like",
      message: `${user.name} liked your blog post ${blog.title}`,
    });
    await notification.save();

    const populatedNotification = await Notification.populate(notification, [
      { path: "userId", select: "name profileImg" },
      { path: "post", select: "title" },
    ]);

    // Emit real-time notification to the blog author
    sendRealTimeNotification(blog.author, populatedNotification);

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

    const deleteNotification = await Notification.findOneAndDelete({
      user: blog.author,
      userId: user._id,
      post: blog._id,
      type: "like",
      message: `${user.name} liked your blog post ${blog.title}`,
    });

    if (deleteNotification) {
      deleteRealTimeNotification(blog.author, deleteNotification._id);
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

const VIEW_THRESHOLD = 60 * 60 * 1000; // 1 hour in milliseconds

const incrementBlogViews = async (req, res, next) => {
  const blogId = req.params.id;
  const userId = req.user ? req.user.userId : null; // Check if user is authenticated

  try {
    const currentTime = new Date();

    if (userId) {
      // Authenticated user logic
      const user = await User.findById(userId);
      const recentlyViewed = user.recentlyViewed.find(
        (view) => view.blogId.toString() === blogId
      );

      if (
        !recentlyViewed ||
        currentTime - recentlyViewed.lastViewedAt > VIEW_THRESHOLD
      ) {
        // Update recently viewed for the user
        if (recentlyViewed) {
          recentlyViewed.lastViewedAt = currentTime;
        } else {
          user.recentlyViewed.push({ blogId, lastViewedAt: currentTime });
        }
        await user.save();
        await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
      }
    } else {
      // Unauthenticated user logic
      if (!req.session.views) {
        req.session.views = {};
      }

      const lastViewed = req.session.views[blogId];
      if (!lastViewed || currentTime - lastViewed > VIEW_THRESHOLD) {
        // Update session and increment view count
        req.session.views[blogId] = currentTime;
        await Blog.findByIdAndUpdate(blogId, { $inc: { views: 1 } });
      }
    }

    next();
  } catch (error) {
    console.error("Error incrementing blog views:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getUserBlogsSummary = async (req, res) => {
  const userId = req.user.userId; // Assuming user ID is stored in req.user after authentication

  try {
    const summary = await Blog.aggregate([
      // Match blogs by the logged-in user
      { $match: { author: new mongoose.Types.ObjectId(userId) } },

      // Populate the category with only its name
      {
        $lookup: {
          from: "categories", // Collection name in MongoDB
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            { $project: { _id: 1, name: 1 } }, // Include only name field
          ],
        },
      },
      { $unwind: "$category" }, // Unwind to get category object

      // Populate the author with only their name
      {
        $lookup: {
          from: "users", // Collection name in MongoDB
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [
            { $project: { _id: 1, name: 1 } }, // Include only name field
          ],
        },
      },
      { $unwind: "$author" }, // Unwind to get author object

      // Group to calculate total views and total likes
      {
        $group: {
          _id: null, // Group all documents together
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: { $size: "$likes" } }, // Count the length of the likes array
          blogs: { $push: "$$ROOT" }, // Collect all blogs in an array
        },
      },

      // Project the desired fields
      {
        $project: {
          _id: 1,
          totalViews: 1,
          totalLikes: 1,
          blogs: 1, // Include the blogs array in the final output
        },
      },
    ]);

    res
      .status(200)
      .json(summary[0] || { totalViews: 0, totalLikes: 0, blogs: [] });
  } catch (error) {
    console.error("Error fetching user blogs summary:", error);
    res.status(500).json({ message: "Server error", error });
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
  incrementBlogViews,
  likeBlog,
  unlikeBlog,
  getUserBlogsSummary,
};
