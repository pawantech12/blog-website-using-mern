import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoChevronDownOutline } from "react-icons/io5";
import { useAuth } from "../../../store/Authentication";
import { toast } from "react-toastify";
import SocialMediaSettings from "../components/SocialMediaSettings";

const Setting = () => {
  const {
    reset,
    formState: { errors },
    setError,
  } = useForm();
  const [activeTab, setActiveTab] = useState("socialMedia");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const onSocialMediaSubmit = async (data) => {
    console.log("social data: ", data);
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/social-media",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      reset(); // Reset the form after submission
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "socialMedia":
        return (
          <SocialMediaSettings
            onSocialMediaSubmit={onSocialMediaSubmit}
            errors={errors}
            loading={loading}
          />
        );
      case "theme":
        return <ThemeSettings />;
      case "language":
        return <LanguageSettings />;
      case "updatePassword":
        return <UpdatePassword />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold  mb-6 text-center text-gray-700">
        Settings
      </h1>
      <div className="flex bg-white rounded-md border border-gray-200">
        <nav className="flex flex-col w-1/4 border-r border-gray-300 p-4">
          <button
            className={`p-3 text-left rounded-md mb-2 transition-colors duration-300 text-base font-medium ${
              activeTab === "socialMedia"
                ? "bg-custom-light-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("socialMedia")}
          >
            Add Social Media Links
          </button>
          <button
            className={`p-3 text-left rounded-md mb-2 transition-colors duration-300 text-base font-medium ${
              activeTab === "theme"
                ? "bg-custom-light-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("theme")}
          >
            Theme
          </button>
          <button
            className={`p-3 text-left rounded-md mb-2 transition-colors duration-300 text-base font-medium ${
              activeTab === "language"
                ? "bg-custom-light-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("language")}
          >
            Language
          </button>
          <button
            className={`p-3 text-left rounded-md mb-2 transition-colors duration-300 text-base font-medium ${
              activeTab === "updatePassword"
                ? "bg-custom-light-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("updatePassword")}
          >
            Update Password
          </button>
          {/* Add more options as needed */}
        </nav>
        <div className="w-3/4 p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

// Placeholder components for each settings option

const ThemeSettings = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Select Theme</h2>
    {/* Dropdown or buttons to select theme */}
    <div className="relative w-fit">
      <select className="block appearance-none w-full border border-gray-300 bg-white text-gray-700 py-3 px-4 pr-10 rounded-md text-sm font-medium outline-none">
        <option value="" disabled>
          Select Theme
        </option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <div className="absolute inset-y-0 right-2 flex items-center px-2 pointer-events-none">
        <IoChevronDownOutline
          className="h-5 w-5 text-gray-600"
          aria-hidden="true"
        />
      </div>
    </div>
    <button className="bg-custom-light-black text-white px-6 py-2 rounded-md hover:bg-black transition-colors duration-300 mt-3 text-sm font-medium">
      Save Theme
    </button>
  </div>
);

const LanguageSettings = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Select Language</h2>
    {/* Dropdown or buttons to select theme */}
    <div className="relative w-fit">
      <select className="block appearance-none w-full border border-gray-300 bg-white text-gray-700 py-3 px-4 pr-10 rounded-md text-sm font-medium outline-none">
        <option value="" disabled>
          Select Language
        </option>
        <option value="english">English</option>
        <option value="spanish">Spanish</option>
      </select>
      <div className="absolute inset-y-0 right-2 flex items-center px-2 pointer-events-none">
        <IoChevronDownOutline
          className="h-5 w-5 text-gray-600"
          aria-hidden="true"
        />
      </div>
    </div>
    <button className="bg-custom-light-black text-white px-6 py-2 rounded-md hover:bg-black transition-colors duration-300 mt-3 text-sm font-medium">
      Save Language
    </button>
  </div>
);

const UpdatePassword = () => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Update Password</h2>
    {/* Form to update password */}
    <form className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="font-medium">Current Password:</label>
        <input
          type="password"
          className="border border-gray-300 p-3 rounded-md outline-none text-sm"
          placeholder="Enter your current password"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">New Password:</label>
        <input
          type="password"
          className="border border-gray-300 p-3 rounded-md outline-none text-sm"
          placeholder="Enter your New password"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-medium">Confirm New Password:</label>
        <input
          type="password"
          className="border border-gray-300 p-3 rounded-md outline-none text-sm"
          placeholder="Enter your Confirm New password"
        />
      </div>
      <button
        type="submit"
        className="bg-custom-light-black text-white px-6 py-2 rounded-md hover:bg-black transition-colors duration-300 mt-3 text-sm font-medium"
      >
        Update Password
      </button>
    </form>
  </div>
);

export default Setting;
