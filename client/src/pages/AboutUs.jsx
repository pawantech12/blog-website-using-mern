import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import blog1 from "../img/blog1.webp";
import feature1 from "../img/feature-1.webp";
import testimonial1 from "../img/testimonial-1.webp";
import feature2 from "../img/feature-2.webp";
import aboutShare from "../img/about-share.webp";
import team2 from "../img/team-2.webp";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFacebookF,
  FaLinkedinIn,
  FaPlay,
  FaTwitter,
} from "react-icons/fa";
import ReactPlayer from "react-player";
import { BsArrowRight } from "react-icons/bs";
import Slider from "react-slick";

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 792,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  let sliderRef = useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };
  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> /{" "}
            <Link to="/about-us" className="text-orange-400">
              About Us
            </Link>
          </span>
        </div>
      </section>
      <section>
        <div className="w-full relative px-24 mt-16 max-sm:px-5">
          <figure className="h-[500px] max-sm:h-[250px]">
            <img
              src={blog1}
              alt=""
              className="rounded-xl h-full w-full object-cover"
            />
          </figure>
          <button
            onClick={openModal}
            className="absolute top-[45%] max-sm:top-[35%] max-sm:left-[40%] hover:bg-orange-400 transition-all ease-in-out duration-200 left-[48%] text-white bg-orange-300 p-5 rounded-full text-2xl border-2 border-white"
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
                url="https://youtu.be/dYakdOrjnZc" // Replace with your video URL
                controls
                playing
                width="100%"
                height="500px"
              />
            </div>
          </div>
        )}
      </section>
      <section>
        <div className="mt-[5rem] px-24 flex gap-5 max-lg:flex-col max-sm:px-5">
          <div className="bg-custom-exlight-orange p-10 w-[35%] flex flex-col max-lg:w-full gap-2 rounded-xl">
            <figure className="bg-custom-orange w-fit p-3 rounded-md">
              <img src={feature1} alt="Feature image" />
            </figure>
            <h4 className="text-2xl font-semibold text-custom-black">
              Open Platform
            </h4>
            <p className="text-sm leading-6">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry has been the industry&apos;s standard dummy text ever
              since the 1500s when an unknown printer took galley type and
              scrambled.
            </p>
            <p className="text-sm leading-6">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry has been the industry&apos;s standard.
            </p>
          </div>
          <div className="bg-custom-exlight-orange p-10 w-[63%] max-lg:w-full flex gap-3 rounded-xl max-xl:flex-col">
            <div className="w-1/2 flex flex-col gap-2 max-xl:w-full">
              <figure className="bg-custom-orange w-fit p-3 rounded-md">
                <img src={feature2} alt="Feature image" />
              </figure>
              <h4 className="text-2xl font-semibold text-custom-black">
                Digital Publishing
              </h4>
              <p className="text-sm leading-6">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry has been the industry&apos;s standard dummy text ever
                since the 1500s when an unknown printer took galley type and
                scrambled.
              </p>
              <p className="text-sm leading-6">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry has been the industry&apos;s standard.
              </p>
            </div>
            <div className="w-1/2 max-xl:w-full">
              <figure className="relative">
                <img
                  src={aboutShare}
                  alt="about share"
                  className="max-xl:w-full max-xl:h-full max-lg:h-[300px] object-cover max-lg:rounded-xl"
                />
                <button className="bg-orange-300 hover:bg-orange-400 text-custom-black hover:text-white flex items-center gap-2 text-[15px] transition-all ease-in-out duration-200 py-3 font-medium px-3 rounded-lg absolute bottom-[8%] left-[18%]">
                  Share your thinking <BsArrowRight />
                </button>
              </figure>
            </div>
          </div>
        </div>
      </section>
      <section className="px-24 mt-[5rem] max-sm:px-5">
        <div className="flex gap-5 border-y border-gray-200 max-lg:flex-col py-10">
          <div className="w-1/2 flex items-center justify-center text-center max-lg:w-full">
            <h2 className="text-5xl leading-[4rem]">
              You Can <span className="font-semibold">Read</span> And{" "}
              <span className="font-semibold">Write</span> With Bunzo.
            </h2>
          </div>
          <div className="w-1/2 flex flex-col max-lg:w-full max-lg:flex-row max-md:flex-col">
            <div className="flex flex-col gap-3 border-x max-lg:border border-gray-200 p-8 border-b">
              <h4 className="text-2xl font-semibold">Mission & Vission</h4>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text eve since the 1500 when an unknown printer took a
                galley type scrambled&apos;s make a type specimen book. It has
                survived not only five centuries also the leap into electronic
                typesetting.
              </p>
            </div>
            <div className="flex flex-col gap-3 border-x max-lg:border border-gray-200 p-8">
              <h4 className="text-2xl font-semibold">Bunzo History</h4>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text eve since the 1500 when an unknown printer took a
                galley type scrambled&apos;s make a type specimen book. It has
                survived not only five centuries also the leap into electronic
                typesetting.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-24 py-20 max-sm:px-5">
        <div className="flex flex-col gap-1 items-center text-center">
          <small className="font-semibold text-base">
            Meet Our Team Members
          </small>
          <h4 className="font-semibold text-4xl">
            Leadership & Experienced Team
          </h4>
        </div>
        <div className="grid grid-cols-4 max-xl:grid-cols-3 max-lg:grid-cols-2 max-md:grid-cols-1 gap-8 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              className="relative group w-full h-full overflow-hidden rounded-lg"
              key={i}
            >
              <img
                src={team2}
                alt="team image"
                className="object-cover w-full h-full rounded-lg"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
                {/* Social Icons */}
                <div className="flex gap-3 mt-5">
                  <a
                    href="#"
                    className="p-3 bg-white rounded-md text-sm text-black hover:bg-custom-black hover:text-white transition-colors duration-300"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="#"
                    className="p-3 bg-white rounded-md text-sm text-black hover:bg-custom-black hover:text-white transition-colors duration-300"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="#"
                    className="p-3 bg-white rounded-md text-sm text-black hover:bg-custom-black hover:text-white transition-colors duration-300"
                  >
                    <FaLinkedinIn />
                  </a>
                </div>
                {/* Name and Position */}
                <div className="p-5 text-center text-white">
                  <h3 className="text-xl font-semibold">Alexander</h3>
                  <p className="text-sm font-semibold text-custom-orange">
                    Founder
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="px-24 py-20 bg-custom-light-blue max-sm:px-5">
        <div className="flex flex-col gap-1 items-center text-center">
          <small className="font-semibold text-base">Some Testimonial</small>
          <h4 className="font-semibold text-4xl">What People Say About Us</h4>
        </div>
        <div className="mt-[3rem]">
          <div className="relative w-full">
            <div className="">
              <Slider
                ref={(slider) => {
                  sliderRef = slider;
                }}
                {...settings}
              >
                {[1, 2, 3, 4, 5, 6].map((testimonial, index) => (
                  <div
                    key={index}
                    className="p-7 w-full bg-white space-y-3 rounded-xl "
                  >
                    <div className="flex gap-2 items-center">
                      <figure>
                        <img src={testimonial1} alt="" />
                      </figure>
                      <div>
                        <h5 className="font-semibold text-lg">
                          Sherika Hankins
                        </h5>
                        <span className="font-medium text-custom-orange uppercase text-xs">
                          founder
                        </span>
                      </div>
                    </div>
                    <hr />
                    <h4 className="text-lg font-semibold">
                      Printer took a galley of type and scrambled to make book.
                    </h4>
                    <p className="text-sm leading-[1.5rem]">
                      Lorem has been the industry standard dummy text.
                    </p>
                  </div>
                ))}
              </Slider>
            </div>

            <div className="mt-[2rem] flex justify-center gap-3">
              <button
                onClick={previous}
                className="bg-custom-orange outline-none text-white p-4 text-base rounded-full"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={next}
                className="bg-custom-orange outline-none text-white p-4 text-base rounded-full"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
