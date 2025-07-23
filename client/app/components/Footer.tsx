import Link from "next/link";
import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer>
      {/* Divider */}
      <div className="border border-[#ffffff1e] dark:border-[#ffffff1e]" />
      <br />

      <div className="w-[95%] 800px:w-full 800px:max-w-[85%] mx-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              About
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/courses"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/course-dashboard"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  Course Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              Social Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://www.youtube.com/watch?v=VeVahOuZIr8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/raza-ur-rehman-6525472a6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Raza181261"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2190ff]"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              Newsletter
            </h3>
            <p className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3]">
              Stay updated with new courses and tips! Subscribe to our
              newsletter.
            </p>
            <form className="mt-3">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full bg-transparent border rounded h-[40px] px-2 outline-none mt-[10px] font-Poppins"
              />
              <button
                type="submit"
                className="flex justify-center items-center py-3 px-6 rounded-full cursor-pointer bg-[#2190ff] text-white font-semibold text-[16px] mt-4 w-full 800px:w-[150px]"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <br />
        <p className="text-center text-black dark:text-white">
          Copyright © 2025 ELearning | All Rights Reserved
        </p>
      </div>
      <br />
    </footer>
  );
};

export default Footer;
