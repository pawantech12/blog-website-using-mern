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
    path: "/login",
    element: <App element={<Login />} />,
  },
  {
    path: "/blog-post/:blogId",
    element: <App element={<BlogDetails />} />,
  },
  {
    path: "/dashboard",
    element: <App element={<Dashboard element={<AdminHome />} />} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
