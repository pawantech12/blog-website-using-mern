import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../../store/Authentication";
import Loader from "../../../components/Loader";
import { FaChevronDown, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { token } = useAuth();
  const { register, handleSubmit, setValue, reset } = useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [bannerImgPreview, setBannerImgPreview] = useState("");
  const [profileImgPreview, setProfileImgPreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  useEffect(() => {
    setValue("name", userDetails.name);
    setValue("username", userDetails.username);
    setValue("summary", userDetails.summary);
    setValue("headline", userDetails.headline);
    setValue("city", userDetails.city);
    setValue("state", userDetails.state);
    setValue("country", userDetails.country);
    setValue("dob", userDetails.dob);
    setValue("gender", userDetails.gender);
    setValue("age", userDetails.age);
  }, [userDetails]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); // Adjust the URL based on your API
        setUserDetails(response.data.user);

        setBannerImgPreview(response.data.user.bannerImg);
        setProfileImgPreview(response.data.user.profileImg);

        console.log("User details:", response);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true); // Set loading to true before requests
      await Promise.all([fetchUserDetails()]); // Wait for both requests
      setLoading(false); // Set loading to false after both requests are complete
    };

    fetchData();
  }, [token]);
  // Handler for banner image change
  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for profile image change
  const handleProfileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("data: ", data);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("username", data.username);
      formData.append("summary", data.summary);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("country", data.country);
      formData.append("dob", data.dob);
      formData.append("gender", data.gender);
      formData.append("age", data.age);
      formData.append("headline", data.headline);

      // Append the banner image if it exists
      if (data.bannerImg && data.bannerImg.length > 0) {
        formData.append("bannerImg", data.bannerImg[0]);
      }

      // Append the profile image if it exists
      if (data.profileImg && data.profileImg.length > 0) {
        formData.append("profileImg", data.profileImg[0]);
      }

      // To log each key-value pair in FormData:
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Send request to update user details
      const response = await axios.put(
        `http://localhost:3000/api/update-profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for formData
          },
        }
      );

      console.log("Update successful:", response.data);
      setTimeout(() => {
        setSuccessMessage(response.data.message);
        navigate("/dashboard/user-profile");
      }, 3000);
      reset();
      // You can redirect or show a success message here
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("user details: ", userDetails);

  return (
    <section className="my-[5rem] px-24">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative">
          <img
            src={
              bannerImgPreview ||
              "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
            } // Use userDetails's banner image
            alt="banner img"
            className="w-full h-56 object-cover rounded-lg shadow-lg"
          />
          {!userDetails.bannerImg && (
            <label className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition duration-300 cursor-pointer">
              <FaEdit className="text-gray-700" />
              <input
                type="file"
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    // Store the file in the form data manually
                    setValue("bannerImg", event.target.files);
                    setBannerImgPreview(URL.createObjectURL(file)); // Preview image
                  }
                }}
                className="hidden"
              />
            </label>
          )}
          <img
            src={profileImgPreview || "https://via.placeholder.com/150"} // Use userDetails's profile image
            alt="profile image"
            className="w-32 h-32 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white"
          />
          {!userDetails.profileImg && (
            <label className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition duration-300 cursor-pointer">
              <FaEdit className="text-gray-700" />
              <input
                type="file"
                onChange={(event) => {
                  const file = event.target.files[0];
                  if (file) {
                    // Store the file in the form data manually
                    setValue("profileImg", event.target.files);
                    setProfileImgPreview(URL.createObjectURL(file)); // Preview image
                  }
                }}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div className="mt-[5rem] space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="name"
                className="text-base font-semibold text-neutral-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                {...register("name")}
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="name"
                className="text-base font-semibold text-neutral-700"
              >
                Username
              </label>
              <div className="flex items-center">
                <button
                  disabled
                  className="p-2 border-2 border-gray-300 rounded-md"
                >
                  @
                </button>
                <input
                  type="text"
                  id="username"
                  className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                  {...register("username")}
                  placeholder="Username"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor="headline"
              className="text-base font-semibold text-neutral-700"
            >
              Headline
            </label>
            <input
              type="text"
              id="headline"
              className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
              {...register("headline")}
              placeholder="Headline"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label
              htmlFor="summary"
              className="text-base font-semibold text-neutral-700"
            >
              Summary
            </label>
            <textarea
              id="summary"
              className="w-full border-2 border-gray-300 rounded-md p-2 outline-none resize-none"
              {...register("summary")}
              placeholder="Summary"
              rows={5}
              cols={30}
            ></textarea>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="city"
                className="text-base font-semibold text-neutral-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                {...register("city")}
                placeholder="City"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="state"
                className="text-base font-semibold text-neutral-700"
              >
                State
              </label>

              <input
                type="text"
                id="state"
                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                {...register("state")}
                placeholder="State"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="country"
                className="text-base font-semibold text-neutral-700"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                {...register("country")}
                placeholder="Country"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="dob"
                className="text-base font-semibold text-neutral-700"
              >
                Date of Birth
              </label>

              <input
                type="date"
                id="dob"
                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                {...register("dob")}
                placeholder="Date of Birth"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="gender"
                className="text-base font-semibold text-neutral-700"
              >
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  className="w-full border-2 border-gray-300 rounded-md p-2 outline-none appearance-none pr-10"
                  {...register("gender")}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute top-3 right-3 pointer-events-none">
                  <FaChevronDown className="text-gray-500" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label
                htmlFor="age"
                className="text-base font-semibold text-neutral-700"
              >
                Age
              </label>
              <input
                type="text"
                id="age"
                className="w-full border-2 border-gray-300 rounded-md p-2 outline-none"
                {...register("age")}
                placeholder="Age"
              />
            </div>
          </div>
        </div>
        <button
          disabled={loading}
          className="bg-orange-400 text-white px-4 py-2 rounded-md mt-7"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </section>
  );
};

export default EditProfile;
