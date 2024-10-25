const express = require("express");
const { socialLogin } = require("../controllers/social.login.controller");
const router = express.Router();

router.route("/social-login").post(socialLogin);

module.exports = router;
