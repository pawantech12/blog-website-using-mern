import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Ensure you import useParams
import blog1 from "../img/blog1.webp";
import { LuCalendarDays } from "react-icons/lu";
import { GoDotFill } from "react-icons/go";
import {
  FaBehance,
  FaDribbble,
  FaFacebookF,
  FaHeart,
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
import LatestPostSection from "../components/LatestPostSection";
import { likeBlog, unLikeBlog } from "../helper/like.handler";
import { BsBookmarkCheckFill, BsBookmarkDash } from "react-icons/bs";
import rehypePrettyCode from "rehype-pretty-code";

import Loader from "../components/Loader";
import { transformerCopyButton } from "@rehype-pretty/transformers";

import rehypeDocument from "rehype-document";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import CommentSection from "../components/CommentSection";
import { toast } from "react-toastify";

const BlogDetails = () => {
  const { blogId } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const [likedBlogs, setLikedBlogs] = useState([]); // Array to track liked blogs
  const [savedPosts, setSavedPosts] = useState([]);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/get-blog/${blogId}`,
          {
            withCredentials: true, // Ensure credentials are sent with the request
          }
        );
        setBlog(response.data.blog);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    const fetchLikedAndSavedPosts = async () => {
      if (!token) return; // Exit if there is no token

      try {
        const [likedResponse, savedResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/get-liked-posts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/get-saved-posts`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        console.log(
          "All liked Blogs of current logged-in user: ",
          likedResponse
        );

        if (user?.user?._id) {
          // If user data is available, check for liked blogs
          const likedBlogIds = likedResponse.data.blogs
            .filter((blog) => blog.likes.includes(user.user._id))
            .map((blog) => blog._id);
          setLikedBlogs(likedBlogIds); // Set the liked blog IDs
          console.log("Liked blogs on load:", likedBlogIds); // Debugging line
        }

        if (savedResponse.data.success) {
          setSavedPosts(savedResponse.data.savedPosts.map((post) => post._id));
        }
        console.log("Initial saved posts: ", savedResponse);
      } catch (error) {
        console.log(
          "Error occurred while fetching liked or saved posts: ",
          error
        );
      }
    };

    const fetchData = async () => {
      setLoading(true); // Set loading to true before starting the requests
      await Promise.all([fetchBlogDetails(), fetchLikedAndSavedPosts()]);
      setLoading(false); // Set loading to false after all requests are completed
    };

    fetchData();
  }, [blogId, token, user]);

  useEffect(() => {
    if (blog && blog.content) {
      const processContent = async () => {
        setLoading(true);
        try {
          const file = await unified()
            .use(remarkParse)
            .use(remarkRehype)
            .use(rehypeFormat)
            .use(rehypeStringify)
            .use(rehypePrettyCode, {
              theme: "one-dark-pro",
              transformers: [
                transformerCopyButton({
                  visibility: "always",
                  feedbackDuration: 3_000,
                }),
              ],
            });

          const htmlContent = (await file.process(blog.content)).toString();
          setHtmlContent(htmlContent);
        } catch (error) {
          console.error("Error processing content:", error);
        } finally {
          setLoading(false);
        }
      };

      processContent();
    }
  }, [blog]);

  // Like/Unlike handler
  const handleLikeClick = async (blogId) => {
    if (user === null) {
      toast.error("Please login to like a blog");
      return;
    }

    try {
      if (!user?.user?._id || !blog) {
        return; // Exit early if user or blogs data isn't available
      }

      const isLiked = likedBlogs.includes(blogId); // Check if the blog is already liked

      // Optimistically update the UI
      const updatedBlog =
        blog._id === blogId
          ? {
              ...blog,
              likes: isLiked
                ? blog.likes.filter((id) => id !== user.user._id) // Remove like
                : [...blog.likes, user.user._id], // Add like
            }
          : blog;

      setBlog(updatedBlog); // Update blogs in state

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
        setBlog(blog); // Rollback blogs state
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleSaveClick = async (postId) => {
    if (user === null) {
      toast.error("Please login to Save a blog");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/toggle-save/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response while saving post: ", response);
      setSavedPosts(response.data.savedPosts); // Toggle the save state on success
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const shareUrl = window.location.href; // The URL of the current blog post
  const title = blog?.title; // The title of the blog post

  // Custom share URLs for different platforms
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(title)}`,
    instagram: `https://instagram.com`, // Instagram doesn't allow direct URL sharing
  };

  // Web Share API handler (for mobile native sharing)
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          url: shareUrl,
        });
        console.log("Blog shared successfully");
      } catch (error) {
        console.error("Error sharing the blog:", error);
      }
    } else {
      console.error("Web Share API not supported.");
    }
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24 max-lg:py-8">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> / <Link to="/">Blog</Link> /{" "}
            <Link to={`/blog-post/${blogId}`} className="text-orange-400">
              {blog?.title}
            </Link>
          </span>
        </div>
      </section>
      <section className="px-24 my-[5rem] flex gap-7 max-lg:flex-col max-md:px-5">
        <div className="w-[68%] max-lg:w-full">
          <div>
            <figure className="w-full">
              <img
                src={blog?.coverImage || blog1}
                className="rounded-xl w-full"
                alt="Blog Image"
              />
            </figure>
            <div className="flex items-center justify-between mt-6 max-sm:flex-col max-sm:gap-3">
              <div className="flex items-center gap-3 max-sm:justify-between max-sm:w-full">
                <span className="bg-yellow-200 px-5 py-2 font-medium text-neutral-600 rounded-xl">
                  {blog?.category?.name}{" "}
                  {/* Assuming category has a name field */}
                </span>
                <span className="text-zinc-500">By {blog?.author?.name}</span>{" "}
                {/* Author name */}
              </div>
              <div className="flex items-center gap-3 justify-between max-sm:w-full">
                <div className="flex items-center gap-2 text-sm ">
                  <span className="flex gap-1 items-center">
                    <LuCalendarDays />
                    {new Date(blog?.publishedDate).toLocaleDateString()}{" "}
                    {/* Format date */}
                  </span>
                  <GoDotFill className="w-2 h-2" />
                  <span>
                    {Math.ceil(blog?.content.split(" ").length / 200)} min read
                  </span>{" "}
                </div>
                <div className="text-xl flex gap-2 items-center ">
                  <button onClick={() => handleSaveClick(blog?._id)}>
                    {savedPosts.includes(blog?._id) ? (
                      <BsBookmarkCheckFill />
                    ) : (
                      <BsBookmarkDash />
                    )}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleLikeClick(blog?._id)}>
                      {likedBlogs.includes(blog?._id) ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </button>
                    <span>{blog?.likes?.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <h4 className="text-2xl text-custom-black font-semibold">
                {blog?.title}
              </h4>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  className="prose"
                ></div>
              )}
              <div className="flex items-center  gap-3 mt-3 self-end">
                <h4 className="font-semibold text-custom-black">Share on </h4>
                <ul className="flex items-center gap-3 text-sm ">
                  {/* Facebook */}
                  <li
                    className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200"
                    onClick={() => window.open(shareUrls.facebook, "_blank")}
                  >
                    <FaFacebookF />
                  </li>
                  {/* Twitter */}
                  <li
                    className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200"
                    onClick={() => window.open(shareUrls.twitter, "_blank")}
                  >
                    <FaTwitter />
                  </li>
                  {/* Instagram - Note: Instagram doesn't support URL sharing */}
                  <li
                    className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200"
                    onClick={() =>
                      alert("Instagram does not support direct URL sharing.")
                    }
                  >
                    <FaInstagram />
                  </li>
                  {/* LinkedIn */}
                  <li
                    className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200"
                    onClick={() => window.open(shareUrls.linkedin, "_blank")}
                  >
                    <FaLinkedinIn />
                  </li>
                  <li>
                    {/* Web Share API Button (for native sharing on mobile) */}
                    <button
                      className=" bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200"
                      onClick={handleWebShare}
                    >
                      Share
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <CommentSection blogId={blogId} user={user} />
        </div>
        <div className="w-[30%] max-lg:w-full flex flex-col gap-10">
          <div className="border border-gray-200 rounded-xl px-8 py-8 flex flex-col items-center text-center">
            <figure className="border border-gray-200 rounded-full p-2">
              <img
                src={blog?.author?.profileImg || defaultUser} // Assuming author has a profileImage field
                alt="profile Img"
                className="rounded-full w-24 h-24"
              />
            </figure>
            <h4 className="text-lg mt-5 font-semibold text-neutral-800">
              {blog?.author?.name} {/* Display author name */}
            </h4>
            <span className="text-[15px] text-zinc-500">
              {blog?.author?.headline}
            </span>{" "}
            {/* Display author title */}
            <p className="text-zinc-600 mt-4 text-[15px]">
              {blog?.author?.summary} {/* Display author bio */}
            </p>
            <ul className="flex items-center gap-2 mt-4">
              {blog?.author?.socialMedia?.facebook && (
                <li>
                  <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                    <Link to={blog?.author?.socialMedia?.facebook}>
                      <FaFacebookF className="w-3 h-3" />
                    </Link>
                  </button>
                </li>
              )}
              {blog?.author?.socialMedia?.instagram && (
                <li>
                  <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                    <Link to={blog?.author?.socialMedia?.instagram}>
                      <FaInstagram />
                    </Link>
                  </button>
                </li>
              )}
              {blog?.author?.socialMedia?.twitter && (
                <li>
                  <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                    <Link to={blog?.author?.socialMedia?.twitter}>
                      <FiTwitter />
                    </Link>
                  </button>
                </li>
              )}
              {blog?.author?.socialMedia?.linkedin && (
                <li>
                  <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                    <Link to={blog?.author?.socialMedia?.linkedin}>
                      <FaLinkedin />
                    </Link>
                  </button>
                </li>
              )}
            </ul>
            <button className="bg-zinc-100 w-3/4 flex justify-center py-3 rounded-md hover:bg-orange-300 hover:text-white mt-4">
              <Link
                className="flex items-center gap-2"
                to={`/user/profile/${blog?.author?._id}`}
              >
                View Profile <HiOutlineArrowNarrowRight />
              </Link>
            </button>
          </div>
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
      </section>
    </>
  );
};

export default BlogDetails;
