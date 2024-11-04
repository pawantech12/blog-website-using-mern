const Subscription = require("../models/subscription.model");

const userSubscriptionData = async (req, res) => {
  const { name, email } = req.body;

  try {
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }
    const emailExists = await Subscription.findOne({ email });

    if (!name && emailExists) {
      return res
        .status(400)
        .json({ message: "You have already subscribed", success: false });
    }

    if (emailExists) {
      // if user had already filled name and email then we will return a message indicating that user had already subscribed
      if (emailExists.name !== "" && emailExists.email !== "") {
        return res
          .status(400)
          .json({ message: "You have already subscribed", success: false });
      }

      // Update the subscription with the new name if provided
      emailExists.name = name || emailExists.name;
      await emailExists.save();
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
