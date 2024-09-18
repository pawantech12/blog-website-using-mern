import React from "react";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const Register = () => {
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
            Register to create your first account and start exploring blog posts
          </p>
        </div>

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
            className="w-full bg-custom-light-black/90 text-white py-3 rounded-md text-lg font-medium hover:bg-custom-black transition-all ease-in-out duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="bg-gray-200 h-px flex-1"></span>
          <span className="px-4 text-gray-500">or</span>
          <span className="bg-gray-200 h-px flex-1"></span>
        </div>

        {/* Social Sign Up Buttons */}
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
            <FaGoogle />
            Sign Up with Google
          </button>
          <button className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">
            <FaFacebookF />
            Sign Up with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
