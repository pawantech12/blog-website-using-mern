const express = require("express");
const {
  userSubscriptionData,
} = require("../controllers/subscription.controller");
const router = express.Router();

router.route("/subscribe").post(userSubscriptionData);

module.exports = router;
