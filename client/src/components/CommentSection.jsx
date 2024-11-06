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
import defaultUserProfileImg from "../img/default-user.jpg";
import { FaRegTrashCan } from "react-icons/fa6";
import { LuReply } from "react-icons/lu";

const CommentSection = ({ blogId, user }) => {
  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
  const { token } = useAuth();

  // Separate form handling for main comment and replies
  const {
    register: mainRegister,
    handleSubmit: mainHandleSubmit,
    reset: mainReset,
    formState: { errors: mainErrors },
  } = useForm(); // Main comment form

  // For reply form, we will handle separate form state
  const {
    register: replyRegister,
    handleSubmit: replyHandleSubmit,
    reset: replyReset,
    formState: { errors: replyErrors },
  } = useForm(); // Reply form

  useEffect(() => {
    fetchComments();
  }, []);

  // Fetch comments for the blog post
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/blog/fetch-comments/${blogId}`
      );
      const commentsWithReplies = res.data.comments.map((comment) => ({
        ...comment,
        replies: comment.replies || [], // Ensure replies is initialized to an empty array
      }));
      setComments(commentsWithReplies);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/blog/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

      console.log("like comment data: ", res);
    } catch (err) {
      toast.error(err.response.data.message);
      console.error(err);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/blog/${commentId}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      toast.error(err.response.data.message);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/blog/delete-comment/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setComments(comments.filter((comment) => comment._id !== commentId));
        setIsModalOpen(false);
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
  const onSubmitMainComment = async (data) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/blog/create-comment`,
        { content: data.comment, blogId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
      setComments([res.data.comment, ...comments]);
      mainReset(); // Reset form fields for main comment
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form submission for replying to a comment
  const onSubmitReply = async (data, commentId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/blog/${commentId}/reply`,
        { content: data.reply, blogId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Reply added successfully!");
      console.log("reply comment data: ", res);

      // Add the reply to the corresponding comment
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: [...comment.replies, res.data.reply] }
            : comment
        )
      );
      replyReset(); // Reset reply form fields
      setReplyingTo(null); // Close the reply form
    } catch (err) {
      toast.error(err.response.data.message);
      console.error(err);
    }
  };

  // Toggle reply form visibility
  const handleReplyClick = (commentId) => {
    if (replyingTo === commentId) {
      setReplyingTo(null); // Hide the reply form if it's already open for the same comment
    } else {
      setReplyingTo(commentId); // Show reply form for the selected comment
    }
  };
  console.log("comments: ", comments);

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Comments</h3>

      {user ? (
        <form onSubmit={mainHandleSubmit(onSubmitMainComment)} className="mb-8">
          <textarea
            className={`w-full border ${
              mainErrors.comment ? "border-red-500" : "border-gray-300"
            } rounded-lg p-3 outline-none resize-none bg-gray-100 focus:bg-white transition duration-200 ease-in-out`}
            rows="4"
            placeholder="Write a comment..."
            {...mainRegister("comment", {
              required: "Comment is required",
              minLength: {
                value: 3,
                message: "Comment must be at least 3 characters long",
              },
            })}
          ></textarea>
          {mainErrors.comment && (
            <p className="text-red-500 text-sm mt-1">
              {mainErrors.comment.message}
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
              <div className="flex gap-3">
                <figure className="w-16 h-full">
                  <img
                    src={comment?.author?.profileImg || defaultUserProfileImg}
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
                    <button
                      onClick={() => handleReplyClick(comment._id)}
                      className="hover:text-orange-500 transition duration-200 ease-in-out"
                    >
                      <LuReply className="w-5 h-5" />
                    </button>
                    {user?.user?._id === comment?.author?._id && (
                      <button
                        onClick={() => openModal(comment._id)}
                        className="text-gray-500 hover:text-red-500 transition duration-200 ease-in-out"
                      >
                        <FaRegTrashCan />
                      </button>
                    )}
                  </div>

                  {/* Display replies */}
                  {comment?.replies?.length > 0 && (
                    <div className="mt-4 pl-6 space-y-4 border-l-2 border-gray-300">
                      {comment?.replies.map((reply) => (
                        <div
                          key={reply?._id}
                          className="flex items-center gap-1"
                        >
                          <figure className="w-16 h-full">
                            <img
                              src={
                                reply?.author?.profileImg ||
                                defaultUserProfileImg
                              }
                              alt={reply?.author?.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </figure>
                          <div>
                            <p className="text-gray-600">{reply?.content}</p>
                            <p className="text-sm text-gray-500">
                              <span className="text-neutral-700 font-semibold">
                                {reply?.author?.name}
                              </span>{" "}
                              -{" "}
                              {reply?.createdAt
                                ? formatDistanceToNow(
                                    new Date(reply?.createdAt),
                                    { addSuffix: true }
                                  )
                                : "Just now"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply form */}
                  {replyingTo === comment._id && (
                    <form
                      onSubmit={replyHandleSubmit((data) =>
                        onSubmitReply(data, comment._id)
                      )}
                      className="mt-4"
                    >
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 outline-none resize-none bg-gray-100 focus:bg-white transition duration-200 ease-in-out"
                        rows="3"
                        placeholder="Write a reply..."
                        {...replyRegister("reply", {
                          required: "Reply is required",
                          minLength: {
                            value: 3,
                            message: "Reply must be at least 3 characters long",
                          },
                        })}
                      ></textarea>
                      {replyErrors.reply && (
                        <p className="text-red-500 text-sm mt-1">
                          {replyErrors.reply.message}
                        </p>
                      )}
                      <button
                        type="submit"
                        className="mt-2 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                      >
                        Post Reply
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this comment?"
        />
      )}
    </div>
  );
};

export default CommentSection;
