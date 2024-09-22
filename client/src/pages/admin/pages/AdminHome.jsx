import React from "react";
import { BsBarChartLineFill } from "react-icons/bs";
import { FaFileAlt, FaHeart } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

const AdminHome = () => {
  return (
    <section className="grid grid-cols-4 gap-8 my-[3rem]">
      <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
        <figure className="bg-emerald-100 rounded-md p-4">
          <FaUserGroup className="w-10 h-10 text-emerald-500" />
        </figure>
        <div>
          <h3 className="text-2xl font-semibold">134k</h3>
          <span className="text-sm font-semibold text-gray-600">Pageviews</span>
        </div>
      </div>
      <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
        <figure className="bg-blue-100 rounded-md p-4">
          <FaFileAlt className="w-10 h-10 text-blue-600" />
        </figure>
        <div>
          <h3 className="text-2xl font-semibold">134k</h3>
          <span className="text-sm font-semibold text-gray-600">Posts</span>
        </div>
      </div>
      <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
        <figure className="bg-red-100 rounded-md p-4">
          <FaHeart className="w-10 h-10 text-red-500" />
        </figure>
        <div>
          <h3 className="text-2xl font-semibold">134k</h3>
          <span className="text-sm font-semibold text-gray-600">Likes</span>
        </div>
      </div>
      <div className="flex gap-4 items-center border border-gray-200 rounded-xl p-4">
        <figure className="bg-blue-100 rounded-md p-4">
          <BsBarChartLineFill className="w-10 h-10 text-blue-500" />
        </figure>
        <div>
          <h3 className="text-2xl font-semibold">134k</h3>
          <span className="text-sm font-semibold text-gray-600">Visitors</span>
        </div>
      </div>
    </section>
  );
};

export default AdminHome;
