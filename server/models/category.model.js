const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  imageUrl: { type: String, required: true },
  imageHash: {
    type: String, // This will store the etag (hash) of the image
  },
  publicId: {
    type: String, // Store the Cloudinary public_id for deletion purposes
  },
});

const Category = new mongoose.model("Category", categorySchema);

module.exports = Category;
