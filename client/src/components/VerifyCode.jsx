import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/Authentication";

const VerifyCode = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const userId = state?.userId;
  console.log("userId from state: ", userId);
  const [loading, setLoading] = useState(false);
  const [otpResent, setOtpResent] = useState(false); // Track if OTP is resent

  // Verify OTP on form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/verify-otp",
        {
          userId,
          otp: data.otp,
        }
      );
      toast.success(response.data.message);
      setTimeout(() => {
        navigate(
          `${response.data.isVerified === true ? "/dashboard" : "/login"}`
        );
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP request
  const handleResendOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/resend-otp",
        { userId }
      );
      setOtpResent(true); // Track that OTP was resent
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-semibold text-center">
          Verify Your Account
        </h2>
        <p className="text-center text-gray-500 font-medium mt-2">
          Please enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            className={`w-full px-4 py-2 h-12 border rounded-md ${
              errors.otp ? "border-red-500" : ""
            } outline-none`}
            {...register("otp", {
              required: "OTP is required",
              pattern: {
                value: /^[0-9]{6}$/, // Validate 6-digit OTP
                message: "OTP must be 6 digits",
              },
            })}
          />
          {errors.otp && (
            <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-400 font-medium hover:bg-orange-500 text-white py-3 rounded-md"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>
            Didn&apos;t receive an OTP?
            <button
              onClick={handleResendOtp}
              className="text-blue-500 underline ml-1"
              disabled={otpResent}
            >
              Resend OTP
            </button>
          </p>
          {otpResent && (
            <p className="text-green-500 text-sm">OTP resent successfully!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
