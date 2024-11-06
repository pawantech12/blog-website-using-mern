import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRegHeart,
  FaTwitter,
} from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { LuBookmarkMinus, LuCalendarDays } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../store/Authentication";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("allPosts");
  const [userDetails, setUserDetails] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);

  // Replace this with the actual user ID
  const { userId } = useParams(); // Example: "60d4b5fbc2bfb3e72e39f2ac"
  const { token, user } = useAuth();
  const currentUserId = user?.user._id;
  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/user/${userId}`
        ); // Adjust the URL based on your API
        setUserDetails(response.data.user);

        console.log("User details:", response);
        // Check if the current user is already following this user
        setIsFollowing(response.data.user.followers.includes(currentUserId));
        setSavedBlogs(response.data.user.savedPosts);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Fetch user's blogs
    const fetchUserBlogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/user/${userId}/blogs`
        ); // Adjust the URL based on your API
        if (response.data.success) {
          setBlogs(
            response.data.blogs.filter((blog) => blog.isDraft === false)
          );
        }
      } catch (error) {
        console.error("Error fetching user's blogs:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true); // Set loading to true before requests
      await Promise.all([fetchUserDetails(), fetchUserBlogs()]); // Wait for both requests
      setLoading(false); // Set loading to false after both requests are complete
    };

    fetchData();
  }, [userId, currentUserId, user]);

  // Function to handle follow/unfollow
  const handleFollow = async () => {
    if (user === null) {
      toast.error("Please login to follow a user");
      return;
    }

    setLocalLoading(true); // Set loading to true while the request is in progress
    try {
      const endpoint = isFollowing
        ? `${import.meta.env.VITE_SERVER_URL}/api/unfollow/${userId}`
        : `${import.meta.env.VITE_SERVER_URL}/api/follow/${userId}`;

      const response = await axios.put(
        endpoint,
        {}, // empty body
        { headers: { Authorization: `Bearer ${token}` } } // Ensure token is passed for authentication
      );

      if (response.data.success) {
        setIsFollowing(!isFollowing); // Toggle follow state
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLocalLoading(false); // End loading state
    }
  };
  console.log("saved posts: ", savedBlogs);
  if (loading) {
    return <Loader />;
  }
  return (
    <section className="my-[5rem] px-24 max-md:px-5">
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
          src={userDetails.profileImg || "https://via.placeholder.com/150"} // Use userDetails's profile image
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
        {userDetails.socialMedia && (
          <ul className="flex items-center gap-2 md:gap-3 text-sm order-2 md:order-1 mx-auto w-fit mt-6">
            {userDetails.socialMedia.facebook && (
              <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                <Link
                  to={userDetails.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF />
                </Link>
              </li>
            )}
            {userDetails.socialMedia.twitter && (
              <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                <Link
                  to={userDetails.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter />
                </Link>
              </li>
            )}
            {userDetails.socialMedia.instagram && (
              <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                <Link
                  to={userDetails.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </Link>
              </li>
            )}
            {userDetails.socialMedia.linkedin && (
              <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                <Link
                  to={userDetails.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedinIn />
                </Link>
              </li>
            )}
          </ul>
        )}
        <button
          disabled={loading}
          className={`bg-custom-orange text-base font-medium px-6 py-2 rounded-lg mt-4 ${
            isFollowing ? "bg-gray-400 text-white" : ""
          }`}
          onClick={handleFollow}
        >
          {localLoading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
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
                        to={`/blog-post/${blog._id}`}
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
                          <LuBookmarkMinus />
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
              {savedBlogs && savedBlogs.length > 0 ? (
                savedBlogs.map((blog, index) => {
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
                            {blog.category.name || "Uncategorized"}
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
                            <button>
                              <LuBookmarkMinus />
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

export default Profile;
