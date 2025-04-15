// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains: ['res.cloudinary.com','randomuser.me']
  },
  experimental: {
    turbo: false, // Disable Turbopack
  },
};

module.exports = nextConfig;
