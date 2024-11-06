import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../store/Authentication";
import { toast } from "react-toastify";
const UpdatePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();
  const [apiError, setApiError] = useState("");

  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const onUpdatePasswordSubmit = async (data) => {
    console.log("update password data: ", data);

    if (data.newPassword !== data.cnewPassword) {
      setApiError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/update-password`,
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      reset();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        // Clear existing form errors
        setApiError(error.response.data.message);

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
    <div>
      <h2 className="text-xl font-semibold mb-4">Update Password</h2>
      {apiError && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg font-medium text-center mt-2">
          <p>{apiError}</p>
        </div>
      )}
      {/* Form to update password */}
      <form
        className="space-y-4"
        onSubmit={handleSubmit(onUpdatePasswordSubmit)}
      >
        <div className="flex flex-col gap-1">
          <label className="font-medium">Current Password:</label>
          <input
            type="password"
            className="border border-gray-300 p-3 rounded-md outline-none text-sm"
            placeholder="Enter your current password"
            {...register("currentPassword", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">New Password:</label>
          <input
            type="password"
            className="border border-gray-300 p-3 rounded-md outline-none text-sm"
            placeholder="Enter your New password"
            {...register("newPassword", { required: true })}
          />
          {errors.password && (
            <span className="text-[13px] mt-1 font-medium text-gray-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Confirm New Password:</label>
          <input
            type="password"
            className="border border-gray-300 p-3 rounded-md outline-none text-sm"
            placeholder="Enter your Confirm New password"
            {...register("cnewPassword", { required: true })}
          />
          {errors.password && (
            <span className="text-[13px] mt-1 font-medium text-gray-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <button
          disabled={loading}
          type="submit"
          className="bg-custom-light-black text-white px-6 py-2 rounded-md hover:bg-black transition-colors duration-300 mt-3 text-sm font-medium"
        >
          {loading ? "Updating Password" : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
