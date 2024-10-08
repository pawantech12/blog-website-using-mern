import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai"; // Plus and Delete icons
import axios from "axios"; // Assuming you're using axios for API calls
import { useAuth } from "../../../store/Authentication";
import { useForm } from "react-hook-form"; // Import React Hook Form

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAddModal, setIsAddModal] = useState(false); // Track if it's the add modal
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/blog/get-categories"
        );
        console.log("Categories:", response);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Show the confirmation modal for delete
  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setIsAddModal(false); // Ensure add modal is not shown
    setShowModal(true); // Show confirmation modal
  };

  // Function to delete the category
  const deleteCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:3000/blog/delete-category/${selectedCategory._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Category deleted:", response);
      setCategories(
        categories.filter((cat) => cat._id !== selectedCategory._id)
      ); // Update the UI after deletion

      setSuccessMessage(response.data.message);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      setShowModal(false); // Close the modal
      setLoading(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      setApiError(error.response.data.message);
      setTimeout(() => {
        setApiError(null);
      }, 3000);
      setLoading(false);
    }
  };

  // Setup for React Hook Form
  const { register, handleSubmit, reset } = useForm();

  // Function to handle form submission for creating a category
  const onSubmit = async (data) => {
    console.log("data", data);
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("imageUrl", data.imageUrl[0]); // Assuming the input name is "image"

    try {
      const response = await axios.post(
        "http://localhost:3000/blog/create-category",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Category created:", response);
      setCategories([...categories, response.data.category]); // Add the new category to the list
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      reset(); // Reset the form
      setShowModal(false); // Close the modal
      setIsAddModal(false); // Reset after adding category
      setLoading(false);
    } catch (error) {
      console.error("Error creating category:", error);
      setApiError(error.response.data.message);
      setTimeout(() => {
        setApiError(null);
      }, 3000);
      setLoading(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Categories</h1>
        <button
          onClick={() => {
            setIsAddModal(true);
            setShowModal(true); // Open the modal for adding a category
          }}
          className="flex items-center bg-orange-400 text-white px-4 py-2 rounded-lg hover:bg-orange-500"
        >
          <AiOutlinePlus className="mr-2 w-5 h-5" /> Add Category
        </button>
      </div>

      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {apiError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{apiError}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        {categories.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead className="bg-orange-400 text-white rounded-s-md">
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-sm ">
                  Category Image
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-sm">
                  Category Name
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 text-left text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-100">
                  <td className="py-4 px-4 border-b border-gray-200">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-4 px-4 border-b border-gray-200">
                    <span className="text-lg text-gray-700">
                      {category.name}
                    </span>
                  </td>
                  <td className="py-4 px-4 border-b border-gray-200">
                    <button
                      className="flex items-center bg-red-500 hover:bg-red-600 p-2 rounded-md"
                      onClick={() => confirmDelete(category)}
                    >
                      <AiOutlineDelete className="w-5 h-5 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No categories available.</p>
        )}
      </div>

      {/* Confirmation Modal for Deletion */}
      {showModal && !isAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">Delete Category</h2>
            <p className="mb-4 ">
              Are you sure you want to delete the category{" "}
              <strong>{selectedCategory?.name}</strong>?
            </p>
            <div className="flex justify-center items-center gap-3">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)} // Close the modal without deleting
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={loading}
                onClick={deleteCategory} // Confirm and delete the category
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showModal && isAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Category</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-gray-700">Category Name</label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category Image</label>
                <input
                  type="file"
                  {...register("imageUrl", { required: true })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  accept="image/*"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setShowModal(false)} // Close the modal without creating
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
