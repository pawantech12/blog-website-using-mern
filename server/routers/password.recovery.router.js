const rateLimit = require("express-rate-limit");
const express = require("express");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/password.recovery.controller");
const router = express.Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    message: "Too many requests, please try again later.",
    success: false,
  },
});

router.route("/forgot-password").post(limiter, forgotPassword);
router.route("/reset-password").put(resetPassword);

module.exports = router;
