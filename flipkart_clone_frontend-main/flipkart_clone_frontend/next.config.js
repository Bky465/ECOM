/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['/home/nte-590-vm/'],
  }
}

module.exports = nextConfig
