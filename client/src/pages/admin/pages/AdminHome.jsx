import { useEffect, useState } from "react";
import { BsBarChartLineFill } from "react-icons/bs";
import { FaFileAlt, FaHeart, FaPlus } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import Table from "../components/Table";

import SearchFilter from "../components/SearchFilter";
import { Link, useNavigate } from "react-router-dom";
import initialBlogs from "../../../data/BlogSample";
import ConfirmationModal from "../components/ConfirmationModal";
import axios from "axios";
import { useAuth } from "../../../store/Authentication";
const AdminHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState(initialBlogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState(""); // Changed from category to sortBy

  const { token } = useAuth();
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    setLoading(true);
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/blog/get-blogs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success === false) {
          console.log("Failed to fetch blogs", response);
        }

        setBlogs(response.data.blogs);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [token]);

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
        `http://localhost:3000/blog/delete-blog/${blogToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add your token if necessary
          },
        }
      );

      if (response.data.success === true) {
        setBlogs(blogs.filter((blog) => blog._id !== blogToDelete)); // Update state to remove the blog
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
      setIsDeleting(false);

      setIsModalOpen(false); // Close modal after deletion
    } catch (error) {
      console.error("Failed to delete the blog post:", error);
      setIsDeleting(false);
      setApiError(error.response.data.message);
      setTimeout(() => {
        setApiError("");
      }, 3000);
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
  return (
    <>
      <section className="grid grid-cols-4 gap-8 my-[3rem] px-24">
        <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
          <figure className="bg-emerald-100 rounded-md p-4">
            <FaUserGroup className="w-10 h-10 text-emerald-500" />
          </figure>
          <div>
            <h3 className="text-2xl font-semibold">134k</h3>
            <span className="text-sm font-semibold text-gray-600">
              Pageviews
            </span>
          </div>
        </div>
        <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
          <figure className="bg-blue-100 rounded-md p-4">
            <FaFileAlt className="w-10 h-10 text-blue-600" />
          </figure>
          <div>
            <h3 className="text-2xl font-semibold">134k</h3>
            <span className="text-sm font-semibold text-gray-600">Posts</span>
          </div>
        </div>
        <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
          <figure className="bg-red-100 rounded-md p-4">
            <FaHeart className="w-10 h-10 text-red-500" />
          </figure>
          <div>
            <h3 className="text-2xl font-semibold">134k</h3>
            <span className="text-sm font-semibold text-gray-600">Likes</span>
          </div>
        </div>
        <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
          <figure className="bg-blue-100 rounded-md p-4">
            <BsBarChartLineFill className="w-10 h-10 text-blue-500" />
          </figure>
          <div>
            <h3 className="text-2xl font-semibold">134k</h3>
            <span className="text-sm font-semibold text-gray-600">
              Visitors
            </span>
          </div>
        </div>
      </section>
      <section className="px-24">
        <div className="max-w-7xl mx-auto bg-white p-6 border border-gray-200 rounded-lg my-[3rem]">
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
              <p className="text-sm">{successMessage}</p>
            </div>
          )}
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
              <p className="text-sm">{apiError}</p>
            </div>
          )}
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Blog List</h4>
            <button className="bg-orange-400 text-white text-sm font-semibold px-3 py-2 rounded-md">
              <Link
                className="flex items-center gap-1"
                to={"/dashboard/create-post"}
              >
                {" "}
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
      <section className="my-[3rem] flex gap-5 justify-between px-24">
        <div className="p-6 bg-white border border-gray-200 rounded-lg w-1/2">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Recent Comments
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {[0, 1, 2].map((index) => {
              return (
                <div
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100"
                  key={index}
                >
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                      JD
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-gray-600">
                        Great article, learned a lot!
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">Sept 20, 2024</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg  border border-gray-200 w-1/2 flex flex-col ">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">
            Latest Posts
          </h2>
          {blogs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4">
                {blogs.slice(0, 3).map((blog, index) => (
                  <div
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100"
                    key={index}
                  >
                    <div className="flex items-center">
                      <img
                        src={blog.coverImage} // Replace with actual image URLs
                        alt={blog.title}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="ml-4">
                        <h3 className="font-semibold">{blog.title}</h3>
                        <p className="text-sm text-gray-600">
                          {blog?.content?.length > 80
                            ? blog?.content?.slice(0, 80) + "..."
                            : blog?.content}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(blog.publishedDate).toLocaleDateString()}
                    </p>
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
