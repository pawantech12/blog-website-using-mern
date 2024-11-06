import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(false);
  const [resentOtpLoading, setResentOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30); // Initial cooldown in seconds

  // Verify OTP on form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/verify-otp`,
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
    setResentOtpLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/resend-otp`,
        { userId }
      );
      toast.success(response.data.message);
      setResendCooldown(30); // Reset cooldown
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResentOtpLoading(false);
    }
  };

  // Countdown for Resend OTP button
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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
              errors.otp ? "border-neutral-800" : ""
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
            <span className="text-[13px] mt-1 font-medium text-gray-500">
              {errors.otp.message}
            </span>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-custom-light-black/90 text-white py-3 rounded-md text-lg font-medium hover:bg-custom-black transition-all ease-in-out duration-200"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-center mt-5 font-medium">
            Didn&apos;t receive an OTP?
            <button
              onClick={handleResendOtp}
              disabled={resentOtpLoading || resendCooldown > 0}
              className="underline ms-1 underline-offset-4 hover:text-orange-400 transition-all ease-in-out duration-200"
            >
              {resentOtpLoading
                ? "Resending..."
                : resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : "Resend OTP"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;
