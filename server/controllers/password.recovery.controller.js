const crypto = require("crypto");
const sendEmail = require("../utils/send_email");
const User = require("../models/user.model");
const userSchemaValidation = require("../validations/user.validation.schema");
const { ZodError } = require("zod");
const forgotPassword = async (req, res) => {
  try {
    const { email, host } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Generate a secure random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token before saving to the database for security
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token and expiration (e.g., 1 hour)
    user.resetCode = hashedToken;
    user.resetCodeExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
    console.log("host", host);
    // Create the reset URL
    const resetUrl = `${req.protocol}://${host}/password-reset/${resetToken}`;

    // Send email with the reset link
    await sendEmail(
      user.email,
      "Password Reset Request",
      `You are receiving this email because you (or someone else) have requested to reset your password. Please click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`
    );

    res.status(200).json({
      message: "Password reset link sent to your email",
      success: true,
    });
  } catch (error) {
    console.log("error while forgot password: ", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

const resetPassword = async (req, res) => {
  try {
    userSchemaValidation
      .pick({ password: true })
      .parse({ password: req.body.newPassword });
    const { token, newPassword } = req.body;

    // Hash the token and compare with the stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user by the token and check if it has not expired
    const user = await User.findOne({
      resetCode: hashedToken,
      resetCodeExpires: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }

    // Set the new password
    user.password = newPassword;

    // Clear the reset code and expiration
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful", success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle Zod validation error
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
        success: false,
      });
    }
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports = { forgotPassword, resetPassword };
