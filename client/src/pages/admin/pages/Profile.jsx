import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRegHeart,
  FaTwitter,
} from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { LuBookmarkMinus, LuCalendarDays } from "react-icons/lu";
import { Link } from "react-router-dom";
import blog1 from "../../../img/blog1.webp";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("allPosts");

  return (
    <section className="my-[5rem]">
      <div className="relative">
        <img
          src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
          alt="banner img"
          className="w-full h-56 object-cover rounded-lg shadow-lg"
        />
        <img
          src="https://via.placeholder.com/150"
          alt="profile image"
          className="w-32 h-32 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-4 border-white"
        />
      </div>
      <div className="text-center mt-[5rem]">
        <h1 className="text-2xl font-bold text-custom-light-black">John Doe</h1>
        <span className="italic text-gray-500 font-medium">@johndoe</span>
        <p className="w-[70%] mx-auto text-custom-light-black font-medium mt-2">
          👨‍💻 Full Stack Developer | 🤖 Machine Learning Developer | 📝 Dev.to
          Content Writer and 🏷️ Tag Moderator ( 100K Views & 8K Followers)
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

      <div className=" mx-auto mt-6 bg-white  rounded-lg">
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
              {[1, 2, 3, 4].map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col cursor-pointer gap-3"
                  >
                    <div className="w-full">
                      <figure>
                        <img src={blog1} alt="" className="rounded-xl" />
                      </figure>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                          Food
                        </span>
                        <span className="text-zinc-500">By Hasan</span>
                      </div>
                      <h5 className="text-xl font-medium ">
                        <Link className="hover:text-orange-400 transition-all ease-in-out duration-200">
                          Customize your WooCommerce store with countless Web
                        </Link>
                      </h5>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="flex gap-1 items-center">
                            <LuCalendarDays />
                            15 June 2021
                          </span>{" "}
                          <GoDotFill className="w-2 h-2" />
                          <span>14 min read</span>
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
              })}
            </div>
          ) : (
            // Saved Posts Section
            <div className="grid grid-cols-3 gap-10 mt-8">
              {[1, 2, 3, 4].map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col cursor-pointer gap-3"
                  >
                    <div className="w-full">
                      <figure>
                        <img src={blog1} alt="" className="rounded-xl" />
                      </figure>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                          Food
                        </span>
                        <span className="text-zinc-500">By Hasan</span>
                      </div>
                      <h5 className="text-xl font-medium ">
                        <Link className="hover:text-orange-400 transition-all ease-in-out duration-200">
                          Customize your WooCommerce store with countless Web
                        </Link>
                      </h5>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="flex gap-1 items-center">
                            <LuCalendarDays />
                            15 June 2021
                          </span>{" "}
                          <GoDotFill className="w-2 h-2" />
                          <span>14 min read</span>
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
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
