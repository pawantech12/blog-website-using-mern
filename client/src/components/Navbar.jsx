import React, { useState } from "react";
import Logo from "../img/logo.webp";
import { FiSearch } from "react-icons/fi";
import { LuCalendarDays, LuLayoutList, LuUser2 } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { BsCheck2All } from "react-icons/bs";
import { io } from "socket.io-client";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRegBell,
  FaRegUser,
  FaTwitter,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/Authentication";

import { RiDashboardHorizontalLine, RiLogoutBoxRLine } from "react-icons/ri";
import { useEffect } from "react";
import defaultUserProfile from "../img/default-user.jpg";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [notificationDropdownVisible, setNotificationDropdownVisible] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Establish a connection to the server
    const socket = io(`${import.meta.env.VITE_SERVER_URL}`);

    // Join the room based on the user ID (replace `userId` with actual logged-in user ID)
    const userId = user?.user?._id; // Replace with your actual userId logic

    socket.emit("join_room", userId);

    // Listen for new notifications
    socket.on("new_notification", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
      setUnreadCount((prevUnreadCount) => prevUnreadCount + 1);
    });

    // Listen for the "remove_notification" event
    socket.on("remove_notification", ({ notificationId }) => {
      // Remove the specific notification from the state when the user unfollows someone
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );

      // Update the unread count
      setUnreadCount((prevUnreadCount) => prevUnreadCount - 1);
    });

    return () => {
      socket.disconnect(); // Cleanup on component unmount
    };
  }, [user, token]);
  // console.log("notifications: ", notifications);
  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/all-blogs`
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

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/get-notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(response.data);

        // console.log("notifications: ", response.data.notifications);
        setUnreadCount(response.data.filter((n) => !n.isRead).length);
      } catch (error) {
        console.log("error occured while fetching notifications: ", error);
      }
    };

    fetchAllBlogs();
    fetchNotifications();
  }, [user, token]);

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

  const toggleNotificationDropdown = () => {
    setNotificationDropdownVisible(!notificationDropdownVisible);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchTerm(""); // Clear the search term
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/mark-all-notifications-as-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the notifications in the frontend state to mark them as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          isRead: true, // Update the isRead field
        }))
      );

      // Optionally update unread count
      setUnreadCount(0); // Assuming you're tracking unread notifications
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  console.log("notifications", notifications);
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
              <FiSearch className="w-5 h-5" />
            </button>
            {token && user ? (
              <>
                <div className="relative">
                  <button
                    className="relative bg-zinc-100 p-[0.6rem] hover:bg-orange-200 transition-all ease-in-out duration-200 text-2xl rounded-md"
                    onClick={toggleNotificationDropdown}
                  >
                    <FaRegBell className="text-gray-600 w-5 h-5" />
                  </button>
                  {unreadCount > 0 && (
                    <span className="absolute top-[-4px] right-[-4px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                      {unreadCount}
                    </span>
                  )}
                  {notificationDropdownVisible && (
                    <div className="absolute top-full right-0 max-[450px]:-right-16 max-[450px]:top-12 py-4 z-10 text-sm mt-2 w-[340px] bg-white border border-gray-200 rounded-md">
                      <div className="flex justify-between items-center  px-3">
                        <h3 className="text-base font-semibold text-gray-700">
                          Notifications
                        </h3>
                        <button
                          className="bg-transparent text-emerald-500 font-semibold text-[13px] outline-none flex items-center gap-1"
                          onClick={handleMarkAllAsRead}
                        >
                          <BsCheck2All className="w-5 h-5" />
                          Mark All as Read
                        </button>
                      </div>
                      <hr className="mt-3" />
                      <ul>
                        {notifications.filter((n) => !n.isRead).length > 0 ? (
                          notifications
                            .filter((notification) => !notification.isRead)
                            .slice(0, 4)
                            .map((notification, index) => (
                              <li
                                key={index}
                                className="px-4 py-2 flex gap-2 items-center w-full"
                              >
                                <figure className="w-10 h-10">
                                  <img
                                    src={
                                      notification?.userId?.profileImg ||
                                      defaultUserProfile
                                    }
                                    alt={notification?.userId?.name}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                </figure>
                                <div className="w-full ">
                                  {notification.type === "comment" ? (
                                    <p className="text-[13px]">
                                      <span className="font-semibold">
                                        {notification?.userId?.name}
                                      </span>{" "}
                                      commented on your post{" "}
                                      <span className="font-semibold">
                                        {notification?.post?.title?.length > 20
                                          ? notification?.post?.title?.slice(
                                              0,
                                              20
                                            ) + "..."
                                          : notification?.post?.title}
                                      </span>
                                    </p>
                                  ) : notification.type === "like" ? (
                                    <p className="text-[13px]">
                                      <span className="font-semibold">
                                        {notification?.userId?.name}
                                      </span>{" "}
                                      liked your post{" "}
                                      <span className="font-semibold">
                                        {notification?.post?.title?.length > 20
                                          ? notification?.post?.title.slice(
                                              0,
                                              20
                                            ) + "..."
                                          : notification?.post?.title}
                                      </span>
                                    </p>
                                  ) : notification.type === "follow" ? (
                                    <p className="text-[13px]">
                                      <span className="font-semibold">
                                        {notification?.userId?.name}
                                      </span>{" "}
                                      started following you
                                    </p>
                                  ) : notification.type === "save" ? (
                                    <p className="text-[13px]">
                                      <span className="font-semibold">
                                        {notification?.userId?.name}
                                      </span>{" "}
                                      saved your post{" "}
                                      <span className="font-semibold">
                                        {notification?.post?.title?.length > 20
                                          ? notification?.post?.title?.slice(
                                              0,
                                              20
                                            ) + "..."
                                          : notification?.post?.title}
                                      </span>
                                    </p>
                                  ) : null}
                                  <span className="text-xs">
                                    {formatDistanceToNow(
                                      new Date(notification?.createdAt),
                                      {
                                        addSuffix: true,
                                      }
                                    )}
                                  </span>
                                </div>
                              </li>
                            ))
                        ) : (
                          <p className="text-center mt-3 text-gray-600">
                            No Notifications
                          </p>
                        )}
                      </ul>
                      <hr className="my-2" />
                      <div className="text-center">
                        <button className="w-full">
                          <Link
                            to={`/dashboard/notifications`}
                            className="font-medium"
                          >
                            View All
                          </Link>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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
              </>
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
        <div className="py-4 px-4 md:px-20 flex flex-col md:flex-row items-center justify-between ">
          <ul className="flex items-center gap-2 md:gap-3 text-sm order-2 md:order-1 max-md:mt-4">
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
          <div className="w-1/2 max-sm:w-full max-sm:px-4">
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
                    <figure className="w-[30%] h-20 overflow-hidden rounded-lg">
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </figure>
                    <div className="flex flex-col justify-between w-[70%]">
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
                      <p className="text-sm text-gray-700">
                        {blog.content.length > 60
                          ? blog.content.slice(0, 60) + "..."
                          : blog.content}
                      </p>
                      <span className="flex gap-2 text-xs text-gray-800 font-medium items-center mt-2">
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
