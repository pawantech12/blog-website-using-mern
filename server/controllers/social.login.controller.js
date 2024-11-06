const admin = require("firebase-admin"); // Import Firebase Admin SDK

const User = require("../models/user.model");
const generateOTP = require("../utils/generate_otp");
const sendEmail = require("../utils/send_email");

admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Replace escaped newline characters
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
  }),
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

      if (user.isVerified === false) {
        const otp = generateOTP();
        user.otp = otp;
        await user.save();

        // Send OTP to the user's email
        await sendEmail(
          user.email,
          "Verify your account",
          `Your OTP for account verification is: ${otp}`
        );
      }

      return res.status(200).json({
        success: true,
        message: `User already exists ${
          user.isVerified === false ? "Please Verify Your Email" : ""
        }`,
        token: jwtToken,
        userId: user._id.toString(),
        isVerified: user.isVerified,
      });
    }

    const otp = generateOTP();

    const newUser = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profileImg: userData.profileImg,
      username: userData.username,
      isVerified: userData.isVerified,
      otp,
    });

    await newUser.save();

    if (newUser.isVerified === false) {
      // Send OTP to the user's email
      await sendEmail(
        newUser.email,
        "Verify your account",
        `Your OTP for account verification is: ${otp}`
      );
    }

    jwtToken = await newUser.generateToken();

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      token: jwtToken,
      userId: newUser._id.toString(),
      isVerified: newUser.isVerified,
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
