import React from "react";
import { Link } from "react-router-dom";
import CategoryData from "../data/CategoryData";
const Category = () => {
  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> /{" "}
            <Link to="/category" className="text-orange-400">
              Category
            </Link>
          </span>
        </div>
      </section>
      <section className="my-[5rem] px-24">
        <div className="flex gap-8 items-center justify-center flex-wrap">
          {CategoryData.map((item, index) => {
            return (
              <div
                key={index}
                className="w-[250px] border border-gray-200 rounded-xl p-4 flex flex-col items-center"
              >
                <figure>
                  <img
                    src={item.catImg}
                    alt={`${item.name} Image`}
                    className="rounded-lg"
                  />
                </figure>
                <h4 className="font-semibold mt-2 text-lg text-custom-light-black">
                  {item.name}
                </h4>
                <span className="text-sm font-medium text-gray-600">
                  15 posts
                </span>
                <button className="bg-custom-light-orange rounded-md px-6 py-2 font-medium text-sm mt-2 hover:bg-custom-orange  transition-all ease-in-out duration-200">
                  <Link to={`/category/${item.id}`}>View Posts</Link>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Category;
