import React from "react";
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

const Contact = () => {
  return (
    <>
      <section className="">
        <div className="flex justify-center items-center bg-custom-exlight-orange py-24">
          <span className="bg-custom-light-orange rounded-md px-4 py-2 text-base font-medium">
            <Link to="/">Home</Link> /{" "}
            <Link to="/contact-us" className="text-orange-400">
              Contact Us
            </Link>
          </span>
        </div>
      </section>
      <section className="flex gap-4 justify-evenly">
        {[1, 2, 3].map((item) => (
          <div key={item}>
            <div>
              <figure>
                <img src={office1} alt="office image" />
                <span>Head Quater</span>
              </figure>
            </div>
            <div>
              <ul>
                <li>
                  <MdOutlinePhoneInTalk />
                  <span>(00) 111 222 1111</span>
                </li>
                <li>
                  <HiOutlineMail />
                  <span>infoofbunzon@gmial.com</span>
                </li>
                <li>
                  <GrLocation />
                  <span>845 Central Ave Hamilton, Ohio(OH), 45011</span>
                </li>
              </ul>
              <h4>Connect With Us:</h4>
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
    </>
  );
};

export default Contact;
