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

const CommentSection = ({ blogId, user }) => {
  const [comments, setComments] = useState([]);
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

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
          <textarea
            className={`w-full border ${
              errors.comment ? "border-red-500" : "border-gray-300"
            } rounded-md p-2 outline-none resize-none`}
            rows="3"
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
            className="mt-2 text-sm bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-md"
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
              <div className="flex items-center space-x-4">
                <img
                  src={comment?.author?.profileImg || "/default-avatar.png"}
                  alt="Author"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{comment?.author?.name}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(comment?.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mt-2">{comment?.content}</p>

              <div className="flex items-center mt-2 space-x-4">
                <button onClick={() => handleLike(comment?._id)}>
                  {comment?.likes?.includes(user?.user?._id) ? (
                    <AiFillLike className="text-blue-400 w-5 h-5" />
                  ) : (
                    <AiOutlineLike className="text-gray-500 w-5 h-5" />
                  )}
                  {comment?.likes?.length}
                </button>
                <button onClick={() => handleDislike(comment._id)}>
                  {comment?.dislikes?.includes(user?.user?._id) ? (
                    <AiFillDislike className="text-red-400 w-5 h-5" />
                  ) : (
                    <AiOutlineDislike className="text-gray-500 w-5 h-5" />
                  )}
                  {comment?.dislikes?.length}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
