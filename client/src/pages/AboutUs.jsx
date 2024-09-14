import React, { useState } from "react";
import { Link } from "react-router-dom";
import blog1 from "../img/blog1.webp";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <section className="">
      <div className="flex justify-center items-center bg-[#FAFAFA] py-24">
        <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
          <Link to="/">Home</Link> /{" "}
          <Link to="/about-us" className="text-orange-400">
            About Us
          </Link>
        </span>
      </div>

      <div className="w-full relative px-24 mt-16">
        <figure className="h-[500px]">
          <img
            src={blog1}
            alt=""
            className="rounded-xl h-full w-full object-cover"
          />
        </figure>
        <button
          onClick={openModal}
          className="absolute top-[45%] hover:bg-orange-400 transition-all ease-in-out duration-200 left-[46%] text-white bg-orange-300 p-5 rounded-full text-2xl border-2 border-white"
        >
          <FaPlay />
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-[70%] mx-auto">
            <button
              className="absolute -top-[10%] right-0 text-5xl text-white"
              onClick={closeModal} // Close modal on click
            >
              &times;
            </button>
            <ReactPlayer
              url="https://youtu.be/va0XcdDBGhI?si=eiymom8Fj68ti9Jf" // Replace with your video URL
              controls
              playing
              width="100%"
              height="500px"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutUs;
