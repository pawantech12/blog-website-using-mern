import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom"; // Import useParams to get the token from URL

const ResetPassword = () => {
  const { token } = useParams(); // Get the reset token from the URL
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/password/reset-password`, // Use the token in the URL
        {
          token: token,
          newPassword: data.password,
        }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
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
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center text-custom-light-black">
          Reset Password
        </h2>
        <p className="text-center text-gray-500 font-medium">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-custom-light-black"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className="mt-1 w-full px-4 h-12 py-2 border border-custom-light-orange rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400 outline-none bg-[#F7F7F7] placeholder:text-sm placeholder:font-medium placeholder:text-custom-black/80"
              placeholder="New password"
            />
            {errors.password && (
              <p className="text-[13px] mt-1 font-medium text-gray-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-custom-light-black/90 text-white py-3 rounded-md text-lg font-medium hover:bg-custom-black transition-all ease-in-out duration-200"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-center mt-5 font-medium ">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
