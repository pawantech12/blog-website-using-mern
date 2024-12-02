import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../../../store/Authentication";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MDEditor from "@uiw/react-md-editor";

const UpdateBlogPost = () => {
  const { blogId } = useParams(); // Get blog post ID from URL params
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  if (user === null) {
    navigate("/login");
  }
  const editorRef = useRef(null); // Create a ref for TinyMCE
  const [postBody, setPostBody] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogData, setBlogData] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isDraft, setIsDraft] = useState(false);
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

  // Fetch existing blog post data when component mounts
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/blog/get-blog/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const blogData = response.data.blog;
        setImagePreview(blogData.coverImage); // Set image preview if there was an existing image
        setBlogData(blogData);
        setPostBody(blogData.content); // Set the blog post content
        setIsDraft(blogData.isDraft);

        // Dynamically set TinyMCE content once the blog data is loaded
        if (editorRef.current) {
          editorRef.current.setContent(blogData.content);
        }
        // Set default category name based on catId from blog data
        const dCategory = categories.find(
          (category) => category._id === blogData.category._id
        );
        if (dCategory) {
          setSelectedCategory(dCategory.name); // Set the default category name
        }
        console.log("default category", selectedCategory);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      }
    };

    fetchBlogPost();
  }, [blogId, categories, token]);

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

  const onSubmit = async (data) => {
    data.content = postBody; // Add post body from TinyMCE editor
    data.isDraft = isDraft;
    setIsSubmitting(true);

    console.log("data: ", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category || blogData.category.name);
    formData.append("isDraft", data.isDraft);
    formData.append("isFeatured", data.isFeatured);
    if (data.coverImage && data.coverImage[0]) {
      formData.append("coverImage", data.coverImage[0]); // Add cover image only if it's changed
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/blog/update-blog/${blogId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Blog post updated succesfully", response);

      toast.success(response.data.message);
      setTimeout(() => {
        navigate(`/dashboard/post-list`);
      }, 3000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update blog post"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorChange = (content) => {
    setPostBody(content); // Update post body when the editor content changes
  };
  // Handle change to update selected category
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white md:px-12 lg:px-24">
      <h1 className="text-xl md:text-2xl font-semibold text-custom-black mb-4 md:mb-6">
        Update Blog Post
      </h1>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-2">
          <img
            src={imagePreview}
            alt="Image Preview"
            className="w-full h-48 sm:h-64 md:h-96 object-contain rounded-lg border"
          />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6 rounded-lg border border-gray-200 p-4 sm:p-6 md:p-8 mt-5"
      >
        {/* Post Title */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Post Title
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="Enter post title"
            defaultValue={blogData.title}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* Post Body (TinyMCE Editor) */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Post Body
          </label>
          <div className="w-full">
            <MDEditor
              value={postBody}
              onChange={handleEditorChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          {/* Post Category */}
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Post Category
            </label>
            <select
              {...register("category")}
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full border border-gray-200 rounded-md py-3 px-4 appearance-none text-base outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Post Cover Image */}
          <div className="w-full md:w-1/2">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Cover Image
            </label>
            <input
              type="file"
              {...register("coverImage")}
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Featured Post and Draft Checkboxes */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("isFeatured")}
            id="isFeatured"
            className="mr-2"
            defaultChecked={blogData.isFeatured}
          />
          <label htmlFor="isFeatured" className="text-gray-700">
            Make this post featured?
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDraft"
            className="mr-2"
            checked={isDraft} // Use the state variable here
            onChange={(e) => setIsDraft(e.target.checked)}
          />
          <label htmlFor="isDraft" className="text-gray-700">
            Save this post as Draft?
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className={`bg-orange-400 text-white px-6 py-2 rounded-md font-medium ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlogPost;
