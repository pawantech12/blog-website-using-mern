import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { FaChevronDown } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../../store/Authentication";

const CreateBlogPost = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [postBody, setPostBody] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { token } = useAuth();

  const onSubmit = async (data) => {
    data.content = postBody; // Add post body from the TinyMCE editor
    console.log("Form Data:", data);
    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/blog/create-blog",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data,
        }
      );
      console.log(response);

      if (response.status === 201) {
        console.log("Blog Post created successfully:", response);
        // Redirect or show success message
        setSuccessMessage(response.data.message);
      } else {
        setApiError(response.data.message);
      }
      console.log(response.data.message); // Handle success response
    } catch (error) {
      console.error(error);
      setApiError("An error occurred. Please try again later.");
      console.log(error);
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
        Create Blog Post
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border border-gray-200 p-6 px-8"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-400"
          />
          {errors.title && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>

        {/* Post Body (TinyMCE Editor) {import.meta.VITE_APP_TINYMCE_API_KEY}*/}
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Post Body
          </label>
          <Editor
            apiKey="niogdjwfejq20ihmep2n3quecbaqvke4kmkolr9sn3x2ubcm"
            onEditorChange={handleEditorChange}
            init={{
              plugins: [
                // Core editing features
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
                // Your account includes a free trial of TinyMCE premium features
                // Try the most popular premium features until Oct 8, 2024:
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
                "ai",
                "mentions",
                "tinycomments",
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
              tinycomments_mode: "embedded",
              tinycomments_author: "Author name",
              mergetags_list: [
                { value: "First.Name", title: "First Name" },
                { value: "Email", title: "Email" },
              ],
              ai_request: (request, respondWith) =>
                respondWith.string(() =>
                  Promise.reject("See docs to implement AI Assistant")
                ),
            }}
          />{" "}
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.coverImage && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
        </div>

        {/* Featured Post Checkbox */}
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

        {/* Create Post Button */}
        <div className="flex">
          <button
            type="submit"
            className={`bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500 font-medium focus:outline-none transition-all ease-in-out duration-200 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>

        {apiError && <div className="text-red-500">{apiError}</div>}
        {successMessage && (
          <div className="text-green-500">{successMessage}</div>
        )}
      </form>
    </div>
  );
};

export default CreateBlogPost;
