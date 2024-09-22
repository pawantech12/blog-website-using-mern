import React, { useState } from "react";
import SearchFilter from "../components/SearchFilter";
import Table from "../components/Table";
import initialBlogs from "../../../data/BlogSample";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
const PostList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [blogs, setBlogs] = useState(initialBlogs);

  const handleDelete = (id) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const handleEdit = (id) => {
    console.log("Edit blog with id:", id);
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
            handleEdit={handleEdit}
          />
        </div>
      </section>
    </>
  );
};

export default PostList;
