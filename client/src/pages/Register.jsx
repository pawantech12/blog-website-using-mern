import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify"; // Import toast

import SignAuth from "../components/SignAuth";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const [apiError, setApiError] = useState(""); // for handling API error messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
        `${import.meta.env.VITE_SERVER_URL}/api/register`,
        data
      );
      const userId = response.data.userId; // Get userId from the response

      toast.success(
        "Registration successful! Please check your email for OTP."
      );

      setTimeout(() => {
        navigate("/verify-otp", { state: { userId } });
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Clear existing form errors
        setApiError("");

        // Map API errors to react-hook-form
        const apiErrors = error.response.data.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = { message: curr.message };
          return acc;
        }, {});

        // Set errors in the form
        Object.keys(apiErrors).forEach((key) => {
          setError(key, apiErrors[key]);
        });
      } else {
        toast.error(error.response.data.message || "An error occurred");
        console.log(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShow(!show);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirm(!showConfirm);
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
              placeholder="Full Name"
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
            <div className="flex gap-1 items-center">
              <input
                type={`${show ? "text" : "password"}`}
                id="password"
                {...register("password", { required: "Password is required" })}
                className=" w-full px-4 h-12 py-2 border border-custom-light-orange rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400 outline-none bg-[#F7F7F7] placeholder:text-sm placeholder:font-medium placeholder:text-custom-black/80"
                placeholder="Password"
              />
              <span
                className=" p-3 text-gray-700 cursor-pointer bg-white border border-gray-200 rounded-md"
                onClick={toggleShowPassword}
              >
                {show ? (
                  <IoEye className="w-5 h-5" />
                ) : (
                  <IoEyeOff className="w-5 h-5" />
                )}
              </span>
            </div>
            {errors.password && (
              <span className="text-[13px] mt-1 font-medium text-gray-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cpassword"
              className="block text-sm font-semibold text-custom-light-black"
            >
              Confirm Password
            </label>
            <div className="flex items-center gap-1">
              <input
                type={`${showConfirm ? "text" : "password"}`}
                id="cpassword"
                {...register("cpassword", {
                  required: "Confirm Password is required",
                })}
                className="w-full px-4 h-12 py-2 border border-custom-light-orange rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400 outline-none bg-[#F7F7F7] placeholder:text-sm placeholder:font-medium placeholder:text-custom-black/80"
                placeholder="Confirm Password"
              />
              <span
                className=" p-3 text-gray-700 cursor-pointer bg-white border border-gray-200 rounded-md"
                onClick={toggleShowConfirmPassword}
              >
                {showConfirm ? (
                  <IoEye className="w-5 h-5" />
                ) : (
                  <IoEyeOff className="w-5 h-5" />
                )}
              </span>
            </div>
            {errors.password && (
              <span className="text-[13px] mt-1 font-medium text-gray-500">
                {errors.password.message}
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
        <SignAuth />

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
