import React from "react";
import { Link, useParams } from "react-router-dom";
import CategoryData from "../data/CategoryData";
import { LuBookmarkMinus, LuCalendarDays } from "react-icons/lu";
import blog1 from "../img/blog1.webp";
import { FaRegHeart } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";

const CategoryPosts = () => {
  const { categoryId } = useParams();
  const category = CategoryData.find((cat) => cat.id === parseInt(categoryId));
  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> / <Link to="/category">Category</Link> /{" "}
            <Link to={`/category/${categoryId}`} className="text-orange-400">
              {category.name}
            </Link>
          </span>
        </div>
      </section>
      <section className="flex justify-between px-24 my-[5rem]">
        <div className="grid grid-cols-2 gap-7 w-[65%]">
          {[1, 2, 3, 4].map((item, index) => {
            return (
              <div key={index} className="flex flex-col cursor-pointer gap-3">
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

        <div className="bg-[#FAFAFA] rounded-xl px-5 py-4 w-[30%]">
          <h4 className="text-2xl font-semibold text-neutral-800">
            Latest Post
          </h4>
          <div className="flex flex-col gap-4 mt-5">
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
      </section>
    </>
  );
};

export default CategoryPosts;
