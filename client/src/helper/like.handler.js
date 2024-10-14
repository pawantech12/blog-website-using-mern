import axios from "axios";
// Helper function for liking/unliking a blog post
console.log("token", localStorage.getItem("token"));
export const likeBlog = async (blogId) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/blog/${blogId}/like`,
      {}, // Send an empty object as the body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      // Return the updated likes count
      return { success: true, likes: response.data.likes };
    }
    console.log("response", response);
  } catch (error) {
    console.error("Error in handling like:", error);
    return { success: false, message: error };
  }
};
export const unLikeBlog = async (blogId) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/blog/${blogId}/unlike`,
      {}, // Send an empty object as the body
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      // Return the updated likes count
      return { success: true, likes: response.data.likes };
    }
    console.log("response", response);
  } catch (error) {
    console.error("Error in handling unlike:", error);
    return { success: false, message: error.message };
  }
};
