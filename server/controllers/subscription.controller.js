const Subscription = require("../models/subscription.model");

const userSubscriptionData = async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!name) {
    const emailExists = await Subscription.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "You have already subscribed" });
    }
  }

  try {
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      // Update the subscription with the new name if provided
      existingSubscription.name = name || existingSubscription.name;
      await existingSubscription.save();
      return res
        .status(200)
        .json({ message: "Subscription updated successfully!", success: true });
    }
    const newSubscription = new Subscription({ name, email });
    await newSubscription.save();

    res
      .status(201)
      .json({ message: "Subscription successful!", success: true });
  } catch (error) {
    console.log("Subscription error: ", error);
    res
      .status(500)
      .json({ message: "Error occurred while subscribing", success: false });
  }
};

module.exports = {
  userSubscriptionData,
};
