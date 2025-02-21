import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ["placehold.co", "www.google.com.br", "ong-connect.s3.us-east-2.amazonaws.com"],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
