import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../store/Authentication";
import { toast } from "react-toastify";
import SocialMediaSettings from "../components/SocialMediaSettings";
import ThemeSetting from "../components/ThemeSetting";
import LanguageSetting from "../components/LanguageSetting";
import UpdatePassword from "../components/UpdatePassword";
import DeactivateAccount from "../components/DeactivateAccount";

const Setting = () => {
  const {
    reset,
    formState: { errors },
    setError,
  } = useForm();
  const [activeTab, setActiveTab] = useState("socialMedia");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const [apiError, setApiError] = useState("");
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
  const onThemeSubmit = async (data) => {
    console.log("theme data: ", data);
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:3000/api/theme",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const onLanguageSubmit = async (data) => {
    console.log("language data: ", data);
    setLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:3000/api/language",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
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
            loading={loading}
          />
        );
      case "theme":
        return <ThemeSetting loading={loading} onThemeSubmit={onThemeSubmit} />;
      case "language":
        return (
          <LanguageSetting
            loading={loading}
            onLanguageSubmit={onLanguageSubmit}
          />
        );
      case "updatePassword":
        return (
          <UpdatePassword
            errors={errors}
            loading={loading}
            apiError={apiError}
          />
        );
      case "deleteAccount":
        return <DeactivateAccount />;

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
          <button
            className={`p-3 text-left rounded-md mb-2 transition-colors duration-300 text-base font-medium ${
              activeTab === "deleteAccount"
                ? "bg-custom-light-black text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("deleteAccount")}
          >
            Deactivate Account
          </button>
          {/* Add more options as needed */}
        </nav>
        <div className="w-3/4 p-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Setting;
