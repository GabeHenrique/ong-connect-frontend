import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: [
      "placehold.co",
      "www.google.com.br",
      "ong-connect.s3.us-east-1.amazonaws.com",
      "iefmybeqnivniklaxpbo.supabase.co"
    ],
    dangerouslyAllowSVG: true,
  },
  transpilePackages: ['antd', '@ant-design', 'rc-util', 'rc-pagination', 'rc-picker', 'rc-input'],
};

export default nextConfig;
