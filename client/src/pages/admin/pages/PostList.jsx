import React, { useEffect, useState } from "react";
import SearchFilter from "../components/SearchFilter";
import Table from "../components/Table";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../store/Authentication";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify";
const PostList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState(""); // Changed from category to sortBy

  const { token, user } = useAuth();
  const navigate = useNavigate();

  if (user === null) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/get-blogs`,
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
      <section className="mt-[2rem] px-24 max-lg:px-5">
        <div className="flex justify-between items-center">
          <h4 className="text-2xl max-md:text-xl font-semibold">
            Blog Post List
          </h4>
          <button className="bg-orange-400 text-white text-sm font-semibold px-3 py-2 rounded-md ">
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

        <div className="max-w-7xl mx-auto bg-white p-6 border border-gray-200 rounded-lg my-[2rem]">
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
