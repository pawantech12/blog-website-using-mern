import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Contact from "./pages/Contact.jsx";
import Category from "./pages/Category.jsx";
import CategoryPosts from "./pages/CategoryPosts.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminHome from "./pages/admin/pages/AdminHome.jsx";
import PostList from "./pages/admin/pages/PostList.jsx";
import CreateBlogPost from "./pages/admin/pages/CreateBlogPost.jsx";
import Profile from "./pages/Profile.jsx";
import { AuthProvider } from "./store/Authentication.jsx";
import UpdateBlogPost from "./pages/admin/pages/UpdateBlogPost.jsx";
import CategoryPage from "./pages/admin/pages/CategoryPage.jsx";
import UserProfile from "./pages/admin/pages/UserProfile.jsx";
import EditProfile from "./pages/admin/pages/EditProfile.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast
import VerifyCode from "./components/VerifyCode.jsx";
import Setting from "./pages/admin/pages/Setting.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App element={<Home />} />,
  },
  {
    path: "/about-us",
    element: <App element={<AboutUs />} />,
  },
  {
    path: "/contact-us",
    element: <App element={<Contact />} />,
  },
  {
    path: "/category",
    element: <App element={<Category />} />,
  },
  {
    path: "/category/:categoryId",
    element: <App element={<CategoryPosts />} />,
  },
  {
    path: "/register",
    element: <App element={<Register />} />,
  },
  {
    path: "/verify-otp",
    element: <App element={<VerifyCode />} />,
  },
  {
    path: "/login",
    element: <App element={<Login />} />,
  },
  {
    path: "/forgot-password",
    element: <App element={<ForgotPassword />} />,
  },
  {
    path: "/password-reset/:token",
    element: <App element={<ResetPassword />} />,
  },
  {
    path: "/blog-post/:blogId",
    element: <App element={<BlogDetails />} />,
  },
  {
    path: "/dashboard",
    element: <App element={<Dashboard element={<AdminHome />} />} />,
  },
  {
    path: "/dashboard/post-list",
    element: <App element={<Dashboard element={<PostList />} />} />,
  },
  {
    path: "/dashboard/create-post",
    element: <App element={<Dashboard element={<CreateBlogPost />} />} />,
  },
  {
    path: "/dashboard/category",
    element: <App element={<Dashboard element={<CategoryPage />} />} />,
  },
  {
    path: "/dashboard/update-post/:blogId",
    element: <App element={<Dashboard element={<UpdateBlogPost />} />} />,
  },
  {
    path: "/dashboard/user-profile",
    element: <App element={<Dashboard element={<UserProfile />} />} />,
  },
  {
    path: "/dashboard/edit-profile",
    element: <App element={<Dashboard element={<EditProfile />} />} />,
  },
  {
    path: "/dashboard/settings",
    element: <App element={<Dashboard element={<Setting />} />} />,
  },
  {
    path: "/user/profile/:userId",
    element: <App element={<Profile />} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right" // Set position to bottom-right
        autoClose={3000} // Automatically close after 5 seconds
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Display newest on top
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  </React.StrictMode>
);
