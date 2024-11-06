import React from "react";
import google from "../img/google.png";
import facebook from "../img/facebook.png";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  FacebookAuthProvider,
} from "firebase/auth";
import { app } from "../config/firebase.config";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../store/Authentication";
import { useNavigate } from "react-router-dom";

const SignAuth = () => {
  const { storeTokenInLS } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(); // Firebase token
      console.log("result", result);

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        password: "@Password123",
        profileImg: result.user.photoURL,
        // username should be in lowercase and should contain 2 or more numbers at last of the name
        username:
          result.user.displayName.replace(/\s+/g, "").toLowerCase() +
          Math.floor(Math.random() * 1000),

        isVerified: result.user.emailVerified,
      };
      // Send token and user data to your backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/social-login`,
        {
          userData,
          token,
        }
      );

      // Redirect or perform additional actions
      toast.success(response.data.message);

      storeTokenInLS(response.data.token);

      const userId = response.data.userId;

      if (response.data.isVerified === false) {
        setTimeout(() => {
          navigate("/verify-otp", { state: { userId } });
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error("Google login error:", error);

      // Get error message from Firebase
      const errorMessage = error.message;

      // Show detailed error message
      toast.error(`Google login failed: ${errorMessage}`);
    }
  };
  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(); // Firebase token
      console.log("result", result);

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        password: "@Password123",
        profileImg: result.user.photoURL,
        // username should be in lowercase and should contain 2 or more numbers at last of the name
        username:
          result.user.displayName.replace(/\s+/g, "").toLowerCase() +
          Math.floor(Math.random() * 1000),

        isVerified: result.user.emailVerified,
      };
      // Send token and user data to your backend
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/social-login`,
        {
          userData,
          token,
        }
      );
      console.log("response: ", response);

      // Redirect or perform additional actions
      toast.success(response.data.message);

      storeTokenInLS(response.data.token);
      const userId = response.data.userId;

      if (response.data.isVerified === false) {
        setTimeout(() => {
          navigate("/verify-otp", { state: { userId } });
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      toast.error("Facebook login failed");
    }
  };

  return (
    <div className="flex justify-center gap-4 w-full">
      <button
        className="flex items-center gap-2 bg-gray-100 py-3 px-4 rounded-md w-1/2 transition font-medium justify-center hover:bg-gray-200"
        onClick={handleGoogleLogin}
      >
        <img src={google} alt="Google Logo" className="w-8" />
        Google
      </button>
      <button
        className="flex items-center gap-2 w-1/2 py-3 px-4 rounded-md bg-gray-100 transition font-medium justify-center hover:bg-gray-200"
        onClick={handleFacebookLogin}
      >
        <img src={facebook} alt="Facebook Logo" className="w-8" />
        Facebook
      </button>
    </div>
  );
};

export default SignAuth;
