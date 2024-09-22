import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import google from "../img/google.png";
import facebook from "../img/facebook.png";
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
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

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-custom-light-black/90 text-white py-3 rounded-md text-lg font-medium hover:bg-custom-black transition-all ease-in-out duration-200"
          >
            Log In
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
