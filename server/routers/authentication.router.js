const express = require("express");
const {
  register,
  login,
  getUserData,
  getUserDataById,
  followUserById,
  unfollowUserById,
  fetchCurrentUserAllLikedPost,
  toggleSavedPost,
  getSavedPosts,
  updateUserProfileDetails,
  verifyOtp,
  resendOtp,
  saveOrUpdateSocialMedia,
} = require("../controllers/authentication.controller");
const {
  authenticateToken,
} = require("../middlewares/authenticateToken.middleware");
const upload = require("../config/multer");

const router = express.Router();

router.route("/register").post(register);
router.route("/verify-otp").post(verifyOtp);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(login);
router.route("/user").get(authenticateToken, getUserData);
router.route("/user/:id").get(getUserDataById);
router
  .route("/get-liked-posts")
  .get(authenticateToken, fetchCurrentUserAllLikedPost);
router.route("/follow/:id").put(authenticateToken, followUserById);
router.route("/unfollow/:id").put(authenticateToken, unfollowUserById);
router.route("/toggle-save/:blogId").put(authenticateToken, toggleSavedPost);
router.route("/get-saved-posts").get(authenticateToken, getSavedPosts);
router
  .route("/update-profile")
  .put(
    authenticateToken,
    upload.fields([{ name: "bannerImg" }, { name: "profileImg" }]),
    updateUserProfileDetails
  );

router.route("/social-media").post(authenticateToken, saveOrUpdateSocialMedia);

module.exports = router;
