import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import newsletter1 from "../img/1-newsletter.webp";
import ReactPlayer from "react-player/youtube";
import newsletter2 from "../img/2-newsletter.webp";

import { GoDotFill } from "react-icons/go";
import { LuCalendarDays } from "react-icons/lu";
import { BsBookmarkCheckFill } from "react-icons/bs";
import { BsBookmarkDash } from "react-icons/bs";

import {
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaLinkedin,
  FaRegHeart,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { CgArrowLongLeft, CgArrowLongRight } from "react-icons/cg";
import { FiTwitter } from "react-icons/fi";
import defaultProfileImage from "../img/default-user.jpg";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import CategoryData from "../data/CategoryData";
import axios from "axios";
import { useAuth } from "../store/Authentication";
import { useForm } from "react-hook-form";
import { likeBlog, unLikeBlog } from "../helper/like.handler";
import LatestPostSection from "../components/LatestPostSection";
import Loader from "../components/Loader";
export const Home = () => {
  const [current, setCurrent] = useState(0);
  const [catcurrent, setCatCurrent] = useState(0);
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [followingBlogs, setFollowingBlogs] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);
  const { token, user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likedBlogs, setLikedBlogs] = useState([]); // Array to track liked blogs
  const [savedPosts, setSavedPosts] = useState([]);

  const itemsPerPage = 1;
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Start loader before fetching data

      try {
        // Fetch non-authenticated data
        const [blogsResponse, categoriesResponse] = await Promise.all([
          axios.get("http://localhost:3000/blog/all-blogs"),
          axios.get("http://localhost:3000/blog/get-categories"),
        ]);

        // Handle blogs
        if (blogsResponse.data && blogsResponse.data.blogs) {
          console.log("Blogs fetched:", blogsResponse.data.blogs);
          setBlogs(blogsResponse.data.blogs);
        } else {
          console.warn("No blogs found");
          setBlogs([]); // Set to an empty array if no blogs
        }

        // Handle categories
        if (categoriesResponse.data && categoriesResponse.data.categories) {
          console.log(
            "Categories fetched:",
            categoriesResponse.data.categories
          );
          setCategories(categoriesResponse.data.categories);
        } else {
          console.warn("No categories found");
          setCategories([]); // Set to an empty array if no categories
        }

        // Now fetch authenticated data in parallel
        if (token) {
          const [
            followingBlogsResponse,
            likedBlogsResponse,
            savedPostsResponse,
          ] = await Promise.all([
            axios.get("http://localhost:3000/blog/following-blogs", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            axios.get("http://localhost:3000/api/get-liked-posts", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            axios.get("http://localhost:3000/api/get-saved-posts", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

          // Handle following blogs
          if (
            followingBlogsResponse.data.success &&
            followingBlogsResponse.data.blogs
          ) {
            console.log(
              "Following blogs fetched:",
              followingBlogsResponse.data.blogs
            );
            setFollowingBlogs(followingBlogsResponse.data.blogs);
            setFollowingUsers(followingBlogsResponse.data.followingUsers || []);
          } else {
            console.warn("No following blogs found");
            setFollowingBlogs([]);
            setFollowingUsers([]);
          }

          // Handle liked blogs (may be empty if no blogs have likes)
          if (likedBlogsResponse.data && likedBlogsResponse.data.blogs) {
            const likedBlogIds = likedBlogsResponse.data.blogs
              .filter(
                (blog) => blog.likes && blog.likes.includes(user?.user?._id)
              )
              .map((blog) => blog._id);
            console.log("Liked blogs IDs:", likedBlogIds);
            setLikedBlogs(likedBlogIds);
          } else {
            console.warn("No liked blogs found");
            setLikedBlogs([]); // Set to an empty array if no liked blogs
          }

          // Handle saved posts
          if (savedPostsResponse.data && savedPostsResponse.data.success) {
            const savedPostIds = savedPostsResponse.data.savedPosts.map(
              (post) => post._id
            );
            console.log("Saved post IDs:", savedPostIds);
            setSavedPosts(savedPostIds);
          } else {
            console.warn("No saved posts found");
            setSavedPosts([]); // Set to an empty array if no saved posts
          }
        } else {
          console.warn("No token available for authenticated requests");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loader after all requests are complete
      }
    };

    fetchAllData();
  }, [token, user]);

  // Filter blogs to get only featured ones
  const featuredBlogs = blogs.filter((blog) => blog.isFeatured);

  // Split featured blogs into two arrays for each column
  const firstColumnBlogs = featuredBlogs.slice(0, 2); // First two blogs for first column
  const secondColumnBlogs = featuredBlogs.slice(2, 5); // Next three blogs for second column
  const nextSlide = () => {
    setCurrent((prev) =>
      prev === Math.ceil(followingUsers.length / itemsPerPage) - 1
        ? 0
        : prev + 1
    );
  };
  const nextCatSlide = () => {
    setCatCurrent((prev) =>
      prev === Math.ceil(CategoryData.length / itemsPerPage) - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0
        ? Math.ceil(followingUsers.length / itemsPerPage) - 1
        : prev - 1
    );
  };
  const prevCatSlide = () => {
    setCatCurrent((prev) =>
      prev === 0 ? Math.ceil(CategoryData.length / itemsPerPage) - 1 : prev - 1
    );
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("user id:", user?.user._id);

  console.log("liked blogs", likedBlogs);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/subscribe",
        data
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        reset(); // Reset form on successful submission
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Like/Unlike handler
  const handleLikeClick = async (blogId) => {
    setLocalLoading(true);
    try {
      if (!user?.user?._id || !blogs) {
        return; // Exit early if user or blogs data isn't available
      }

      const isLiked = likedBlogs.includes(blogId); // Check if the blog is already liked

      // Optimistically update the UI
      const updatedBlogs = blogs.map((blog) =>
        blog._id === blogId
          ? {
              ...blog,
              likes: isLiked
                ? blog.likes.filter((id) => id !== user.user._id) // Remove like
                : [...blog.likes, user.user._id], // Add like
            }
          : blog
      );

      setBlogs(updatedBlogs); // Update blogs in state

      // Update the likedBlogs state
      const updatedLikedBlogs = isLiked
        ? likedBlogs.filter((id) => id !== blogId) // Remove blog ID from likedBlogs
        : [...likedBlogs, blogId]; // Add blog ID to likedBlogs

      setLikedBlogs(updatedLikedBlogs);

      // Make API call to update likes on the backend
      const response = isLiked
        ? await unLikeBlog(blogId)
        : await likeBlog(blogId);

      // Rollback on failure
      if (!response.success) {
        setLikedBlogs(
          isLiked ? [...updatedLikedBlogs, blogId] : updatedLikedBlogs
        ); // Rollback likedBlogs
        setBlogs(blogs); // Rollback blogs state
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    } finally {
      setLocalLoading(false);
    }
  };
  const handleSaveClick = async (postId) => {
    setLocalLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:3000/api/toggle-save/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response while saving post: ", response);
      if (response.data.success) {
        setSavedPosts(response.data.savedPosts); // Toggle the save state on success
      }
    } catch (error) {
      console.error("Error saving post:", error);
    } finally {
      setLocalLoading(false);
    }
  };
  console.log("setsavedposts: ", savedPosts);
  console.log("blogs", blogs);

  console.log("user details", user);
  console.log("liked", liked);
  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <section className="p-6 md:p-16 bg-zinc-100 flex flex-col md:flex-row gap-8 md:gap-12 w-full">
        {blogs.length > 0 ? (
          <>
            <div className="flex flex-col md:w-[78%] md:flex-row gap-6 md:gap-10">
              <div className="flex flex-row md:flex-col gap-4 justify-between w-[50%]">
                {/* Assuming you have some feature images */}
                {[0, 1, 2, 3].map((index) => (
                  <figure key={index}>
                    <Link to={`/blog-post/${blogs[index]?._id}`}>
                      <img
                        src={blogs[index]?.coverImage}
                        alt=""
                        className="rounded-xl object-cover"
                      />
                    </Link>
                  </figure>
                ))}
              </div>
              <div className="w-[50%] md:w-full h-full">
                <figure className="p-3 bg-white rounded-xl h-full">
                  <Link to={`/blog-post/${blogs[0]?._id}`} className="h-full">
                    <img
                      src={blogs[0]?.coverImage}
                      alt=""
                      className="rounded-xl w-full h-full object-cover"
                    />
                  </Link>
                </figure>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col justify-around gap-4">
              {blogs.slice(0, 2).map((blog) => (
                <div key={blog._id} className="flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span className="bg-yellow-200 px-5 py-2 font-medium text-neutral-600 rounded-xl">
                      {blog.category?.name || "Uncategorized"}
                    </span>
                    <span className="text-zinc-500">
                      By {blog.author?.name || "Unknown"}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold">
                    <Link to={`/blog-post/${blog._id}`}>
                      {blog.title.length > 60
                        ? blog.title.slice(0, 60) + "..."
                        : blog.title}
                    </Link>
                  </h3>
                  <div
                    className="text-gray-500"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        blog?.content?.slice(0, 100) + "..."
                      ),
                    }}
                  ></div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex gap-1 items-center">
                        <LuCalendarDays />
                        {new Date(blog.publishedDate).toLocaleDateString()}
                      </span>
                      <GoDotFill className="w-2 h-2" />
                      <span>
                        {Math.ceil(blog.content.split(" ").length / 200)} min
                        read
                      </span>
                    </div>
                    <div className="text-xl flex gap-2 items-center">
                      <button onClick={() => handleSaveClick(blog?._id)}>
                        {savedPosts.includes(blog?._id) ? (
                          <BsBookmarkCheckFill />
                        ) : (
                          <BsBookmarkDash />
                        )}
                      </button>
                      <button onClick={() => handleLikeClick(blog?._id)}>
                        {likedBlogs.includes(blog._id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                      <span>{blog.likes.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="mx-auto text-zinc-600">No posts found.</p>
        )}
      </section>

      <section className="p-4 md:p-16">
        <h4 className="text-2xl font-semibold text-neutral-700">
          Trending Articles
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-8">
          {blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <div key={index} className="flex gap-6">
                <div className="w-full h-40">
                  <figure className="w-full h-full">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="rounded-xl w-full h-full object-cover"
                    />
                  </figure>
                </div>
                <div className="flex flex-col gap-2 w-full justify-around">
                  <div className="flex items-center gap-3">
                    <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                      {blog?.category?.name}
                    </span>
                    <span className="text-zinc-500">
                      By {blog?.author?.name}
                    </span>
                  </div>
                  <h5 className="text-xl font-medium">
                    <Link
                      to={`/blog-post/${blog._id}`}
                      className="hover:text-orange-400 transition-all ease-in-out duration-200"
                    >
                      {blog?.title?.length > 60
                        ? blog?.title?.slice(0, 50) + "..."
                        : blog?.title}
                    </Link>
                  </h5>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex gap-1 items-center">
                        <LuCalendarDays />
                        {new Date(blog.publishedDate).toLocaleDateString()}
                      </span>
                      <GoDotFill className="w-2 h-2" />
                      <span>
                        {Math.ceil(blog.content.split(" ").length / 200)} min
                        read
                      </span>
                    </div>
                    <div className="text-xl flex gap-2 items-center">
                      <button onClick={() => handleSaveClick(blog?._id)}>
                        {savedPosts.includes(blog?._id) ? (
                          <BsBookmarkCheckFill />
                        ) : (
                          <BsBookmarkDash />
                        )}
                      </button>
                      <button onClick={() => handleLikeClick(blog?._id)}>
                        {likedBlogs.includes(blog._id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                      <span>{blog.likes.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs found</p>
          )}
        </div>
      </section>
      {followingUsers && followingUsers.length > 0 && (
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

          <div className="w-full mx-auto overflow-hidden mt-5">
            <div
              className="flex transition-transform w-full duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {followingUsers &&
                followingUsers.map((user, index) => (
                  <div
                    key={index}
                    className="w-full flex flex-shrink-0 gap-7 px-7 py-8 box-border group transition-all ease-in-out duration-200"
                    style={{ width: "98.33%" }}
                  >
                    <div className="grid grid-cols-2 gap-7 w-[70%]">
                      {followingBlogs
                        ?.filter((blog) => blog.author._id === user._id)
                        .map((blog, index) => (
                          <div
                            key={index}
                            className="flex flex-col cursor-pointer gap-3"
                          >
                            <div className="w-full h-48">
                              <figure className="w-full h-full">
                                <img
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  className="rounded-xl w-full h-full object-cover"
                                />
                              </figure>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                                  {blog.category.name}
                                </span>
                                <span className="text-zinc-500">
                                  {blog.author.name}
                                </span>
                              </div>
                              <h5 className="text-xl font-medium">
                                <Link
                                  to={`/blog-post/${blog._id}`}
                                  className="hover:text-orange-400 transition-all ease-in-out duration-200"
                                >
                                  {blog?.title?.length > 60
                                    ? blog?.title?.slice(0, 50) + "..."
                                    : blog?.title}
                                </Link>
                              </h5>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="flex gap-1 items-center">
                                    <LuCalendarDays />
                                    {new Date(
                                      blog.publishedDate
                                    ).toLocaleDateString()}
                                  </span>
                                  <GoDotFill className="w-2 h-2" />
                                  <span>
                                    {Math.ceil(
                                      blog.content.split(" ").length / 200
                                    )}{" "}
                                    min read
                                  </span>
                                </div>
                                <div className="text-xl flex gap-2 items-center">
                                  <button
                                    onClick={() => handleSaveClick(blog?._id)}
                                  >
                                    {savedPosts.includes(blog?._id) ? (
                                      <BsBookmarkCheckFill />
                                    ) : (
                                      <BsBookmarkDash />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleLikeClick(blog?._id)}
                                  >
                                    {likedBlogs.includes(blog._id) ? (
                                      <FaHeart className="text-red-500" />
                                    ) : (
                                      <FaRegHeart />
                                    )}
                                  </button>
                                  <span>{blog.likes.length}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="w-[28%] flex flex-col justify-between gap-6">
                      <div className="border border-gray-200 rounded-xl px-8 py-8 flex flex-col items-center text-center">
                        <figure className="border border-gray-200 rounded-full p-2">
                          <img
                            src={user.profileImg || defaultProfileImage}
                            alt="Profile"
                            className="rounded-full w-20 h-20 object-cover"
                          />
                        </figure>
                        <h4 className="text-lg mt-5 font-semibold text-neutral-800">
                          {user.name}
                        </h4>
                        <span className="text-[15px] text-zinc-500">
                          {user.headline}
                        </span>
                        <p className="text-zinc-600 mt-4 text-[15px]">
                          {user.summary}
                        </p>
                        <ul className="flex items-center gap-2 mt-4">
                          <li>
                            <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                              <FaFacebookF className="w-3 h-3" />
                            </button>
                          </li>
                          <li>
                            <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                              <FaInstagram />
                            </button>
                          </li>
                          <li>
                            <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                              <FiTwitter />
                            </button>
                          </li>
                          <li>
                            <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                              <FaLinkedin />
                            </button>
                          </li>
                        </ul>
                        <button className="bg-zinc-100 w-3/4 flex justify-center py-3 rounded-md hover:bg-orange-300 hover:text-white mt-4">
                          <Link
                            className="flex items-center gap-2"
                            to={`/user/profile/${user._id}`}
                          >
                            View Profile <HiOutlineArrowNarrowRight />
                          </Link>
                        </button>
                      </div>
                      <div>
                        <figure className="w-full h-64">
                          <img
                            src={
                              user.bannerImg ||
                              "https://bunzo-react.pages.dev/static/e67d76024176298c373c4565aacb13ba/c04cd/home-following-banner.webp"
                            }
                            alt={user.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </figure>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

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
            {categories.map((item, index) => (
              <div key={index} className="relative w-[16.8%] flex-shrink-0">
                <Link>
                  <figure className="relative">
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="h-36 w-full rounded-xl object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-transparent to-transparent rounded-xl"></div>
                    {/* Text overlay */}
                    <figcaption className="absolute bottom-[10%] left-0 right-0 text-white text-center p-2 font-semibold text-lg">
                      {item.name}
                    </figcaption>
                  </figure>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-20 py-20 bg-[#FAFAFA]">
        <div className="flex items-center gap-5 relative bg-white rounded-xl h-56 px-20">
          <h4 className="text-2xl font-semibold text-neutral-700 w-1/4">
            Subscribe For Newsletter
          </h4>
          <form onSubmit={handleSubmit(onSubmit)} className=" w-2/3">
            <div className="flex items-center gap-5">
              <input
                type="text"
                placeholder="Enter your email"
                {...register("email", { required: "Email is required" })}
                className="h-14 px-5 rounded-lg border outline-none border-gray-200 w-2/3"
              />
              <button
                type="submit"
                className="bg-orange-400 px-5 text-white hover:bg-orange-500 transition-all ease-in-out duration-200 py-[14px] font-medium text-[17px] rounded-lg"
              >
                Subscribe Now
              </button>
            </div>
            {success && <p className="text-green-500">{success}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </form>
          <img
            src={newsletter1}
            alt=""
            className="absolute bottom-0 left-[20%]"
          />
          <img
            src={newsletter2}
            alt=""
            className="absolute bottom-0 right-[2%]"
          />
        </div>
      </section>
      <section className="px-20 py-20">
        <h4 className="text-3xl font-semibold text-neutral-800">
          Featured Blogs
        </h4>
        <div className="flex gap-8 mt-7">
          <div className="w-[38%] flex flex-col gap-10">
            {firstColumnBlogs.map((item, index) => {
              return (
                <div key={index} className="flex flex-col cursor-pointer gap-3">
                  <div className="w-full">
                    <figure className="h-[300px]">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="rounded-xl h-[inherit] object-cover"
                      />
                    </figure>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-3">
                      <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                        {item.category.name}
                      </span>
                      <span className="flex gap-1 items-center">
                        <LuCalendarDays />
                        {new Date(item.publishedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <div className="text-xl flex gap-2 items-center">
                        <button onClick={() => handleSaveClick(item?._id)}>
                          {savedPosts.includes(item?._id) ? (
                            <BsBookmarkCheckFill />
                          ) : (
                            <BsBookmarkDash />
                          )}
                        </button>
                        <button onClick={() => handleLikeClick(item?._id)}>
                          {likedBlogs.includes(item._id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                        </button>
                        <span>{item.likes.length}</span>
                      </div>
                    </div>
                    <h5 className="text-2xl font-medium ">
                      <Link
                        to={`/blog-post/${item._id}`}
                        className="hover:text-orange-400 transition-all ease-in-out duration-200"
                      >
                        {item.title.length > 50
                          ? `${item.title.slice(0, 50)}...`
                          : item.title}
                      </Link>
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-[30%] grid grid-cols-1 grid-rows-3 gap-3">
            {secondColumnBlogs.map((item, index) => {
              return (
                <div key={index} className="flex flex-col cursor-pointer gap-3">
                  <div className="w-full">
                    <figure>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="rounded-xl object-cover h-40 w-full"
                      />
                    </figure>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-3">
                      <span className="bg-yellow-200 px-4 py-2 text-sm font-medium text-neutral-600 rounded-xl">
                        {item.category.name}
                      </span>
                      <span className="flex gap-1 items-center">
                        <LuCalendarDays />
                        {new Date(item.publishedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <div className="text-xl flex gap-2 items-center">
                        <button onClick={() => handleSaveClick(item?._id)}>
                          {savedPosts.includes(item?._id) ? (
                            <BsBookmarkCheckFill />
                          ) : (
                            <BsBookmarkDash />
                          )}
                        </button>
                        <button onClick={() => handleLikeClick(item?._id)}>
                          {likedBlogs.includes(item._id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart />
                          )}
                        </button>
                        <span>{item.likes.length}</span>
                      </div>
                    </div>
                    <h5 className="text-lg font-medium ">
                      <Link
                        to={`/blog-post/${item._id}`}
                        className="hover:text-orange-400 transition-all ease-in-out duration-200"
                      >
                        {item.title.length > 50
                          ? `${item.title.slice(0, 50)}...`
                          : item.title}
                      </Link>
                    </h5>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-[30%] flex flex-col gap-8">
            <LatestPostSection />
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
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative w-[70%] mx-auto">
              <button
                className="absolute -top-[10%] right-0 text-5xl text-white"
                onClick={closeModal} // Close modal on click
              >
                &times;
              </button>
              <ReactPlayer
                url="https://youtu.be/va0XcdDBGhI?si=eiymom8Fj68ti9Jf" // Replace with your video URL
                controls
                playing
                width="100%"
                height="500px"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
};
