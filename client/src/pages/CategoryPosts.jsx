import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { LuBookmarkMinus, LuCalendarDays } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import LatestPostSection from "../components/LatestPostSection";
import Loader from "../components/Loader";

const CategoryPosts = () => {
  const { categoryId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { categoryName } = location.state || {};

  useEffect(() => {
    const fetchAllBlogsByCategory = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/blog/get-blogs-by-category/${categoryId}`
        );
        setBlogs(response.data.blogs);
        console.log("Blogs:", response);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBlogsByCategory();
  }, [categoryId]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24 max-lg:py-8">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> / <Link to="/category">Category</Link> /{" "}
            <Link to={`/category/${categoryId}`} className="text-orange-400">
              {categoryName}
            </Link>
          </span>
        </div>
      </section>
      <section className="flex justify-between px-24 my-[5rem] max-lg:flex-col max-lg:gap-12">
        <div className="grid grid-cols-2 gap-7 w-[65%] max-lg:w-full">
          {blogs.map((item, index) => {
            return (
              <div key={index} className="flex flex-col cursor-pointer gap-3">
                <div className="w-full h-48">
                  <figure className="w-full h-full">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="rounded-xl w-full h-full object-cover"
                    />
                  </figure>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                      {item.category.name}
                    </span>
                    <span className="text-zinc-500">
                      By {item?.author?.name}
                    </span>
                  </div>
                  <h5 className="text-xl font-medium ">
                    <Link
                      to={`/blog-post/${item._id}`}
                      className="hover:text-orange-400 transition-all ease-in-out duration-200"
                    >
                      {item.title.length > 60
                        ? item.title.slice(0, 60) + "..."
                        : item.title}
                    </Link>
                  </h5>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex gap-1 items-center">
                        <LuCalendarDays />
                        {new Date(item.publishedDate).toLocaleDateString()}
                      </span>{" "}
                      <GoDotFill className="w-2 h-2" />
                      <span>
                        {Math.ceil(item.content.split(" ").length / 200)} min
                        read
                      </span>
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

        <LatestPostSection width={30} />
      </section>
    </>
  );
};

export default CategoryPosts;
