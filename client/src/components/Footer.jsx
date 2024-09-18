import {
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import LogoWhite from "../img/logo-white.webp";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="">
      <div className="flex justify-evenly bg-custom-black p-20">
        {/* top content  */}
        <div className="w-1/4 flex flex-col gap-5">
          <figure>
            <img src={LogoWhite} alt="Bunzo blog logo" />
          </figure>
          <p className="text-white">
            Lorem Ipsum is simply dummy text of the industry orem Ipsum has been
            the industry&apos;s since the when unknown.
          </p>
          <ul className="flex items-center gap-3 text-sm text-white">
            <li className="bg-custom-light-black p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaFacebookF />
            </li>
            <li className="bg-custom-light-black p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaTwitter />
            </li>
            <li className="bg-custom-light-black p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaInstagram />
            </li>
            <li className="bg-custom-light-black p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaLinkedinIn />
            </li>
          </ul>
        </div>

        <div>
          {/* subscription form  */}
          <h4 className="text-xl font-medium text-white">Subscribe</h4>
          <form action="" className="flex flex-col gap-3 w-fit mt-5">
            <input
              type="text"
              name="name"
              id="name"
              className="bg-custom-light-black text-white h-14 px-5 rounded-lg outline-none placeholder:text-white"
              placeholder="Your Name"
            />
            <input
              type="email"
              name="email"
              id="email"
              className="bg-custom-light-black text-white h-14 px-5 rounded-lg outline-none placeholder:text-white"
              placeholder="Your Email Address"
            />
            <button
              type="submit"
              className="bg-orange-300 hover:bg-orange-400 hover:text-white transition-all ease-in-out duration-200 py-3 text-lg font-medium px-3 rounded-lg"
            >
              Subscribe Now
            </button>
          </form>
        </div>
        <div className="flex justify-evenly gap-10">
          {/* links list */}
          <div>
            <h4 className="text-xl font-medium text-white">Company</h4>
            <ul className="text-white mt-5 text-base flex flex-col gap-2">
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>About Us</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Contact Us</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Local Print Ads</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>FAQ&apos;s</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Careers</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-medium text-white">Quick Links</h4>
            <ul className="text-white mt-5 text-base flex flex-col gap-2">
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Privacy Policy</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Discussion</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Terms & conditions</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Customer Support</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Course FAQ&apos;s</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-medium text-white">Category</h4>
            <ul className="text-white mt-5 text-base  flex flex-col gap-2">
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Lifestyle</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Healthy</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Restaurant</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Travel tips</Link>
              </li>
              <li className="hover:text-orange-300 transition-all ease-in-out duration-200">
                <Link>Marketing</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-custom-light-black text-white text-center py-5 flex justify-between px-5">
        <p className="flex items-center text-[15px] font-medium">
          © 2024 <Link className="mx-2 text-orange-400">Bunzo</Link> . Made with{" "}
          <FaHeart className="mx-2 text-red-500" /> by Pawan Kumavat
        </p>
        <button className="bg-orange-300 hover:bg-orange-400 text-custom-black hover:text-white flex items-center gap-2 text-[15px] transition-all ease-in-out duration-200 py-3 font-medium px-3 rounded-lg">
          Share your thinking <BsArrowRight />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
