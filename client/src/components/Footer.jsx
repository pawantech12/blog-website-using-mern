import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import LogoWhite from "../img/logo-white.webp";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-custom-black p-20">
      <div>
        {/* top content  */}
        <div>
          <figure>
            <img src={LogoWhite} alt="Bunzo blog logo" />
          </figure>
          <p className="text-white">
            Lorem Ipsum is simply dummy text of the industry orem Ipsum has been
            the industry&apos;s since the when unknown.
          </p>
          <ul className="flex items-center gap-3 text-sm text-white">
            <li className="bg-custom-lightBlack p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaFacebookF />
            </li>
            <li className="bg-custom-lightBlack p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaTwitter />
            </li>
            <li className="bg-custom-lightBlack p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
              <FaInstagram />
            </li>
            <li className="bg-custom-lightBlack p-3 rounded-md cursor-pointer hover:bg-orange-200 transition-all ease-in-out duration-200">
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
              className="bg-custom-lightBlack text-white h-14 px-5 rounded-lg outline-none placeholder:text-white"
              placeholder="Your Name"
            />
            <input
              type="email"
              name="email"
              id="email"
              className="bg-custom-lightBlack text-white h-14 px-5 rounded-lg outline-none placeholder:text-white"
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
        <div>
          {/* links list */}
          <div>
            <h4 className="text-xl font-medium text-white">Company</h4>
            <ul className="text-white">
              <li>
                <Link>About Us</Link>
              </li>
              <li>
                <Link>Contact Us</Link>
              </li>
              <li>
                <Link>Local Print Ads</Link>
              </li>
              <li>
                <Link>FAQ&apos;s</Link>
              </li>
              <li>
                <Link>Careers</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>{/* bottom content  */}</div>
    </footer>
  );
};

export default Footer;
