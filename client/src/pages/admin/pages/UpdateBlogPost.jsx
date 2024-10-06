import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import { useAuth } from "../../../store/Authentication";
import { useParams } from "react-router-dom";

const UpdateBlogPost = () => {
  const { blogId } = useParams(); // Get blog post ID from URL params
  console.log("blog id ", blogId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [postBody, setPostBody] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogData, setBlogData] = useState({});

  const { token } = useAuth();

  // Fetch existing blog post data when component mounts
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/blog/get-blog/${blogId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const blogData = response.data.blog;
        console.log("response update", response);

        setImagePreview(blogData.coverImage); // Set image preview if there was an existing image
        setBlogData(blogData);
      } catch (error) {
        console.error("Failed to fetch blog post:", error);
      }
    };

    fetchBlogPost();
  }, [blogId, blogData, token]);

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
    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category", data.category);
    formData.append("isDraft", data.isDraft);
    formData.append("isFeatured", data.isFeatured);
    if (data.coverImage && data.coverImage[0]) {
      formData.append("coverImage", data.coverImage[0]); // Add cover image only if it's changed
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/blog/update-blog/${blogId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setApiError(response.data.message);
        setTimeout(() => setApiError(""), 3000);
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Failed to update blog post"
      );
      setTimeout(() => setApiError(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorChange = (content) => {
    setPostBody(content);
  };

  return (
    <div className="mx-auto p-8 bg-white">
      <h1 className="text-2xl font-semibold text-custom-black mb-6">
        Update Blog Post
      </h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative font-medium">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative font-medium">
          <span className="block sm:inline">{apiError}</span>
        </div>
      )}
      {/* Image Preview */}
      {imagePreview && (
        <div className="mt-2">
          <img
            src={imagePreview}
            alt="Image Preview"
            className="w-full h-96 object-contain rounded-lg border"
          />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border border-gray-200 p-6 px-8 mt-5"
      >
        {/* Post Title */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Post Title
          </label>
          <input
            type="text"
            {...register("title", { required: true })}
            placeholder="Enter post title"
            defaultValue={blogData.title}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-400"
          />
          {errors.title && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Post Body (TinyMCE Editor) */}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Post Body
          </label>
          <Editor
            apiKey="niogdjwfejq20ihmep2n3quecbaqvke4kmkolr9sn3x2ubcm"
            value={postBody}
            onEditorChange={handleEditorChange}
            init={{
              plugins: [
                "anchor",
                "autolink",
                "charmap",
                "codesample",
                "emoticons",
                "image",
                "link",
                "lists",
                "media",
                "searchreplace",
                "table",
                "visualblocks",
                "wordcount",
                "checklist",
                "mediaembed",
                "casechange",
                "export",
                "formatpainter",
                "pageembed",
                "a11ychecker",
                "tinymcespellchecker",
                "permanentpen",
                "powerpaste",
                "advtable",
                "advcode",
                "editimage",
                "advtemplate",
                "mentions",
                "tableofcontents",
                "footnotes",
                "mergetags",
                "autocorrect",
                "typography",
                "inlinecss",
                "markdown",
              ],
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
          />
        </div>

        <div className="flex justify-between items-center gap-5">
          {/* Post Category */}
          <div className="w-full">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Post Category
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full border border-gray-200 rounded-md py-3 px-4 appearance-none text-base outline-none"
            >
              <option value="">Select category</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="education">Education</option>
              <option value="business">Business</option>
            </select>
            {errors.category && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>

          {/* Post Cover Image */}
          <div className="w-full">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Cover Image
            </label>
            <input
              type="file"
              {...register("coverImage", { required: true })}
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.coverImage && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
        </div>

        {/* Featured Post and Draft Checkboxes */}
        <div className="flex items-center">
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
