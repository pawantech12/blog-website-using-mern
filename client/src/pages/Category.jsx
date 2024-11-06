import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
// import CategoryData from "../data/CategoryData";
const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/get-categories`
        );
        console.log("Categories:", response);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24 max-sm:py-8">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> /{" "}
            <Link to="/category" className="text-orange-400">
              Category
            </Link>
          </span>
        </div>
      </section>
      <section className="my-[5rem] px-24 max-sm:px-5">
        <div className="flex gap-8 items-center justify-center flex-wrap">
          {categories.map((item, index) => {
            return (
              <div
                key={index}
                className="w-[250px] max-sm:w-full border border-gray-200 rounded-xl p-4 flex flex-col items-center"
              >
                <figure>
                  <img
                    src={item.imageUrl}
                    alt={`${item.name} Image`}
                    className="rounded-lg w-28 h-28 object-cover"
                  />
                </figure>
                <h4 className="font-semibold mt-2 text-lg text-custom-light-black">
                  {item.name}
                </h4>
                <span className="text-sm font-medium text-gray-600">
                  {item.blogPostCount} posts
                </span>
                <button className="bg-custom-light-orange rounded-md px-6 py-2 font-medium text-sm mt-2 hover:bg-custom-orange  transition-all ease-in-out duration-200">
                  <Link
                    to={`/category/${item._id}`}
                    state={{ categoryName: item.name }}
                  >
                    View Posts
                  </Link>
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
