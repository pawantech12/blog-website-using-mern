import React, { useState } from "react";
import { Link } from "react-router-dom";
import technology from "../img/technology.webp";

import travel from "../img/travel.webp";
import web from "../img/web.webp";
import blog1 from "../img/blog1.webp";
import blog from "../img/7.webp";
import hero1 from "../img/hero-01.webp";
import { GoDotFill } from "react-icons/go";
import { LuBookmarkMinus, LuCalendarDays } from "react-icons/lu";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaRegHeart,
} from "react-icons/fa";
import { CgArrowLongLeft, CgArrowLongRight } from "react-icons/cg";
import BlogData from "../data/BlogData";
import { FiTwitter } from "react-icons/fi";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import CategoryData from "../data/CategoryData";
export const Home = () => {
  const [current, setCurrent] = useState(0);
  const [catcurrent, setCatCurrent] = useState(0);
  const itemsPerPage = 1;

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === Math.ceil(BlogData.length / itemsPerPage) - 1 ? 0 : prev + 1
    );
  };
  const nextCatSlide = () => {
    setCatCurrent((prev) =>
      prev === Math.ceil(CategoryData.length / itemsPerPage) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? Math.ceil(BlogData.length / itemsPerPage) - 1 : prev - 1
    );
  };
  const prevCatSlide = () => {
    setCatCurrent((prev) =>
      prev === 0 ? Math.ceil(CategoryData.length / itemsPerPage) - 1 : prev - 1
    );
  };
  return (
    <>
      <section className="p-16 bg-zinc-100 flex gap-12">
        <div className="flex gap-10">
          <div className="flex flex-col gap-4 justify-between">
            <figure>
              <Link>
                <img src={technology} alt="" className="rounded-xl" />
              </Link>
            </figure>
            <figure>
              <Link>
                <img src={travel} alt="" className="rounded-xl" />
              </Link>
            </figure>
            <figure>
              <Link>
                <img src={web} alt="" className="rounded-xl" />
              </Link>
            </figure>
            <figure>
              <Link>
                <img src={blog} alt="" className="rounded-xl" />
              </Link>
            </figure>
          </div>
          <div>
            <figure className="p-3 bg-white rounded-xl">
              <Link>
                <img src={hero1} alt="" className=" rounded-xl" />
              </Link>
            </figure>
          </div>
        </div>
        <div className="w-1/4 flex flex-col justify-around">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="bg-yellow-200 px-5 py-2 font-medium text-neutral-600 rounded-xl">
                Food
              </span>
              <span className="text-zinc-500">By Hasan</span>
            </div>
            <h3 className="text-2xl font-semibold">
              <Link>Make your store stand out from the others by...</Link>
            </h3>
            <p className="text-gray-500">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots…
            </p>
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
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="bg-yellow-200 px-5 py-2 font-medium text-neutral-600 rounded-xl">
                Food
              </span>
              <span className="text-zinc-500">By Hasan</span>
            </div>
            <h3 className="text-2xl font-semibold">
              <Link>Make your store stand out from the others by...</Link>
            </h3>
            <p className="text-gray-500">
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots…
            </p>
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
      </section>
      <section className="p-16">
        <h4 className="text-2xl font-semibold text-neutral-700">
          Trending Articles
        </h4>
        <div className="grid grid-cols-2 mt-8 gap-8 gap-x-12">
          <div className="flex gap-6">
            <div className="w-3/5">
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
          <div className="flex gap-6">
            <div className="w-3/5">
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
          <div className="flex gap-6">
            <div className="w-3/5">
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
          <div className="flex gap-6">
            <div className="w-3/5">
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
          <div className="flex gap-6">
            <div className="w-3/5">
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
          <div className="flex gap-6">
            <div className="w-3/5">
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
        </div>
      </section>
      <section className="px-16 py-20">
        <div className="border-t border-b border-gray-200 py-5 flex justify-between items-center">
          <h4 className="text-2xl font-medium text-neutral-700">
            From Following
          </h4>
          <div className="flex items-center gap-3">
            <button
              onClick={prevSlide}
              className="bg-[#F4F4F4] p-3 rounded-full text-zinc-600"
            >
              <CgArrowLongLeft />
            </button>
            <button
              onClick={nextSlide}
              className="bg-[#F4F4F4] p-3 rounded-full text-zinc-600"
            >
              <CgArrowLongRight />
            </button>
          </div>
        </div>
        <div className="w-full  mx-auto overflow-hidden mt-5">
          <div
            className="flex transition-transform w-full duration-500 ease-in-out gap-6"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {BlogData.map((blog, index) => (
              <div
                key={index}
                className="w-full flex flex-shrink-0 gap-7  px-7 py-8 box-border group transition-all ease-in-out duration-200"
                style={{ width: "98.33%" }}
              >
                <div className="grid grid-cols-2 gap-7 w-[70%]">
                  {[1, 2, 3, 4].map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex flex-col cursor-pointer gap-3"
                      >
                        <div className="w-full">
                          <figure>
                            <img
                              src={blog.blogImg}
                              alt=""
                              className="rounded-xl"
                            />
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
                              Customize your WooCommerce store with countless
                              Web
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
                <div className="w-[28%] flex flex-col justify-between gap-6">
                  <div className="border border-gray-200 rounded-xl px-8 py-8 flex flex-col items-center text-center">
                    <figure className="border border-gray-200  rounded-full p-2">
                      <img
                        src={blog.profileImg}
                        alt="profile Img"
                        className="rounded-full"
                      />
                    </figure>
                    <h4 className="text-lg mt-5 font-semibold text-neutral-800">
                      {blog.name}
                    </h4>
                    <span className="text-[15px] text-zinc-500">
                      WP Developer
                    </span>
                    <p className="text-zinc-600 mt-4 text-[15px]">
                      She is a lawyer, podcaster, speaker, and writer. As an
                      educational content director, he helps develop HasThemes
                      premium training products.
                    </p>
                    <ul className="flex items-center gap-2 mt-4">
                      <li>
                        <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                          <Link>
                            <FaFacebookF className="w-3 h-3" />
                          </Link>
                        </button>
                      </li>
                      <li>
                        <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                          <Link>
                            <FaInstagram />
                          </Link>
                        </button>
                      </li>
                      <li>
                        <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                          <Link>
                            <FiTwitter />
                          </Link>
                        </button>
                      </li>
                      <li>
                        <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                          <Link>
                            <FaLinkedin />
                          </Link>
                        </button>
                      </li>
                    </ul>
                    <button className="bg-zinc-100 w-3/4 flex justify-center py-3 rounded-md hover:bg-orange-300 hover:text-white mt-4">
                      <Link className="flex items-center gap-2">
                        View Profile <HiOutlineArrowNarrowRight />
                      </Link>
                    </button>
                  </div>
                  <div>
                    <figure>
                      <img
                        src="https://bunzo-react.pages.dev/static/e67d76024176298c373c4565aacb13ba/c04cd/home-following-banner.webp"
                        alt=""
                        className="w-full"
                      />
                    </figure>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="flex gap-2 px-20 py-20 bg-[#FAFAFA]">
        <div className="w-1/4">
          <h4 className="text-3xl font-semibold text-neutral-800">
            Trending Topic
          </h4>
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={prevCatSlide}
              className="bg-neutral-800 hover:bg-orange-300 transition-all ease-in-out duration-200 text-white p-2 rounded-md"
            >
              <CgArrowLongLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextCatSlide}
              className="bg-neutral-800 hover:bg-orange-300 transition-all ease-in-out duration-200 text-white p-2 rounded-md"
            >
              <CgArrowLongRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden w-[75%]">
          <div
            className="flex transition-transform w-full duration-500 ease-in-out gap-6 "
            style={{ transform: `translateX(-${(catcurrent * 95) / 5}%)` }}
          >
            {CategoryData.map((item, index) => (
              <div
                key={index}
                className=" w-[16.8%] flex-shrink-0  "
                // style={{ width: "" }}
              >
                <figure>
                  <img src={item.catImg} alt="" className="h-36 rounded-xl" />
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
