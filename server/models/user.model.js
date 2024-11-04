const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  profileImg: { type: String },
  bannerImg: { type: String },
  password: { type: String, required: true },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
  otp: { type: String }, // Store OTP temporarily for verification
  isVerified: { type: Boolean, default: false },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  dob: { type: Date },
  gender: { type: String },
  age: { type: Number },
  headline: { type: String },
  summary: { type: String },
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog", // Reference to the Blog model
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // users that this user follows
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // users that follow this user
    },
  ],
  socialMedia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SocialMedia",
  },
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "light",
  },
  language: {
    type: String,
    default: "english",
  },
  recentlyViewed: [
    {
      blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
      lastViewedAt: { type: Date },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
};

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
