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
import DOMPurify from "dompurify";
import LatestPostSection from "../components/LatestPostSection";
import { likeBlog, unLikeBlog } from "../helper/like.handler";
import { BsBookmarkCheckFill, BsBookmarkDash } from "react-icons/bs";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import parse, { domToReact } from "html-react-parser";
import Loader from "../components/Loader";

const BlogDetails = () => {
  const { blogId } = useParams(); // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();
  const [likedBlogs, setLikedBlogs] = useState([]); // Array to track liked blogs
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/blog/get-blog/${blogId}`
        );
        setBlog(response.data.blog);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedAndSavedPosts = async () => {
      if (!token) return; // Exit if there is no token

      try {
        const [likedResponse, savedResponse] = await Promise.all([
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
  }, [blogId, token]);

  if (loading) {
    return <Loader />;
  }

  // Like/Unlike handler
  const handleLikeClick = async (blogId) => {
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
  console.log("Blog Content: ", blog.content);

  const handleSaveClick = async (postId) => {
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
    }
  };

  const shareUrl = window.location.href; // The URL of the current blog post
  const title = blog.title; // The title of the blog post

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
  // Sanitize the blog content to prevent XSS attacks
  const cleanHTML = DOMPurify.sanitize(blog?.content);

  // Function to render <pre><code> blocks with SyntaxHighlighter
  const renderCodeBlocks = (domNode) => {
    // Check if it's a <pre> tag
    if (domNode.name === "pre") {
      // Check if it contains a <code> block
      const codeElement = domNode.children?.find(
        (child) => child.name === "code"
      );

      if (codeElement) {
        // Extract the language (e.g., "language-html" or "language-js")
        const languageClass = codeElement.attribs?.class || "";
        const language = languageClass.replace("language-", "") || "text";

        // Get the raw code content
        const codeContent = domToReact(codeElement.children);

        return (
          <SyntaxHighlighter language={language} style={docco}>
            {codeContent}
          </SyntaxHighlighter>
        );
      }
    }
    return domNode; // If it's not a <pre> block, return the node as-is
  };

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
                <span className="text-zinc-500">By {blog?.author?.name}</span>{" "}
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
            <div className="flex flex-col gap-3 mt-4">
              <h4 className="text-2xl text-custom-black font-semibold">
                {blog.title}
              </h4>
              <div className="prose">
                {parse(cleanHTML, { replace: renderCodeBlocks })}
              </div>
              <div className="flex items-center gap-3 mt-3 self-end">
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
                </ul>
                {/* Web Share API Button (for native sharing on mobile) */}
                <button
                  className="ml-3 bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200"
                  onClick={handleWebShare}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[30%] flex flex-col gap-10">
          <div className="border border-gray-200 rounded-xl px-8 py-8 flex flex-col items-center text-center">
            <figure className="border border-gray-200 rounded-full p-2">
              <img
                src={blog?.author?.profileImage || defaultUser} // Assuming author has a profileImage field
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
              <li>
                <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                  <Link to={blog?.author?.facebook}>
                    <FaFacebookF className="w-3 h-3" />
                  </Link>
                </button>
              </li>
              <li>
                <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                  <Link to={blog?.author?.instagram}>
                    <FaInstagram />
                  </Link>
                </button>
              </li>
              <li>
                <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                  <Link to={blog?.author?.twitter}>
                    <FiTwitter />
                  </Link>
                </button>
              </li>
              <li>
                <button className="bg-zinc-200 p-3 rounded-md hover:text-white hover:bg-orange-300 transition-all ease-in-out duration-200">
                  <Link to={blog?.author?.linkedin}>
                    <FaLinkedin />
                  </Link>
                </button>
              </li>
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
