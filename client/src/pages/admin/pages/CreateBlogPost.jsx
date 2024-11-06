import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// import { FaChevronDown } from "react-icons/fa";

import MDEditor from "@uiw/react-md-editor";

import axios from "axios";
import { useAuth } from "../../../store/Authentication";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateBlogPost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [postBody, setPostBody] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/get-categories`
        );
        console.log("Categories:", response);
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      setImagePreview(null); // Clear the preview if no file is selected
    }
  };
  const { token, user } = useAuth();

  const navigate = useNavigate();

  if (user === null) {
    navigate("/login");
  }
  console.log("token", token);

  const onSubmit = async (data) => {
    data.content = postBody; // Add post body from the TinyMCE editor
    console.log("Form Data:", data);
    setIsSubmitting(true);

    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);
    formData.append("isDraft", data.isDraft);
    formData.append("isFeatured", data.isFeatured);
    formData.append("coverImage", data.coverImage[0]); // Assuming it's a FileList
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/blog/create-blog`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);

      console.log("Blog Post created successfully:", response);
      // Redirect or show success message
      toast.success(response.data.message);
      reset();
      setPostBody("");
      setImagePreview(null);
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorChange = (content) => {
    setPostBody(content);
  };

  return (
    <div className="mx-auto p-4 sm:p-8 bg-white md:px-16 lg:px-24">
      <h1 className="text-xl md:text-2xl font-semibold text-custom-black mb-4 sm:mb-6">
        Create Blog Post
      </h1>

      {imagePreview && (
        <div className="mt-2">
          <img
            src={imagePreview}
            alt="Image Preview"
            className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-lg border"
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6 rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 mt-5"
      >
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1 sm:mb-2">
            Post Title
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter post title"
            className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-400"
          />
          {errors.title && (
            <span className="text-xs mt-1 font-medium text-gray-500">
              {errors.title.message}
            </span>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-1 sm:mb-2">
            Post Body
          </label>
          <div className="w-full">
            <MDEditor
              value={postBody}
              onChange={handleEditorChange}
              className="w-full"
            />
          </div>
          {errors.content && (
            <span className="text-xs mt-1 font-medium text-gray-500">
              {errors.content.message}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-5">
          <div className="w-full">
            <label className="block text-gray-700 text-sm font-semibold mb-1 sm:mb-2">
              Post Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full border border-gray-200 rounded-md py-2 px-3 sm:py-3 sm:px-4 appearance-none text-base outline-none"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-xs mt-1 font-medium text-gray-500">
                {errors.category.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <label className="block text-gray-700 text-sm font-semibold mb-1 sm:mb-2">
              Cover Image
            </label>
            <input
              type="file"
              {...register("coverImage", { required: true })}
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.coverImage && (
              <span className="text-xs mt-1 font-medium text-gray-500">
                {errors.coverImage.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center mt-3">
          <input
            type="checkbox"
            {...register("isFeatured")}
            id="isFeatured"
            className="mr-2"
          />
          <label htmlFor="isFeatured" className="text-gray-700">
            Make this post featured?
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("isDraft")}
            id="isDraft"
            className="mr-2"
          />
          <label htmlFor="isDraft" className="text-gray-700">
            Save this post as Draft?
          </label>
        </div>

        <div className="flex">
          <button
            type="submit"
            className={`w-full sm:w-auto bg-orange-400 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-orange-500 font-medium focus:outline-none transition-all ease-in-out duration-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPost;
