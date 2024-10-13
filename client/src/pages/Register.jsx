import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import google from "../img/google.png";
import facebook from "../img/facebook.png";
import axios from "axios";
const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [apiError, setApiError] = useState(""); // for handling API error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    const { password, cpassword } = data;
    // Check if passwords match
    if (password !== cpassword) {
      setApiError("Passwords do not match!");
      return;
    }
    setIsSubmitting(true);
    setApiError(""); // Reset error message

    try {
      const response = await axios.post(
        `http://localhost:3000/api/register`,
        data
      );
      console.log(response);

      if (response.data.success) {
        console.log("Registration successful:", response);
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          navigate("/login");
          setSuccessMessage("");
        }, 3000);
        // Redirect or show success message
      } else {
        setApiError(response.data.message || "Failed to register");
      }
    } catch (error) {
      setApiError(error.response.data.message || "An error occurred");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center my-8">
      {/* Card Container */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-lg w-full mx-4">
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-3xl font-semibold text-center text-custom-light-black">
            Welcome to Bunzo
          </h2>
          <p className="text-center text-gray-500 font-medium">
            Register to create your first account and start exploring blog posts
          </p>
        </div>
        {apiError && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg font-medium text-center mt-2">
            <p>{apiError}</p>
          </div>
        )}
        {successMessage && (
          <div className="p-4 mb-4 text-sm text-emerald-500 bg-emerald-100 rounded-lg font-medium text-center mt-2">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {/* Name Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-custom-light-black"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name", { required: "Name is required" })}
              className="mt-1 w-full px-4 h-12 py-2 border border-custom-light-orange rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400 outline-none bg-[#F7F7F7] placeholder:text-sm placeholder:font-medium placeholder:text-custom-black/80"
              placeholder="Username"
            />
            {errors.name && (
              <span className="text-[13px] mt-1 font-medium text-gray-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-custom-light-black"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 w-full px-4 h-12 py-2 border border-custom-light-orange rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400 outline-none bg-[#F7F7F7] placeholder:text-sm placeholder:font-medium placeholder:text-custom-black/80"
              placeholder="Email Address"
            />
            {errors.email && (
              <span className="text-[13px] mt-1 font-medium text-gray-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-custom-light-black"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 w-full px-4 h-12 py-2 border border-custom-light-orange rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400 outline-none bg-[#F7F7F7] placeholder:text-sm placeholder:font-medium placeholder:text-custom-black/80"
              placeholder="Password"
            />
            {errors.password && (
              <span className="text-[13px] mt-1 font-medium text-gray-500">
                {errors.password.message}
              </span>
            )}
          </div>
          {/*Confirm Password Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-custom-light-black"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="cpassword"
              {...register("cpassword", {
                required: "Confirm Password is required",
              })}
              className="mt-1 w-full px-4 h-12 py-2 border border-custom-light-orange rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400 outline-none bg-[#F7F7F7] placeholder:text-sm placeholder:font-medium placeholder:text-custom-black/80"
              placeholder="Confirm Password"
            />
            {errors.cpassword && (
              <span className="text-[13px] mt-1 font-medium text-gray-500">
                {errors.cpassword.message}
              </span>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-custom-light-black/90 text-white py-3 rounded-md text-lg font-medium hover:bg-custom-black transition-all ease-in-out duration-200"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-5">
          <span className="bg-gray-200 h-px flex-1"></span>
          <span className="px-4 text-neutral-900 font-medium">
            or Register with
          </span>
          <span className="bg-gray-200 h-px flex-1"></span>
        </div>

        {/* Social Sign Up Buttons */}
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 bg-gray-100  py-3 px-4 rounded-md w-1/2 transition font-medium justify-center hover:bg-gray-200">
            <img src={google} alt="Google Logo" className="w-8" />
            Google
          </button>
          <button className="flex items-center gap-2 w-1/2  py-3 px-4 rounded-md bg-gray-100 transition font-medium justify-center hover:bg-gray-200">
            <img src={facebook} alt="Facebook Logo" className="w-8" />
            Facebook
          </button>
        </div>

        <p className="text-center mt-5 font-medium ">
          Already Have an Account?{" "}
          <Link to="/login" className="text-orange-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
