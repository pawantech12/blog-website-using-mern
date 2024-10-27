const express = require("express");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/password.recovery.controller");
const limiter = require("../utils/rate_limit");
const router = express.Router();

router.route("/forgot-password").post(limiter, forgotPassword);
router.route("/reset-password").put(resetPassword);

module.exports = router;
