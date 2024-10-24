import React from "react";
import google from "../img/google.png";
import facebook from "../img/facebook.png";
import { toast } from "react-toastify";
const SignAuth = () => {
  const handleGoogleLogin = async () => {
    try {
      // Redirect to your backend route for Google authentication
      window.open("http://localhost:3000/api/auth/google", "_self");
    } catch (error) {
      toast.error("Google Login failed.");
      console.error(error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // Redirect to your backend route for Facebook authentication
      window.open("http://localhost:3000/api/auth/facebook", "_self");
    } catch (error) {
      toast.error("Facebook Login failed.");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center gap-4">
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
