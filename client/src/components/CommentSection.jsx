import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/Authentication";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from "react-icons/ai";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import ConfirmationModal from "../pages/admin/components/ConfirmationModal";

const CommentSection = ({ blogId, user }) => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const { token } = useAuth();
  console.log("user from comment section", user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchComments();
  }, []);

  // Fetch comments for the blog post
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/blog/fetch-comments/${blogId}`
      );
      setComments(res.data.comments);
    } catch (err) {
      console.error(err);
    }
  };
  const handleLike = async (commentId) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/blog/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the specific comment in the state
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: res.data.comment.likes,
                dislikes: res.data.comment.dislikes,
              }
            : comment
        )
      );
      console.log("like comment response", res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/blog/${commentId}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update the specific comment in the state
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: res.data.comment.likes,
                dislikes: res.data.comment.dislikes,
              }
            : comment
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    console.log("comment to delete in handle delete: ", commentId);
    try {
      const response = await axios.delete(
        `http://localhost:3000/blog/delete-comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Assuming JWT token
          },
        }
      );

      if (response.data.success) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        setIsModalOpen(false); // Close the modal after delete
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const openModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCommentToDelete(null);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      handleDelete(commentToDelete);
    }
  };

  // Handle form submission for new comment
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/blog/create-comment",
        { content: data.comment, blogId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("comment response: ", res);
      toast.success(res.data.message);
      setComments([res.data.comment, ...comments]);
      reset(); // Reset form fields
    } catch (err) {
      console.error(err);
    }
  };
  console.log("comment to delete: ", commentToDelete);
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <textarea
            className={`w-full border ${
              errors.comment ? "border-red-500" : "border-gray-300"
            } rounded-lg p-3 outline-none resize-none bg-gray-100 focus:bg-white transition duration-200 ease-in-out`}
            rows="4"
            placeholder="Write a comment..."
            {...register("comment", {
              required: "Comment is required",
              minLength: {
                value: 3,
                message: "Comment must be at least 3 characters long",
              },
            })}
          ></textarea>
          {errors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {errors.comment.message}
            </p>
          )}
          <button
            type="submit"
            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg transition duration-200 ease-in-out"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="mb-6 text-gray-600">Please login to post a comment.</p>
      )}

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="border-b pb-4">
              <div className="">
                <div className="flex items-center gap-3">
                  <figure className="w-16 h-full">
                    <img
                      src={comment?.author?.profileImg || "/default-avatar.png"}
                      alt="Author"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </figure>
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">
                        {comment?.author?.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment?.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {/* Show delete button if the user is the author */}
                      {user?.user?._id === comment?.author?._id && (
                        <button
                          onClick={() => openModal(comment._id)}
                          className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className=" text-gray-700">{comment?.content}</p>
                    <div className="flex items-center space-x-4 text-gray-500">
                      <button
                        onClick={() => handleLike(comment?._id)}
                        className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200"
                      >
                        {comment?.likes?.includes(user?.user?._id) ? (
                          <AiFillLike className="text-blue-500 w-5 h-5" />
                        ) : (
                          <AiOutlineLike className="w-5 h-5" />
                        )}
                        <span>{comment?.likes?.length}</span>
                      </button>
                      <button
                        onClick={() => handleDislike(comment._id)}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200"
                      >
                        {comment?.dislikes?.includes(user?.user?._id) ? (
                          <AiFillDislike className="text-red-500 w-5 h-5" />
                        ) : (
                          <AiOutlineDislike className="w-5 h-5" />
                        )}
                        <span>{comment?.dislikes?.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No comments yet.</p>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CommentSection;
