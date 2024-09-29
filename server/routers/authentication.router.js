const express = require("express");
const {
  register,
  login,
  getUserData,
} = require("../controllers/authentication.controller");
const {
  authenticateToken,
} = require("../middlewares/authenticateToken.middleware");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").get(authenticateToken, getUserData);

module.exports = router;
