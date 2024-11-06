import axios from "axios";
import React, { useEffect, useState } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { Link } from "react-router-dom";

const LatestPostSection = ({ width }) => {
  const [latestPost, setLatestPost] = useState([]);
  useEffect(() => {
    const fetchLatestPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/all-blogs`
        );
        setLatestPost(response.data.blogs.slice(0, 5));
      } catch (error) {
        console.error("Error fetching latest post:", error);
      }
    };
    fetchLatestPost();
  }, []);
  return (
    <div
      className={`bg-[#FAFAFA] rounded-xl px-5 py-4 ${
        width ? `w-[${width}%]` : "w-full"
      } h-fit max-lg:w-full`}
    >
      <h4 className="text-2xl font-semibold text-neutral-800">Latest Post</h4>
      <div className="flex flex-col gap-4 mt-5">
        {latestPost.length > 0 ? (
          latestPost.map((blog, index) => {
            return (
              <div key={index} className="flex  gap-3">
                <figure className="w-36 h-20">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </figure>
                <div className="w-3/5">
                  <h5 className="text-[15px] font-medium hover:text-orange-400 transition-all ease-in-out duration-200">
                    <Link to={`/blog-post/${blog._id}`}>
                      {blog.title.length > 30
                        ? blog.title.slice(0, 30) + "..."
                        : blog.title}
                    </Link>
                  </h5>
                  <span className="flex gap-1 text-xs text-zinc-600 font-medium items-center">
                    <LuCalendarDays className="w-4 h-4" />
                    {new Date(blog.publishedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-zinc-600">No latest post found.</p>
        )}
      </div>
    </div>
  );
};

export default LatestPostSection;
