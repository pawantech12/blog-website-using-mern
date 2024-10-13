const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "", // optional
  },
  email: {
    type: String,
    required: true,
    unique: true, // ensures that each email can only subscribe once
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = Subscription;
