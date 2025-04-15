import Link from "next/link";
import React from "react";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer>
      <div className="border border-[#000000e] dark:border-[#ffffff1e]" />
      <br />
      <div className="w-[95%] 800px:w-full 800px:max-w-[85%] max-auto px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              About
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#2c4fffc6] dark:hover:text-[#fefffdd8]"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/courses"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="/course-dashboard"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]"
                >
                  Course Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
                Social Links
            </h3>
            <ul className="space-y-4">
            <li>
                <Link
                  href="/https://www.youtube.com/watch?v=VeVahOuZIr8&t=1359s"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]"
                >
                  You Tube
                </Link>
              </li>

              <li>
                <Link
                  href="/https://www.linkedin.com/in/raza-ur-rehman-6525472a6/"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]"
                >
                  LinkedIn
                </Link>
              </li>

              <li>
                <Link
                  href="/https://github.com/Raza181261"
                  className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]"
                >
                  GitHub
                </Link>
              </li>
            </ul>


          </div>

          <div className="space-y-3">
            <h3 className="text-[20px] font-[600] text-black dark:text-white">
                Contact Info
            </h3>
            <p className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]">
                Call Us: 1-885-237-2025
            </p>
            <p className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]">
                Address: +7001 vermart, New York, NY 10001
            </p>
            <p className="text-[16px] text-[#000000b3] dark:text-[#ffffffb3] hover:text-[#000000e] dark:hover:text-[#ffffffe]">
                Mail Us: abuosman559@gamil.com
            </p>
          </div>
        </div>
        <br />
        <p className="text-center text-black dark:text-white">
            Copyright © 2025 Elearning | All Right Reserved

        </p>
      </div>
      <br />
    </footer>
  );
};

export default Footer;
