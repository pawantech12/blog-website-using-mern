import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Ensure you import useParams
import blog1 from "../img/blog1.webp";
import { LuBookmarkMinus, LuCalendarDays } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import {
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
  FaRegHeart,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { FiTwitter } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../store/Authentication";
import defaultUser from "../img/default-user.jpg";
import DOMPurify from "dompurify";

const BlogDetails = () => {
  const { blogId } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/blog/get-blog/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setBlog(response.data.blog);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog details:", error);
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [blogId, token]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  if (!blog) {
    return <div>No blog found</div>; // Handle case when blog is not found
  }

  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> / <Link to="/blog">Blog</Link> /{" "}
            <Link to={`/blog-post/${blogId}`} className="text-orange-400">
              {blog.title}
            </Link>
          </span>
        </div>
      </section>
      <section className="px-24 my-[5rem] flex gap-7">
        <div className="w-[68%]">
          <div>
            <figure className="w-full">
              <img
                src={blog.coverImage || blog1}
                className="rounded-xl w-full"
                alt="Blog Image"
              />
            </figure>
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <span className="bg-yellow-200 px-5 py-2 font-medium text-neutral-600 rounded-xl">
                  {blog.category.name}{" "}
                  {/* Assuming category has a name field */}
                </span>
                <span className="text-zinc-500">By {blog.author.name}</span>{" "}
                {/* Author name */}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex gap-1 items-center">
                  <LuCalendarDays />
                  {new Date(blog.publishedDate).toLocaleDateString()}{" "}
                  {/* Format date */}
                </span>
                <GoDotFill className="w-2 h-2" />
                <span>
                  {Math.ceil(blog.content.split(" ").length / 200)} min read
                </span>{" "}
                {/* Assuming readTime is a property */}
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
                {blog.title}
              </h4>
              <div
                className="text-zinc-500"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(blog?.content),
                }}
              ></div>
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
        <div className="w-[30%] flex flex-col gap-10">
          <div className="border border-gray-200 rounded-xl px-8 py-8 flex flex-col items-center text-center">
            <figure className="border border-gray-200 rounded-full p-2">
              <img
                src={blog.author.profileImage || defaultUser} // Assuming author has a profileImage field
                alt="profile Img"
                className="rounded-full w-24 h-24"
              />
            </figure>
            <h4 className="text-lg mt-5 font-semibold text-neutral-800">
              {blog.author.name} {/* Display author name */}
            </h4>
            <span className="text-[15px] text-zinc-500">
              {blog.author.title}
            </span>{" "}
            {/* Display author title */}
            <p className="text-zinc-600 mt-4 text-[15px]">
              {blog.author.bio} {/* Display author bio */}
            </p>
            <ul className="flex items-center gap-2 mt-4">
              <li>
                <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                  <Link to={blog.author.facebook}>
                    <FaFacebookF className="w-3 h-3" />
                  </Link>
                </button>
              </li>
              <li>
                <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                  <Link to={blog.author.instagram}>
                    <FaInstagram />
                  </Link>
                </button>
              </li>
              <li>
                <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                  <Link to={blog.author.twitter}>
                    <FiTwitter />
                  </Link>
                </button>
              </li>
              <li>
                <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                  <Link to={blog.author.linkedin}>
                    <FaLinkedin />
                  </Link>
                </button>
              </li>
            </ul>
            <button className="bg-zinc-100 w-3/4 flex justify-center py-3 rounded-md hover:bg-orange-300 hover:text-white mt-4">
              <Link
                className="flex items-center gap-2"
                to={`/user/profile/${blog.author._id}`}
              >
                View Profile <HiOutlineArrowNarrowRight />
              </Link>
            </button>
          </div>
          <div className="bg-[#FAFAFA] rounded-xl px-5 py-4">
            <h4 className="text-2xl font-semibold text-neutral-800">
              Latest Post
            </h4>
            <div className="flex flex-col gap-3 mt-5">
              {[1, 2, 3, 4, 5].map((item, index) => {
                return (
                  <div key={index} className="flex gap-3">
                    <figure className="w-[84px] h-[inherit]">
                      <img
                        src={blog1}
                        alt=""
                        className="w-full h-full object-cover rounded-md"
                      />
                    </figure>
                    <div className="w-3/5">
                      <h5 className="text-[15px] font-medium hover:text-orange-400 transition-all ease-in-out duration-200">
                        <Link>
                          Customize your WooCommerce store with countless Web
                        </Link>
                      </h5>
                      <span className="flex gap-1 text-xs text-zinc-600 font-medium items-center">
                        <LuCalendarDays className="w-4 h-4" />
                        15 June 2021
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-[#FAFAFA] rounded-xl px-5 py-4">
            <h4 className="text-2xl text-center font-semibold text-neutral-800">
              Stay In Touch
            </h4>
            <div className="grid grid-cols-3 gap-3 mt-8">
              <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all ease-in-out duration-200 cursor-pointer">
                <figure className="p-3 bg-[#4867AA] w-fit rounded-full text-white">
                  <FaFacebookF />
                </figure>
                <span className="text-sm">5,685k</span>
              </div>
              <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all ease-in-out duration-200 cursor-pointer">
                <figure className="p-3 bg-[#1DA1F2] w-fit rounded-full text-white">
                  <FaTwitter />
                </figure>
                <span className="text-sm">5,685k</span>
              </div>
              <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all ease-in-out duration-200 cursor-pointer">
                <figure className="p-3 bg-[#1869FF] w-fit rounded-full text-white">
                  <FaBehance />
                </figure>
                <span className="text-sm">5,685k</span>
              </div>
              <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all ease-in-out duration-200 cursor-pointer">
                <figure className="p-3 bg-[#FE0000] w-fit rounded-full text-white">
                  <FaYoutube />
                </figure>
                <span className="text-sm">5,685k</span>
              </div>
              <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all ease-in-out duration-200 cursor-pointer">
                <figure className="p-3 bg-[#EA4C8A] w-fit rounded-full text-white">
                  <FaDribbble />
                </figure>
                <span className="text-sm">5,685k</span>
              </div>
              <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all ease-in-out duration-200 cursor-pointer">
                <figure className="p-3 bg-[#007BB6] w-fit rounded-full text-white">
                  <FaLinkedin />
                </figure>
                <span className="text-sm">5,685k</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
