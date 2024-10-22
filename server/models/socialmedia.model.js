const mongoose = require("mongoose");

const socialMediaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const SocialMedia = mongoose.model("SocialMedia", socialMediaSchema);
module.exports = SocialMedia;
