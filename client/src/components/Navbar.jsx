import React from "react";
import Logo from "../img/logo.webp";
import { FiSearch } from "react-icons/fi";
import { LuUser2 } from "react-icons/lu";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
export const Navbar = () => {
  return (
    <>
      <header>
        <div className="py-10 px-20 flex items-center justify-between w-full border-b border-gray-200">
          <div>
            <figure>
              <img src={Logo} alt="Logo" />
            </figure>
          </div>
          <div className="flex items-center gap-5">
            <button className="bg-zinc-100 p-[0.6rem] hover:bg-orange-200 transition-all ease-in-out duration-200 text-2xl rounded-md">
              <FiSearch />
            </button>
            <button className="bg-zinc-100 p-[0.6rem] hover:bg-orange-200 transition-all ease-in-out duration-200 text-2xl rounded-md">
              <Link to="/register">
                <LuUser2 />
              </Link>
            </button>
          </div>
        </div>
        <div className="py-4 px-20 flex items-center justify-between w-full border-b border-gray-200">
          <ul className="flex items-center gap-3 text-sm">
            <li className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaFacebookF />
            </li>
            <li className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaTwitter />
            </li>
            <li className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaInstagram />
            </li>
            <li className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaLinkedinIn />
            </li>
          </ul>
          <nav>
            <ul className="flex gap-9 items-center">
              <li>
                <Link
                  className="text-lg font-medium text-neutral-600 hover:text-orange-300 transition-all ease-in-out duration-200"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  className="text-lg font-medium text-neutral-600 hover:text-orange-300 transition-all ease-in-out duration-200"
                  to="/about-us"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-lg font-medium text-neutral-600 hover:text-orange-300 transition-all ease-in-out duration-200"
                  to="/category"
                >
                  Category
                </Link>
              </li>
              <li>
                <Link
                  className="text-lg font-medium text-neutral-600 hover:text-orange-300 transition-all ease-in-out duration-200"
                  to="/contact-us"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};
