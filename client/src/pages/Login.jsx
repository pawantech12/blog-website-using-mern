import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useAuth } from "../store/Authentication";
import { toast } from "react-toastify"; // Import toast
import SignAuth from "../components/SignAuth";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show, setShow] = useState(false);

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const onSubmit = async (data) => {
    console.log(data);
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/login`,
        data
      );
      console.log(response);

      console.log("Login successful:", response);

      storeTokenInLS(response.data.token);

      toast.success(response.data.message); // Display success toast

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.log("error", error);
      if (error.response && error.response.data.errors) {
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

  return (
    <div className="min-h-screen flex flex-col justify-center items-center my-8">
      {/* Card Container */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-lg w-full mx-4">
        <div className="flex flex-col gap-2 items-center">
          <h2 className="text-3xl font-semibold text-center text-custom-light-black">
            Welcome to Bunzo
          </h2>
          <p className="text-center text-gray-500 font-medium">
            Login to your account and start exploring blog posts
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
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

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-custom-light-black"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-custom-light-black/90 text-white py-3 rounded-md text-lg font-medium hover:bg-custom-black transition-all ease-in-out duration-200"
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-5">
          <span className="bg-gray-200 h-px flex-1"></span>
          <span className="px-4 text-neutral-900 font-medium">
            or Login with
          </span>
          <span className="bg-gray-200 h-px flex-1"></span>
        </div>

        {/* Social Sign Up Buttons */}
        <SignAuth />

        <p className="text-center mt-5 font-medium ">
          Don&apos;t Have an Account?{" "}
          <Link to="/register" className="text-orange-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
