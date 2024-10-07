const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  imageUrl: { type: String, required: true },
});

const Category = new mongoose.model("Category", categorySchema);

module.exports = Category;
