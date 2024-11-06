import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../store/Authentication";
import { useNavigate } from "react-router-dom";

function DeactivateAccount() {
  const [loading, setLoading] = useState(false);
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log("token from deactivating account: ", token);

  // Handle the account deactivation request

  const onSubmit = async (data) => {
    setLoading(true);
    const { password } = data;
    try {
      // Make the API call with Axios to deactivate the account
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/delete-account`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            password,
          },
        }
      );

      toast.success(response.data.message);

      // Log the user out
      logout();

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deactivating account"
      );
      console.error("Error deactivating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Deactivate Account
      </h2>
      <p className="text-custom-light-black  text-[15px] font-medium">
        The action will be permanent and cannot be undone! After deactivation,
        you will be logged out immediately. Your Blogs, Comments and all related
        data will be permanently deleted.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="my-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-custom-light-black"
          >
            Current Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "Password is required",
            })}
            className="mt-1 w-fit px-4 h-12 py-2 border border-custom-light-orange rounded-md shadow-sm focus:ring-orange-400 focus:border-orange-400 outline-none bg-[#F7F7F7] placeholder:text-sm placeholder:font-medium placeholder:text-custom-black/80"
            placeholder="Current Password"
          />
          {errors.password && (
            <span className="text-[13px] mt-1 font-medium text-gray-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-custom-light-black text-white px-6 py-2 rounded-md hover:bg-black transition-colors duration-300 mt-5 text-sm font-medium"
        >
          {loading ? "Deactivating..." : "Deactivate Account"}
        </button>
      </form>
    </div>
  );
}

export default DeactivateAccount;
