/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/mbti',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
