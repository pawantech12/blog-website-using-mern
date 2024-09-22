import React from "react";
import { Link } from "react-router-dom";
import blog1 from "../img/blog1.webp";
import { LuBookmarkMinus, LuCalendarDays } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRegHeart,
  FaTwitter,
} from "react-icons/fa";

const BlogDetails = () => {
  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> /{" "}
            <Link to="/blog-post/:blogId" className="text-orange-400">
              Blog Title
            </Link>
          </span>
        </div>
      </section>
      <section className="px-24 my-[5rem]">
        <div className="w-[68%]">
          <div>
            <figure className="w-full">
              <img src={blog1} className="rounded-xl w-full" alt="Blog Image" />
            </figure>
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <span className="bg-yellow-200 px-5 py-2 font-medium text-neutral-600 rounded-xl">
                  Food
                </span>
                <span className="text-zinc-500">By Hasan</span>
              </div>
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
            <div className="flex flex-col gap-3 mt-4">
              <h4 className="text-2xl text-custom-black font-semibold">
                Customize i WooCommerce theme-with-countless Video
              </h4>
              <p className=" text-gray-500 font-medium">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical literature from 459,
                making it over 2000 years old. Richard McClintock, a Latin
                professor at Virginia looked up one of the more obscure Latin
                words, consectetur, from a Lorem Ipsum passage, and going
                through the cites of the word in classical literature,
                discovered the undoubtable source. Lorem Ipsum comes from
                written in 45 BC. This book is a treatise on the theory.
              </p>
              <h4 className="text-2xl text-custom-black font-semibold">
                WooLentor is a powerful WordPress plugin for WooCommerce
              </h4>
              <p className=" text-gray-500 font-medium">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical literature from 459,
                making it over 2000 years old. Richard McClintock, a Latin
                professor at Virginia looked up one of the more obscure Latin
                words, consectetur, from a Lorem Ipsum passage, and going
                through the cites of the word in classical literature.
              </p>
              <div className="flex items-center gap-3 mt-3 self-end">
                <h4 className="font-semibold text-custom-black">Share on </h4>
                <ul className="flex items-center gap-3 text-sm ">
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
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </section>
    </>
  );
};

export default BlogDetails;
