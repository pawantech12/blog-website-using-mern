const express = require("express");
const {
  register,
  login,
  getUserData,
  getUserDataById,
} = require("../controllers/authentication.controller");
const {
  authenticateToken,
} = require("../middlewares/authenticateToken.middleware");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").get(authenticateToken, getUserData);
router.route("/user/:id").get(getUserDataById);

module.exports = router;
