import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'i.postimg.cc',
      'img.youtube.com',
    ],
  },
};

export default nextConfig;
