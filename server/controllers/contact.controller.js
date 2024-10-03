const Contact = require("../models/contact.model");
const contact = async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();
    return res.status(201).json({ message: "Contact saved successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to save contact", error });
  }
};

module.exports = {
  contact,
};
