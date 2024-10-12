const User = require("../models/user.model");

const register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;

    // checking whether the email is already exist or not
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exist" });
    }

    // If user not exist then it will create new user
    const userCreated = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      msg: "Registration Successfull",
      token: await userCreated.generateToken(),
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
      return res.status(400).json({ message: "invalid credentials" });
    }

    // const user = await bcrypt.compare(password,userExist.password);
    const user = await userExist.comparePassword(password);
    if (user) {
      res.status(200).json({
        msg: "Login Successfull",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid Email or password" });
    }
  } catch (error) {
    res.status(500).json("Internal Server Error");
    console.error(error);
  }
};

const getUserData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
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
    const user = await User.findById(userId).populate("savedPosts");
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

module.exports = {
  register,
  login,
  getUserData,
  getUserDataById,
  followUserById,
  unfollowUserById,
};
