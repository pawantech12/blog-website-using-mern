import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { BsBookmarkCheckFill, BsBookmarkDash } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { LuCalendarDays } from "react-icons/lu";
import defaultProfileImg from "../../../img/default-user.jpg"; // Replace with a default profile image path
import { useAuth } from "../../../store/Authentication";
import axios from "axios";
import { GoDotFill } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../components/Loader";
import { IoSettingsOutline } from "react-icons/io5";

const UserProfile = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  if (!token && user === null) {
    navigate("/login");
  }
  // console.log("user ogged in:", user);
  const [activeTab, setActiveTab] = useState("allPosts");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Adjust the URL based on your API
        setUserDetails(response.data.user);

        console.log("User details:", response);

        setSavedBlogs(response.data.user.savedPosts);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    // Fetch user's blogs
    const fetchUserBlogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/get-blogs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Adjust the URL based on your API
        if (response.data.success) {
          setBlogs(response.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching user's blogs:", error);
      }
    };
    const initFetchSavedBlogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-saved-posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setSavedBlogs(response.data.savedPosts);
        }
        console.log("initial saved post: ", response);
      } catch (error) {
        console.log("error occurred while fetching saved post: ", error);
      }
    };
    const fetchData = async () => {
      setLoading(true); // Set loading to true before requests
      await Promise.all([
        fetchUserDetails(),
        fetchUserBlogs(),
        initFetchSavedBlogs(),
      ]); // Wait for both requests
      setLoading(false); // Set loading to false after both requests are complete
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <Loader />;
  }
  console.log("user details: ", userDetails);

  const handleSaveClick = async (postId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/toggle-save/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response while saving post: ", response);
      if (response.data.success) {
        setSavedBlogs(response.data.savedPosts); // Toggle the save state on success
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };
  console.log("saved blogs user profile: ", savedBlogs);

  return (
    <section className="my-[5rem] px-24 max-lg:px-5">
      <div className="relative">
        <img
          src={
            userDetails.bannerImg ||
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
          } // Use userDetails's banner image
          alt="banner img"
          className="w-full h-56 max-[500px]:h-40 object-cover rounded-lg shadow-lg"
        />
        <img
          src={userDetails.profileImg || defaultProfileImg} // Use userDetails's profile image
          alt="profile image"
          className="w-32 h-32 max-[500px]:w-28 max-[500px]:h-28 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white"
        />
      </div>
      <div className="text-center mt-[5rem]">
        <h1 className="text-2xl font-bold text-custom-light-black">
          {userDetails.name || "Name"}
        </h1>
        <span className="italic text-gray-500 font-medium">
          @{userDetails.username || "username"}
        </span>
        <p className="w-[70%] mx-auto text-custom-light-black font-medium mt-2">
          {userDetails.headline || "No Bio available."}
        </p>
        <div className="mx-auto flex items-center justify-center gap-8 my-4 max-[420px]:gap-4">
          <div className="flex flex-col items-center">
            <h4 className="text-xl font-semibold text-zinc-600">
              {blogs?.length}
            </h4>
            <span className="text-zinc-500 font-medium text-[15px]">Posts</span>
          </div>

          {/* Vertical line between Posts and Followers */}
          <div className="border-l-2 h-10 border-gray-300"></div>

          <div className="flex flex-col items-center">
            <h4 className="text-xl font-semibold text-zinc-600">
              {userDetails?.followers?.length || 0}
            </h4>
            <span className="text-zinc-500 font-medium text-[15px]">
              Followers
            </span>
          </div>

          {/* Vertical line between Followers and Following */}
          <div className="border-l-2 h-10 border-gray-300"></div>

          <div className="flex flex-col items-center">
            <h4 className="text-xl font-semibold text-zinc-600">
              {userDetails?.following?.length || 0}
            </h4>
            <span className="text-zinc-500 font-medium text-[15px]">
              Following
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <button className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md">
            <Link to={`/dashboard/edit-profile`}>Edit Profile</Link>
          </button>
          <button className="p-2 bg-gray-200 rounded-md group">
            <Link to={`/dashboard/settings`}>
              <IoSettingsOutline className="w-5 h-5 group-hover:rotate-180 transition-all ease-in-out duration-500" />
            </Link>
          </button>
        </div>

        {user?.user?.socialMedia && (
          <ul className="flex items-center gap-2 md:gap-3 text-sm order-2 md:order-1 mx-auto w-fit mt-6">
            {user.user.socialMedia.facebook && (
              <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                <Link
                  to={user.user.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF />
                </Link>
              </li>
            )}
            {user.user.socialMedia.twitter && (
              <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                <Link
                  to={user.user.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </Link>
              </li>
            )}
            {user.user.socialMedia.instagram && (
              <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                <Link
                  to={user.user.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </Link>
              </li>
            )}
            {user.user.socialMedia.linkedin && (
              <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                <Link
                  to={user.user.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn />
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
      <hr className="mt-8" />

      <div className="mx-auto mt-6 bg-white rounded-lg">
        {/* Tab Navigation */}
        <div className="flex">
          {/* All Posts Tab */}
          <button
            className={`w-1/2 rounded-s-md transition-all font-semibold ease-in-out duration-200 text-center py-3 cursor-pointer ${
              activeTab === "allPosts"
                ? "bg-custom-orange text-custom-light-black"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("allPosts")}
          >
            All Posts
          </button>

          {/* Saved Posts Tab */}
          <button
            className={`w-1/2 rounded-r-md transition-all ease-in-out duration-200 text-center py-3 cursor-pointer font-semibold ${
              activeTab === "savedPosts"
                ? "bg-custom-orange text-custom-light-black"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("savedPosts")}
          >
            Saved Posts
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {activeTab === "allPosts" ? (
            // All Posts Section
            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-10 mt-8">
              {blogs.map((blog, index) => (
                <div key={index} className="flex flex-col cursor-pointer gap-3">
                  <div className="w-full">
                    <figure className="w-full h-44">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="rounded-xl w-full h-full object-cover"
                      />{" "}
                      {/* Fallback to default image */}
                    </figure>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                        {blog.category.name || "Uncategorized"}
                      </span>
                      <span className="text-zinc-500">
                        By {userDetails.name || "Author"}
                      </span>
                    </div>
                    <h5 className="text-xl font-medium ">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="hover:text-orange-400 transition-all ease-in-out duration-200"
                      >
                        {blog.title}
                      </Link>
                    </h5>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex gap-1 items-center">
                          <LuCalendarDays />
                          {new Date(blog.publishedDate).toLocaleDateString() ||
                            "Date"}
                        </span>{" "}
                        <GoDotFill className="w-2 h-2" />
                        <span>
                          {Math.ceil(blog?.content.split(" ").length / 200)} min
                          read
                        </span>{" "}
                        {/* Approximate reading time */}
                      </div>
                      <div className="text-xl flex gap-2 items-center">
                        <button>
                          <BsBookmarkDash />
                        </button>
                        <button>
                          <FaRegHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Saved Posts Section
            <div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-10 mt-8">
              {/* Implement Saved Posts Display Here */}
              {savedBlogs && savedBlogs?.length > 0 ? (
                savedBlogs.map((blog, index) => {
                  const isSaved = savedBlogs.some(
                    (savedBlog) => savedBlog._id === blog._id
                  ); // Check if the blog is saved

                  return (
                    <div
                      key={index}
                      className="flex flex-col cursor-pointer gap-3"
                    >
                      <div className="w-full">
                        <figure className="w-full h-44">
                          <img
                            src={blog.coverImage}
                            alt={blog.title}
                            className="rounded-xl w-full h-full object-cover"
                          />{" "}
                          {/* Fallback to default image */}
                        </figure>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 justify-between">
                          <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                            {blog?.category.name || "Uncategorized"}
                          </span>
                          <span className="text-zinc-500 text-sm">
                            By {blog?.author.name || "Author"}
                          </span>
                        </div>
                        <h5 className="text-xl font-medium ">
                          <Link
                            to={`/blog-post/${blog._id}`}
                            className="hover:text-orange-400 transition-all ease-in-out duration-200"
                          >
                            {blog?.title}
                          </Link>
                        </h5>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="flex gap-1 items-center">
                              <LuCalendarDays />
                              {new Date(
                                blog?.publishedDate
                              ).toLocaleDateString() || "Date"}
                            </span>{" "}
                            <GoDotFill className="w-2 h-2" />
                            <span>
                              {Math.ceil(blog?.content.split(" ").length / 200)}{" "}
                              min read
                            </span>{" "}
                            {/* Approximate reading time */}
                          </div>
                          <div className="text-xl flex gap-2 items-center">
                            <button onClick={() => handleSaveClick(blog?._id)}>
                              {isSaved ? (
                                <BsBookmarkCheckFill />
                              ) : (
                                <BsBookmarkDash />
                              )}
                            </button>
                            <button>
                              <FaRegHeart />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No saved posts yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
