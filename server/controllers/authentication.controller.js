const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");
const userSchemaValidation = require("../validations/user.validation.schema");
const { ZodError } = require("zod");
const register = async (req, res) => {
  try {
    userSchemaValidation.parse(req.body);
    const { name, email, password } = req.body;

    // checking whether the email is already exist or not
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Email already exist", success: false });
    }

    // If user not exist then it will create new user
    const userCreated = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      message: "Registration Successfull",
      success: true,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
        success: false,
      });
    }

    res.status(500).json(error);
  }
};

// user login logic
const login = async (req, res) => {
  try {
    userSchemaValidation.pick({ email: true, password: true }).parse(req.body);
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res
        .status(400)
        .json({ message: "You have not registered", success: false });
    }

    const user = await userExist.comparePassword(password);
    if (user) {
      res.status(200).json({
        message: "Login Successfull",
        success: true,
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res
        .status(401)
        .json({ message: "Invalid Email or password", success: false });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
        success: false,
      });
    }

    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const getUserData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate({
      path: "savedPosts", // Populate saved posts
      populate: [
        {
          path: "author",
          select: "name",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const getUserDataById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate({
      path: "savedPosts", // Populate saved posts
      populate: [
        {
          path: "author",
          select: "name",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const followUserById = async (req, res) => {
  const userId = req.user.userId;
  const followingId = req.params.id;

  if (userId === followingId) {
    return res.status(400).json({
      success: false,
      message: "You cannot follow yourself.",
    });
  }

  try {
    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (currentUser.following.includes(followingId)) {
      return res.status(400).json({
        success: false,
        message: "You are already following this user.",
      });
    }

    currentUser.following.push(followingId);
    await currentUser.save();

    userToFollow.followers.push(userId);
    await userToFollow.save();
    res.status(200).json({
      success: true,
      message: "User followed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const unfollowUserById = async (req, res) => {
  const userId = req.user.userId;
  const followingId = req.params.id;

  if (userId === followingId) {
    return res.status(400).json({
      success: false,
      message: "You cannot unfollow yourself.",
    });
  }

  try {
    const userToUnfollow = await User.findById(followingId);
    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!currentUser.following.includes(followingId)) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user.",
      });
    }

    // Remove from currentUser's following list
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== followingId.toString()
    );
    await currentUser.save();

    // Remove from userToUnfollow's followers list
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== userId.toString()
    );
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const fetchCurrentUserAllLikedPost = async (req, res) => {
  const userId = req.user.userId;
  try {
    // Find the user by their ID and populate likedPosts with blog details
    const user = await User.findById(userId).populate("likedPosts");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    // likedPosts already contains populated blog details
    const likedBlogs = user.likedPosts;

    res.status(200).json({ success: true, blogs: likedBlogs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const toggleSavedPost = async (req, res) => {
  const userId = req.user.userId; // Get user ID from JWT
  const blogId = req.params.blogId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Check if the post is already saved
    const isPostSaved = user.savedPosts.includes(blogId);

    if (isPostSaved) {
      // Remove post from savedPosts
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== blogId
      );
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post removed from saved posts.",
        savedPosts: user.savedPosts,
      });
    } else {
      // Add post to savedPosts
      user.savedPosts.push(blogId);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post saved successfully.",
        savedPosts: user.savedPosts,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
const getSavedPosts = async (req, res) => {
  const userId = req.user.userId; // Get user ID from the JWT token

  try {
    const user = await User.findById(userId).populate({
      path: "savedPosts", // Populate saved posts
      populate: [
        {
          path: "author",
          select: "name",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    }); // Populate savedPosts with Blog data
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Respond with saved posts
    return res.status(200).json({
      success: true,
      savedPosts: user.savedPosts || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
const updateUserProfileDetails = async (req, res) => {
  try {
    const userId = req.user.userId; // Assume you're getting user ID from token
    const {
      name,
      username,
      summary,
      headline,
      city,
      state,
      country,
      dob,
      gender,
      age,
    } = req.body;

    // Prepare user update data (only include fields that were provided)
    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (summary) updateData.summary = summary;
    if (headline) updateData.headline = headline;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (country) updateData.country = country;
    if (dob) updateData.dob = dob;
    if (gender) updateData.gender = gender;
    if (age) updateData.age = age;

    // Get the current user details from the database
    const currentUser = await User.findById(userId);

    // Handle image uploads
    if (req.files) {
      // Check if a banner image is uploaded
      if (req.files.bannerImg && req.files.bannerImg[0]) {
        // Delete the previous banner image from Cloudinary
        if (currentUser.bannerImg) {
          const publicId = currentUser.bannerImg.split("/").pop().split(".")[0]; // Extract public ID
          await cloudinary.uploader.destroy(
            `blog_website/banner_images/${publicId}`
          );
        }

        const bannerImgResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "blog_website/banner_images" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.files.bannerImg[0].buffer); // Send the file buffer to Cloudinary
        });
        updateData.bannerImg = bannerImgResult.secure_url; // Store the new URL
      }

      // Check if a profile image is uploaded
      if (req.files.profileImg && req.files.profileImg[0]) {
        // Delete the previous profile image from Cloudinary
        if (currentUser.profileImg) {
          const publicId = currentUser.profileImg
            .split("/")
            .pop()
            .split(".")[0]; // Extract public ID
          await cloudinary.uploader.destroy(
            `blog_website/profile_images/${publicId}`
          );
        }

        const profileImgResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "blog_website/profile_images" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.files.profileImg[0].buffer); // Send the file buffer to Cloudinary
        });
        updateData.profileImg = profileImgResult.secure_url; // Store the new URL
      }
    }

    // Update the user details in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserData,
  getUserDataById,
  followUserById,
  unfollowUserById,
  fetchCurrentUserAllLikedPost,
  toggleSavedPost,
  getSavedPosts,
  updateUserProfileDetails,
};
