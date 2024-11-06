import React, { useState } from "react";
import { Link } from "react-router-dom";
import office1 from "../img/office-01.webp";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/contact`,
        data
      );
      console.log(response.data.message); // Handle success response
      toast.success("Your message has been sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24 max-sm:py-8">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> /{" "}
            <Link to="/contact-us" className="text-orange-400">
              Contact Us
            </Link>
          </span>
        </div>
      </section>
      <section className="flex flex-wrap gap-4 justify-evenly mt-[5rem] px-24 max-sm:px-5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex flex-col gap-8 group max-lg:w-full">
            <div className="bg-custom-exlight-orange flex flex-col items-center justify-center p-6 rounded-xl">
              <figure className="relative">
                <img src={office1} alt="office image" />
                <span className="bg-custom-light-black px-7 py-3 rounded-md text-white text-[15px] font-medium absolute bottom-[8%] left-[28%] group-hover:bg-custom-orange transition-all ease-in-out duration-300">
                  Head Quater
                </span>
              </figure>
            </div>
            <div className="border border-gray-200 hover:border-custom-orange transition-all ease-in-out duration-200 rounded-xl p-8 flex flex-col gap-4">
              <ul className="flex flex-col gap-4">
                <li className="flex items-center gap-3">
                  <span className="bg-custom-exlight-orange rounded-xl text-custom-black/80 p-3 text-2xl">
                    <MdOutlinePhoneInTalk />
                  </span>
                  <span className="font-medium">(00) 111 222 1111</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-custom-exlight-orange rounded-xl text-custom-black/80 p-3 text-2xl">
                    <HiOutlineMail />
                  </span>
                  <span className="font-medium">infoofbunzon@gmial.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="bg-custom-exlight-orange rounded-xl text-custom-black/80 p-3 text-2xl">
                    <GrLocation />
                  </span>
                  <span className="text-gray-600 text-sm font-medium">
                    845 Central Ave Hamilton, Ohio(OH), 45011
                  </span>
                </li>
              </ul>
              <h4 className="text-custom-black text-lg font-semibold">
                Connect With Us:
              </h4>
              <ul className="flex items-center gap-3 text-sm">
                <li className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                  <FaFacebookF />
                </li>
                <li className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                  <FaTwitter />
                </li>
                <li className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                  <FaInstagram />
                </li>
                <li className="bg-zinc-200 p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
                  <FaLinkedinIn />
                </li>
              </ul>
            </div>
          </div>
        ))}
      </section>
      <section className="my-[5rem] flex justify-around gap-5 items-center px-24 max-lg:flex-col max-lg:gap-8 max-sm:px-5">
        <div className="w-2/5 max-lg:w-full">
          <h4 className="text-4xl text-custom-black font-semibold">
            Get In Touch
          </h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-[2rem] "
          >
            {/* Name Input */}
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Name"
              className="bg-custom-exlight-orange px-6 py-1 border border-custom-light-orange rounded-lg h-12 placeholder:text-custom-black/80 placeholder:text-sm placeholder:font-medium focus:border-custom-orange outline-none transition-all ease-in-out duration-200"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}

            {/* Email Input */}
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="Email"
              className="bg-custom-exlight-orange px-6 py-1 border border-custom-light-orange rounded-lg h-12 placeholder:text-custom-black/80 placeholder:text-sm placeholder:font-medium focus:border-custom-orange outline-none transition-all ease-in-out duration-200"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}

            {/* Phone Input */}
            <input
              type="text"
              {...register("phone", { required: "Phone number is required" })}
              placeholder="Phone"
              className="bg-custom-exlight-orange px-6 py-1 border border-custom-light-orange rounded-lg h-12 placeholder:text-custom-black/80 placeholder:text-sm placeholder:font-medium focus:border-custom-orange outline-none transition-all ease-in-out duration-200"
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )}

            {/* Message Textarea */}
            <textarea
              {...register("message", { required: "Message is required" })}
              placeholder="Message"
              rows="8"
              className="bg-custom-exlight-orange px-6 py-2 border border-custom-light-orange rounded-lg placeholder:text-custom-black/80 placeholder:text-sm placeholder:font-medium focus:border-custom-orange outline-none transition-all ease-in-out duration-200"
            ></textarea>
            {errors.message && (
              <span className="text-red-500">{errors.message.message}</span>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-300 hover:bg-orange-400 text-custom-black hover:text-white flex items-center gap-2 text-[15px] transition-all ease-in-out duration-200 py-4 font-medium px-6 rounded-lg w-fit"
            >
              {isSubmitting ? "Sending..." : "Send Message"} <BsArrowRight />
            </button>
          </form>
        </div>
        <div className="w-1/2 max-lg:w-full h-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8660780195846!2d144.96623407530205!3d-37.816605734199506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato%20Pty%20Ltd!5e0!3m2!1sen!2sin!4v1726669131965!5m2!1sen!2sin"
            allowfullscreen=""
            className="border-0 w-full h-[500px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </>
  );
};

export default Contact;
