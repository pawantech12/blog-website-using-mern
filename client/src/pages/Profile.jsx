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

const Profile = () => {
  const [activeTab, setActiveTab] = useState("allPosts");
  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);

  // Replace this with the actual user ID
  const { userId } = useParams(); // Example: "60d4b5fbc2bfb3e72e39f2ac"

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/${userId}`
        ); // Adjust the URL based on your API
        setUser(response.data.user);
        console.log("User details:", user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Fetch user's blogs
    const fetchUserBlogs = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/blog/user/${userId}/blogs`
        ); // Adjust the URL based on your API
        if (response.data.success) {
          setBlogs(response.data.blogs);
        }
      } catch (error) {
        console.error("Error fetching user's blogs:", error);
      }
    };

    fetchUserDetails();
    fetchUserBlogs();
  }, [userId]);

  return (
    <section className="my-[5rem] px-24">
      <div className="relative">
        <img
          src={
            user.bannerImg ||
            "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
          } // Use user's banner image
          alt="banner img"
          className="w-full h-56 object-cover rounded-lg shadow-lg"
        />
        <img
          src={user.profileImg || "https://via.placeholder.com/150"} // Use user's profile image
          alt="profile image"
          className="w-32 h-32 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white"
        />
      </div>
      <div className="text-center mt-[5rem]">
        <h1 className="text-2xl font-bold text-custom-light-black">
          {user.name || "John Doe"}
        </h1>
        <span className="italic text-gray-500 font-medium">
          @{user.username || "johndoe"}
        </span>
        <p className="w-[70%] mx-auto text-custom-light-black font-medium mt-2">
          {user.headline ||
            "👨‍💻 Full Stack Developer | 🤖 Machine Learning Developer | 📝 Dev.to Content Writer"}
        </p>
        <ul className="flex items-center gap-2 md:gap-3 text-sm order-2 md:order-1 mx-auto w-fit mt-4">
          <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
            <FaFacebookF />
          </li>
          <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
            <FaTwitter />
          </li>
          <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
            <FaInstagram />
          </li>
          <li className="bg-zinc-200 p-2 md:p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
            <FaLinkedinIn />
          </li>
        </ul>
        <button className="bg-custom-orange text-base font-medium px-6 py-2 rounded-lg mt-4">
          Follow
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
            <div className="grid grid-cols-3 gap-10 mt-8">
              {blogs.map((blog, index) => (
                <div key={index} className="flex flex-col cursor-pointer gap-3">
                  <div className="w-full">
                    <figure>
                      <img
                        src={blog.coverImage || blog1}
                        alt=""
                        className="rounded-xl"
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
                        By {user.name || "Author"}
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
                          {Math.ceil(blog.content.length / 200)} min read
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
            <div className="grid grid-cols-3 gap-10 mt-8">
              {/* Implement Saved Posts Display Here */}
              {user.savedPosts && user.savedPosts.length > 0 ? (
                user.savedPosts.map((blog, index) => {
                  <div
                    key={index}
                    className="flex flex-col cursor-pointer gap-3"
                  >
                    <div className="w-full">
                      <figure>
                        <img
                          src={blog.coverImage || blog1}
                          alt=""
                          className="rounded-xl"
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
                          By {user.name || "Author"}
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
                            {new Date(
                              blog.publishedDate
                            ).toLocaleDateString() || "Date"}
                          </span>{" "}
                          <GoDotFill className="w-2 h-2" />
                          <span>
                            {Math.ceil(blog.content.length / 200)} min read
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
                  </div>;
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
