import React, { useState } from "react";
import Logo from "../img/logo.webp";
import { FiSearch } from "react-icons/fi";
import { LuCalendarDays, LuLayoutList, LuUser2 } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRegUser,
  FaTwitter,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/Authentication";

import { RiDashboardHorizontalLine, RiLogoutBoxRLine } from "react-icons/ri";
import { useEffect } from "react";
import axios from "axios";
export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/blog/all-blogs"
        );
        console.log("search filtered blogs: ", response);
        if (response.data.success) {
          setBlogs(response.data.blogs);
          setFilteredBlogs(response.data.blogs); // Initialize filtered blogs
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchAllBlogs();
  }, [user]);
  useEffect(() => {
    // Filter blogs based on the search term
    const results = blogs.filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(results);
  }, [searchTerm, blogs]);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchTerm(""); // Clear the search term
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log("setBlogs", blogs);

  return (
    <>
      <header className="w-full border-b border-gray-200">
        {/* First Row: Logo and Icons */}
        <div className="py-6 md:py-10 px-4 md:px-20 flex items-center justify-between border-b border-gray-200">
          <div>
            <figure>
              <img src={Logo} alt="Logo" className="w-20 md:w-auto" />
            </figure>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={handleSearchClick}
              className="bg-zinc-100 p-[0.6rem] hover:bg-orange-200 transition-all ease-in-out duration-200 text-2xl rounded-md"
            >
              <FiSearch />
            </button>
            {token ? (
              <div className="relative">
                <div
                  onClick={toggleProfileDropdown}
                  className="w-12 h-12 rounded-full bg-gray-200 cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={
                      user?.user?.profileImg ||
                      "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                    }
                    alt="User Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {profileDropdownVisible && (
                  <ul className="absolute top-full right-0 py-4 z-10 px-3 text-sm mt-2 w-44 bg-white shadow-lg rounded-md">
                    <li className="hover:text-orange-400 py-2 transition-all ease-in-out duration-300">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 font-medium"
                      >
                        <RiDashboardHorizontalLine className="w-5 h-5 text-zinc-500" />
                        Dashboard
                      </Link>
                    </li>

                    <li className="hover:text-orange-400 py-2 transition-all ease-in-out duration-300">
                      <Link
                        to="/dashboard/post-list"
                        className="flex items-center gap-2 font-medium"
                      >
                        <LuLayoutList className="w-5 h-5 text-zinc-500" />
                        Post List
                      </Link>
                    </li>
                    <li className="hover:text-orange-400 py-2 transition-all ease-in-out duration-300">
                      <Link
                        to="/dashboard/category"
                        className="flex items-center gap-2 font-medium"
                      >
                        <BiCategory className="w-5 h-5 text-zinc-500" />
                        Category
                      </Link>
                    </li>
                    <li className="hover:text-orange-400 py-2 transition-all ease-in-out duration-300">
                      <Link
                        to="/dashboard/user-profile"
                        className="flex items-center gap-2 font-medium"
                      >
                        <FaRegUser className="w-5 h-5 text-zinc-500" />
                        Profile
                      </Link>
                    </li>

                    <li
                      onClick={handleLogout}
                      className="hover:text-orange-400 flex items-center gap-2 font-medium py-2 transition-all ease-in-out duration-300 cursor-pointer"
                    >
                      <RiLogoutBoxRLine className="w-5 h-5 text-zinc-500" />
                      Logout
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <button className="bg-zinc-100 p-[0.6rem] hover:bg-orange-200 transition-all ease-in-out duration-200 text-2xl rounded-md">
                <Link to="/register">
                  <LuUser2 />
                </Link>
              </button>
            )}
          </div>
        </div>

        {/* Second Row: Social Media Icons and Navigation */}
        <div className="py-4 px-4 md:px-20 flex flex-col md:flex-row items-center justify-between">
          <ul className="flex items-center gap-2 md:gap-3 text-sm order-2 md:order-1">
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
          <nav className="order-1 md:order-2 mt-4 md:mt-0">
            <ul className="flex gap-6 md:gap-9 items-center text-center">
              <li>
                <Link
                  className="text-sm md:text-lg font-medium text-neutral-600 hover:text-orange-300 transition-all ease-in-out duration-200"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm md:text-lg font-medium text-neutral-600 hover:text-orange-300 transition-all ease-in-out duration-200"
                  to="/about-us"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm md:text-lg font-medium text-neutral-600 hover:text-orange-300 transition-all ease-in-out duration-200"
                  to="/category"
                >
                  Category
                </Link>
              </li>
              <li>
                <Link
                  className="text-sm md:text-lg font-medium text-neutral-600 hover:text-orange-300 transition-all ease-in-out duration-200"
                  to="/contact-us"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Search Input Overlay */}
      {isSearchOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-all ease-in-out duration-300 ${
            isSearchOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-1/2">
            <div className="relative w-full px-6">
              <input
                type="text"
                placeholder="Search blogs..."
                className="w-full p-4 text-lg rounded-md shadow-md outline-none border border-gray-300"
                value={searchTerm}
                onChange={handleSearchChange} // Handle input change
                autoFocus
              />
              <button
                onClick={handleSearchClick}
                className="absolute -top-10 right-0 text-3xl text-white"
              >
                <IoClose />
              </button>
            </div>
            {/* Display filtered blogs */}
            <div className="mt-4 px-6 bg-white rounded-md py-4 space-y-3">
              {filteredBlogs.length > 0 ? (
                filteredBlogs.slice(0, 4).map((blog, index) => (
                  <div
                    key={index}
                    className="flex gap-5 border border-gray-200 p-3 rounded-lg ease-in-out duration-300"
                  >
                    <figure className="w-24 h-14 overflow-hidden rounded-lg">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                    <div className="flex flex-col justify-between">
                      <h5 className="text-base font-semibold text-gray-800 hover:text-orange-500 transition-colors ease-in-out duration-200">
                        <Link
                          to={`/blog-post/${blog._id}`}
                          onClick={handleSearchClick}
                        >
                          {blog.title.length > 40
                            ? blog.title.slice(0, 40) + "..."
                            : blog.title}
                        </Link>
                      </h5>
                      <span className="flex gap-2 text-xs text-gray-800 font-medium items-center">
                        <LuCalendarDays className="w-4 h-4 text-orange-500" />
                        {new Date(blog.publishedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No blogs found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
