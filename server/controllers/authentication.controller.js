const upload = require("../config/multer");
const User = require("../models/user.model");

const register = async (req, res) => {
  try {
    console.log(req.body);
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
    console.log(error);

    res.status(500).json(error);
  }
};

// user login logic
const login = async (req, res) => {
  try {
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
    res.status(500).json({ message: "Internal Server Error", success: false });
    console.error(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

const fetchCurrentUserAllLikedPost = async (req, res) => {
  const userId = req.user.userId;
  console.log("user Id: ", userId);
  try {
    // Find the user by their ID and populate likedPosts with blog details
    const user = await User.findById(userId).populate("likedPosts");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    console.log("user data: ", user);
    // likedPosts already contains populated blog details
    const likedBlogs = user.likedPosts;
    console.log("liked blogs: ", likedBlogs);

    res.status(200).json({ success: true, blogs: likedBlogs || [] });
  } catch (error) {
    console.error("Error fetching liked blogs:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const toggleSavedPost = async (req, res) => {
  const userId = req.user.userId; // Get user ID from JWT
  const blogId = req.params.blogId;
  console.log("userid: ", userId);
  console.log("blogid: ", blogId);

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
    console.error("Error toggling saved post:", error);
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
    console.error("Error fetching saved posts:", error);
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

    // Prepare user update data
    const updateData = {
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
    };

    // Handle image uploads
    if (req.file) {
      // Check if a banner image is uploaded
      if (req.file.fieldname === "bannerImg") {
        const result = await cloudinary.uploader.upload_stream(
          { folder: "banner_images" }, // Specify the folder
          (error, result) => {
            if (error) return res.status(500).json({ error: "Upload failed" });
            updateData.bannerImg = result.secure_url; // Save the URL
          }
        );
        await upload.single("bannerImg")(req, res, () => result);
      }

      // Check if a profile image is uploaded
      if (req.file.fieldname === "profileImg") {
        const result = await cloudinary.uploader.upload_stream(
          { folder: "profile_images" }, // Specify the folder
          (error, result) => {
            if (error) return res.status(500).json({ error: "Upload failed" });
            updateData.profileImg = result.secure_url; // Save the URL
          }
        );
        await upload.single("profileImg")(req, res, () => result);
      }
    }

    // Update the user details in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
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
