import React from "react";
import { Link } from "react-router-dom";
import technology from "../img/technology.webp";
import travel from "../img/travel.webp";
import web from "../img/web.webp";
import blog from "../img/7.webp";
import hero1 from "../img/hero-01.webp";
import { GoDotFill } from "react-icons/go";
import { LuBookmarkMinus, LuCalendarDays } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
export const Home = () => {
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
    </>
  );
};
