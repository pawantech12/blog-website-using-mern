import React, { useEffect, useState } from "react";
import SearchFilter from "../components/SearchFilter";
import Table from "../components/Table";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../store/Authentication";
import ConfirmationModal from "../components/ConfirmationModal";
const PostList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
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

        setBlogs(response.data.blogs);
      } catch (err) {
        setError("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null); // Track which blog is to be deleted
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (id) => {
    setIsModalOpen(true); // Open modal for confirmation
    setBlogToDelete(id); // Set the blog id to be deleted
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

  // Filtered Blogs based on Search Term and Category
  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || blog.category === filterCategory)
  );
  return (
    <>
      <section className="mt-[2rem]">
        <div className="flex justify-between items-center">
          <h4 className="text-2xl font-semibold">Blog Post List</h4>
          <button className="bg-orange-400 text-white text-sm font-semibold px-3 py-2 rounded-md ">
            <Link className="flex items-center gap-1">
              {" "}
              <FaPlus />
              Add a Post
            </Link>
          </button>
        </div>
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
        <div className="max-w-7xl mx-auto bg-white p-6 border border-gray-200 rounded-lg my-[2rem]">
          <SearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
          <Table
            blogs={filteredBlogs}
            handleDelete={handleDelete}
            isDeleting={isDeleting}
          />
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

export default PostList;