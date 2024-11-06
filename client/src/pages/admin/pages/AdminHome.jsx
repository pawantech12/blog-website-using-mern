import { useEffect, useState } from "react";
import { BsBarChartLineFill } from "react-icons/bs";
import { FaFileAlt, FaHeart, FaPlus } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import Table from "../components/Table";

import SearchFilter from "../components/SearchFilter";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import axios from "axios";
import { useAuth } from "../../../store/Authentication";
import { LuCalendarDays } from "react-icons/lu";
import { toast } from "react-toastify";
const AdminHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(""); // Changed from category to sortBy
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const { token, user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null && !token) {
      navigate("/login");
    }
  }, [user, navigate, token]);

  useEffect(() => {
    setLoading(true);

    const fetchAllBlogsWithSummary = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/get-blog-summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response: ", response);
        setBlogs(response.data.blogs);
        setTotalViews(response.data.totalViews);
        setTotalLikes(response.data.totalLikes);
      } catch (error) {
        console.log("error occurred while fetching blog summary: ", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchAllCommentsOfCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/fetch-all-comments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComments(response.data.comments);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchAllBlogsWithSummary();
    fetchAllCommentsOfCurrentUser();
    setFollowers(user?.user?.followers);
    setFollowings(user?.user?.following);
  }, [token, user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null); // Track which blog is to be deleted
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (id) => {
    setIsModalOpen(true); // Open modal for confirmation
    setBlogToDelete(id); // Set the blog id to be deleted
  };
  const handleEdit = (id) => {
    console.log("Edit blog with id:", id);
    navigate(`/dashboard/update-post/${id}`);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      // Make the API call to delete the blog post
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/blog/delete-blog/${blogToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add your token if necessary
          },
        }
      );

      if (response.data.success === true) {
        setBlogs(blogs.filter((blog) => blog._id !== blogToDelete)); // Update state to remove the blog
        toast.success(response.data.message);
      }
      setIsDeleting(false);

      setIsModalOpen(false); // Close modal after deletion
    } catch (error) {
      console.error("Failed to delete the blog post:", error);
      setIsDeleting(false);
      toast.error(error.response.data.message);
    }
  };

  const handleUserFollow = async (userid) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/follow/${userid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setFollowings(response.data.updatedFollowing);
      setFollowers(response.data.updatedFollowers);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUserUnFollow = async (userid) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/unfollow/${userid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setFollowings(response.data.updatedFollowing);
      setFollowers(response.data.updatedFollowers);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Blogs based on Search Term
  const filteredBlogs = blogs
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by latest
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt); // Sort by oldest
      }
      return 0;
    });

  console.log("following: ", followings);
  console.log("followers: ", followers);
  return (
    <>
      <section className="grid grid-cols-4 gap-8 my-[3rem] px-24 max-lg:grid-cols-2 max-lg:px-5 max-[500px]:grid-cols-1">
        <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
          <figure className="bg-emerald-100 rounded-md p-4">
            <FaUserGroup className="w-10 h-10 text-emerald-500" />
          </figure>
          <div>
            <h3 className="text-2xl font-semibold">{followers?.length}</h3>
            <span className="text-sm font-semibold text-gray-600">
              Followers
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
          <figure className="bg-blue-100 rounded-md p-4">
            <FaFileAlt className="w-10 h-10 text-blue-600" />
          </figure>
          <div>
            <h3 className="text-2xl font-semibold">{blogs.length}</h3>
            <span className="text-sm font-semibold text-gray-600">Posts</span>
          </div>
        </div>
        <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
          <figure className="bg-red-100 rounded-md p-4">
            <FaHeart className="w-10 h-10 text-red-500" />
          </figure>
          <div>
            <h3 className="text-2xl font-semibold">{totalLikes}</h3>
            <span className="text-sm font-semibold text-gray-600">Likes</span>
          </div>
        </div>
        <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
          <figure className="bg-blue-100 rounded-md p-4">
            <BsBarChartLineFill className="w-10 h-10 text-blue-500" />
          </figure>
          <div>
            <h3 className="text-2xl font-semibold">{totalViews}</h3>
            <span className="text-sm font-semibold text-gray-600">Views</span>
          </div>
        </div>
      </section>
      <section className="px-24 max-lg:px-5">
        <div className="max-w-7xl mx-auto bg-white p-4 md:p-6 border border-gray-200 rounded-lg my-6">
          <div className="flex  justify-between items-center">
            <h4 className="text-xl font-semibold mb-4 md:mb-0">Blog List</h4>
            <button className="bg-orange-400 text-white text-sm font-semibold px-3 py-2 rounded-md">
              <Link
                className="flex items-center gap-1"
                to={"/dashboard/create-post"}
              >
                <FaPlus />
                Add a Post
              </Link>
            </button>
          </div>
          <hr className="mt-4" />
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <Table
            blogs={filteredBlogs}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            isDeleting={isDeleting}
            loading={loading}
          />
        </div>
      </section>

      <section className="my-[3rem] flex gap-5 justify-between px-24 max-lg:px-5 max-md:flex-col">
        <div className="p-6 bg-white border border-gray-200 rounded-lg w-1/2 max-md:w-full">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Recent Comments
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {comments?.length > 0 ? (
              comments.map((comment, index) => {
                return (
                  <div
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100"
                    key={index}
                  >
                    <div className="flex items-center">
                      {comment?.author?.profileImg ? (
                        <figure className="w-10 h-10">
                          <img
                            src={comment?.author?.profileImg}
                            alt={comment.author.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </figure>
                      ) : (
                        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          {comment?.author?.name
                            ?.split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>
                      )}
                      <div className="ml-4">
                        <p className="font-semibold">{comment?.author?.name}</p>
                        <p className="text-sm text-gray-600">
                          {comment?.content}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(comment?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                );
              })
            ) : (
              <p>No comments found</p>
            )}
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg  border border-gray-200 w-1/2 flex flex-col max-md:w-full">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Latest Posts
          </h2>
          {blogs?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {blogs.slice(0, 3).map((blog, index) => (
                  <div
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100"
                    key={index}
                  >
                    <div className="flex items-center gap-3 max-[460px]:flex-col">
                      <figure className="w-[30%] h-full max-[460px]:w-full">
                        <img
                          src={blog.coverImage} // Replace with actual image URLs
                          alt={blog.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </figure>
                      <div className="w-[70%] max-[460px]:w-full">
                        <h3 className="font-semibold">{blog.title}</h3>
                        <p className="text-sm text-gray-600">
                          {blog?.content?.length > 60
                            ? blog?.content?.slice(0, 60) + "..."
                            : blog?.content}
                        </p>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                          <LuCalendarDays className="w-4 h-4" />
                          {new Date(blog.publishedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="my-4" />
              <Link className="self-center font-medium text-orange-400 hover:text-orange-500">
                View More
              </Link>
            </>
          ) : (
            <p className="text-gray-600 text-center">No posts found.</p>
          )}
        </div>
      </section>
      <section className="my-[3rem] flex max-md:flex-col gap-5 justify-between px-24 max-lg:px-5">
        <div className="p-6 bg-white border border-gray-200 rounded-lg w-1/2 max-md:w-full">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Followers
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {followers?.length > 0 ? (
              followers.map((follower, index) => {
                return (
                  <div
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100"
                    key={index}
                  >
                    <div className="flex items-center">
                      {follower?.profileImg ? (
                        <figure className="w-10 h-10">
                          <img
                            src={follower?.profileImg}
                            alt={follower?.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </figure>
                      ) : (
                        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                          {follower?.name
                            ?.split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>
                      )}
                      <div className="ml-4">
                        <p className="font-semibold">{follower?.name}</p>
                        <p className="text-sm text-gray-600">
                          {follower?.username}
                        </p>
                      </div>
                    </div>
                    <button
                      disabled={loading}
                      onClick={() => handleUserFollow(follower?._id)}
                      className={` px-4 py-2 rounded-md text-sm font-medium ${
                        follower?.followers?.some(
                          (follower) => follower._id === user?.user?._id
                        )
                          ? "border-2 bg-white border-gray-200 font-semibold text-gray-600"
                          : "bg-custom-light-black text-white"
                      }`}
                    >
                      {loading
                        ? "Following"
                        : follower?.followers?.some(
                            (follower) => follower._id === user?.user?._id
                          )
                        ? "Followed"
                        : "Follow"}
                    </button>
                  </div>
                );
              })
            ) : (
              <p>You Dont have followers yet</p>
            )}
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg  border border-gray-200 w-1/2 flex flex-col max-md:w-full">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Following
          </h2>
          {followings?.length > 0 ? (
            followings.map((following, index) => {
              return (
                <div
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100"
                  key={index}
                >
                  <div className="flex items-center">
                    {following?.profileImg ? (
                      <figure className="w-10 h-10">
                        <img
                          src={following?.profileImg}
                          alt={following?.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </figure>
                    ) : (
                      <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {following?.name
                          ?.split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>
                    )}
                    <div className="ml-4">
                      <p className="font-semibold">{following?.name}</p>
                      <p className="text-sm text-gray-600">
                        {following?.username}
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={loading}
                    onClick={() => handleUserUnFollow(following?._id)}
                    className="bg-custom-light-black px-4 py-2 rounded-md text-white text-sm font-medium"
                  >
                    UnFollow
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600 text-center">
              You havn&apos;t followed anyone
            </p>
          )}
        </div>
      </section>
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default AdminHome;
