import React, { useState } from "react";
import Logo from "../img/logo.webp";
import { FiSearch } from "react-icons/fi";
import { LuUser2 } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
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
export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  console.log(user);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
                  className="w-14 h-14 rounded-full bg-gray-200 cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={
                      user?.profileImg ||
                      "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"
                    }
                    alt="User Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                {profileDropdownVisible && (
                  <ul className="absolute top-full right-0 py-4 z-10 px-3 text-sm mt-2 w-44 bg-white shadow-lg rounded-md">
                    <li className="hover:text-violet-400 py-2 transition-all ease-in-out duration-300">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 font-medium"
                      >
                        <RiDashboardHorizontalLine className="w-5 h-5 text-zinc-500" />
                        Dashboard
                      </Link>
                    </li>

                    <li className="hover:text-violet-400 py-2 transition-all ease-in-out duration-300">
                      <Link
                        to="/dashboard/post-list"
                        className="flex items-center gap-2 font-medium"
                      >
                        <FaRegUser className="w-5 h-5 text-zinc-500" />
                        Post List
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="hover:text-violet-400 flex items-center gap-2 font-medium py-2 transition-all ease-in-out duration-300 cursor-pointer"
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
          <div className="relative w-full max-w-2xl px-6">
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full p-4 text-lg rounded-md shadow-md outline-none border border-gray-300"
              autoFocus
            />
            <button
              onClick={handleSearchClick}
              className="absolute -top-10 right-0 text-3xl text-white"
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
