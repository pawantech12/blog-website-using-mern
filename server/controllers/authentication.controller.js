const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary");
const userSchemaValidation = require("../validations/user.validation.schema");
const { ZodError } = require("zod");
const generateOTP = require("../utils/generate_otp");
const sendEmail = require("../utils/send_email");
const SocialMedia = require("../models/socialmedia.model");
const bcrypt = require("bcryptjs");
const Notification = require("../models/notification.model");
const {
  sendRealTimeNotification,
  deleteRealTimeNotification,
} = require("../socket");
const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");
const Reply = require("../models/reply.model");
const register = async (req, res) => {
  try {
    userSchemaValidation.parse(req.body);
    const { name, email, password } = req.body;

    // checking whether the email is already exist or not
    const userExist = await User.findOne({ email: email });
    if (userExist && userExist.isVerified === false) {
      return res.status(200).json({
        message: "Email already exist but not verified",
        // i want to send only email,isverified,id

        userId: userExist._id.toString(),
        isVerified: userExist.isVerified,
        success: false,
      });
    }
    if (userExist && userExist.isVerified === true) {
      return res
        .status(400)
        .json({ message: "Email already exist and verified", success: false });
    }
    // Create user with OTP (Not verified yet)
    const otp = generateOTP();
    // If user not exist then it will create new user
    const newUser = new User({
      name,
      email,
      password,
      otp,
    });

    await newUser.save();

    // Send OTP to the user's email
    await sendEmail(
      email,
      "Verify your account",
      `Your OTP for account verification is: ${otp}`
    );

    res.status(201).json({
      message: "Registration Successfull",
      success: true,
      userId: newUser._id.toString(),
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
// verify user email controller
const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Incorrect OTP", success: false });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      success: true,
      isVerified: user.isVerified,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body; // Expecting email in the request body

    // Find the user by email
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Account already verified", success: false });
    }

    // Generate a new OTP and update the user
    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    // Send the new OTP to the user's email
    await sendEmail(
      user.email,
      "Resend OTP for Account Verification",
      `Your new OTP for account verification is: ${otp}`
    );

    res.status(200).json({
      message: "OTP has been re-sent to your email",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
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

    if (userExist.isVerified === false) {
      return res
        .status(401)
        .json({ message: "Please verify your email to login", success: false });
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
    const user = await User.findById(userId)
      .populate({
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
      })
      .populate({
        path: "followers",
        select: "name username profileImg",
        populate: {
          path: "followers",
          select: "_id",
        },
      })
      .populate("following", "name username profileImg")
      .populate("socialMedia");
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
    const user = await User.findById(userId)
      .populate({
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
      })
      .populate("socialMedia");

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
    const notification = new Notification({
      user: userToFollow._id, // The user receiving the notification
      userId: currentUser._id,
      type: "follow", // Type of notification
      message: `${currentUser.name} has followed you.`,
    });
    await notification.save();

    // Populate the notification before sending it
    const populatedNotification = await Notification.populate(notification, [
      { path: "userId", select: "name profileImg" },
    ]);

    // Emit real-time notification to the blog author
    sendRealTimeNotification(userToFollow._id, populatedNotification);

    currentUser.following.push(followingId);
    await currentUser.save();

    userToFollow.followers.push(userId);
    await userToFollow.save();

    // Populate the 'following' field with specific fields (name, username, profileImg)
    const populatedCurrentUser = await User.findById(userId)
      .populate({
        path: "followers",
        select: "name username profileImg",
        populate: {
          path: "followers",
          select: "_id",
        },
      })
      .populate("following", "name username profileImg");

    res.status(200).json({
      success: true,
      message: "User followed successfully.",
      updatedFollowing: populatedCurrentUser.following,
      updatedFollowers: populatedCurrentUser.followers,
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
    console.log("current user following: ", currentUser.following);

    // Delete the follow notification for the userToUnfollow
    const deleteNotification = await Notification.findOneAndDelete({
      user: userToUnfollow._id, // The user who received the notification
      userId: currentUser._id,
      type: "follow",
      message: `${currentUser.name} has followed you.`, // Specific message for the notification
    });

    if (deleteNotification) {
      deleteRealTimeNotification(userToUnfollow._id, deleteNotification._id);
    }

    // Populate the 'following' field with specific fields (name, username, profileImg)
    const populatedCurrentUser = await User.findById(userId)
      .populate({
        path: "followers",
        select: "name username profileImg",
        populate: {
          path: "followers",
          select: "_id",
        },
      })
      .populate("following", "name username profileImg");

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully.",
      updatedFollowing: populatedCurrentUser.following,
      updatedFollowers: populatedCurrentUser.followers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error,
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

    // Find the blog to check if it exists
    const findBlogUser = await Blog.findById(blogId);
    if (!findBlogUser) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found." });
    }
    if (userId === findBlogUser.author) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot save your own post." });
    }

    // Check if the post is already saved
    const isPostSaved = user.savedPosts.includes(blogId);

    if (isPostSaved) {
      // Remove post from savedPosts
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== blogId
      );
      await user.save();

      const deleteNotification = await Notification.findOneAndDelete({
        user: findBlogUser.author, // The user receiving the notification
        userId: user._id,
        post: findBlogUser._id, // Use findBlogUser instead of blog
        type: "save", // Type of notification
        message: `${user.name} has saved your post ${findBlogUser.title}`, // Specific message for the notification
      });

      if (deleteNotification) {
        deleteRealTimeNotification(findBlogUser.author, deleteNotification._id);
      }

      return res.status(200).json({
        success: true,
        message: "Post removed from saved posts.",
        savedPosts: user.savedPosts,
      });
    } else {
      const notification = new Notification({
        user: findBlogUser.author, // The user receiving the notification
        userId: user._id,
        post: findBlogUser._id, // Use findBlogUser instead of blog
        type: "save", // Type of notification
        message: `${user.name} has saved your post ${findBlogUser.title}`, // Specific message for the notification
      });

      await notification.save();

      const populatedNotification = await Notification.populate(notification, [
        { path: "userId", select: "name profileImg" },
        { path: "post", select: "title" },
      ]);

      // Emit real-time notification to the blog author
      sendRealTimeNotification(findBlogUser.author, populatedNotification);
      user.savedPosts.push(blogId);
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Post saved successfully.",
        savedPosts: user.savedPosts,
      });
    }
  } catch (error) {
    console.error("Error in toggleSavedPost:", error); // Log the error for debugging
    return res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
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

// Function to create or update social media links
const saveOrUpdateSocialMedia = async (req, res) => {
  try {
    const { facebook, twitter, instagram, linkedin } = req.body;
    const userId = req.user.userId;

    // Check if social media links already exist for the user
    let socialMedia = await SocialMedia.findOne({ userId });

    if (socialMedia) {
      // Update existing social media links
      socialMedia.facebook = facebook;
      socialMedia.twitter = twitter;
      socialMedia.instagram = instagram;
      socialMedia.linkedin = linkedin;
      await socialMedia.save();
    } else {
      // Create new social media links
      socialMedia = await SocialMedia.create({
        userId,
        facebook,
        twitter,
        instagram,
        linkedin,
      });
    }

    // Optionally, you can also update the user model with a reference to social media
    await User.findByIdAndUpdate(userId, { socialMedia: socialMedia._id });

    return res.status(200).json({
      success: true,
      message: "Social media links saved successfully",
      data: socialMedia,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const saveUserTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.theme = theme;
    await user.save();
    return res.status(200).json({ message: "Theme updated", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const saveUserLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    user.language = language;
    await user.save();
    return res.status(200).json({ message: "Language updated", success: true });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    userSchemaValidation
      .pick({ password: true })
      .parse({ password: req.body.newPassword });

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Incorrect password", success: true });

    user.password = newPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
        success: false,
      });
    }
    return res
      .status(500)
      .json({ message: "Server error", success: false, error: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("userid: ", userId);
    const { password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Verify the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ message: "Incorrect password", success: false });
    }

    // Log the user ID before deletion
    console.log(`About to delete user with ID: ${user._id}`);

    // Delete user images from Cloudinary
    if (user.profileImg) {
      const profilePublicId = user.profileImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(
        `blog_website/profile_images/${profilePublicId}`
      );
    }

    if (user.bannerImg) {
      const bannerPublicId = user.bannerImg.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(
        `blog_website/banner_images/${bannerPublicId}`
      );
    }

    // Get the user's blogs and comments before deletion
    const blogs = await Blog.find({ author: user._id });

    for (const blog of blogs) {
      if (blog.coverImagePublicId) {
        await cloudinary.uploader.destroy(blog.coverImagePublicId);
      }
    }

    const blogIds = blogs.map((blog) => blog._id);

    // Delete all comments associated with the user's blogs
    await Comment.deleteMany({ blog: { $in: blogIds } });

    await Blog.deleteMany({ author: user._id });

    // Delete any replies to those comments
    const comments = await Comment.find({ author: user._id });
    const replyIds = comments.flatMap((comment) => comment.replies);
    await Reply.deleteMany({ _id: { $in: replyIds } });

    // Delete all comments made by the user
    await Comment.deleteMany({ author: user._id });
    // Delete all notifications for this user
    await Notification.deleteMany({ user: user._id });

    // Delete social media accounts associated with this user
    await SocialMedia.deleteMany({ userId: user._id });

    // Finally, delete the user
    await User.deleteOne({ _id: userId });

    return res.status(200).json({
      message: "User and all associated data deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  register,
  verifyOtp,
  resendOtp,
  login,
  getUserData,
  getUserDataById,
  followUserById,
  unfollowUserById,
  fetchCurrentUserAllLikedPost,
  toggleSavedPost,
  getSavedPosts,
  updateUserProfileDetails,
  saveOrUpdateSocialMedia,
  saveUserTheme,
  saveUserLanguage,
  updateUserPassword,
  deleteUser,
};
