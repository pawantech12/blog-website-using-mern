const admin = require("firebase-admin"); // Import Firebase Admin SDK

// Initialize Firebase Admin
const serviceAccount = require("../config/firebaseAdmin/bunzo-blog-website-firebase-admin.json");
const User = require("../models/user.model");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const socialLogin = async (req, res) => {
  try {
    const { userData, token } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("decoded token: ", token);

    const { email } = decodedToken;

    const user = await User.findOne({ email });
    let jwtToken;
    if (user) {
      jwtToken = await user.generateToken();

      return res.status(200).json({
        success: true,
        message: "User already exists",
        token: jwtToken,
        userId: user._id.toString(),
      });
    }

    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profileImg: userData.profileImg,
      username: userData.username,
      isVerified: userData.isVerified,
    });

    await newUser.save();

    jwtToken = await newUser.generateToken();
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token: jwtToken,
      userId: newUser._id.toString(),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  socialLogin,
};
