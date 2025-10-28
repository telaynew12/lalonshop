/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.ibb.co",
      "ctf-bucket-s3.s3.me-central-1.amazonaws.com",
      "ghorerbazar.com",
      "localhost",
      "lalon-shop-backend.onrender.com",
      "img.freepik.com",
      "www.xyz.lalonshopbd.com",
      "88.222.245.41", 
    ], // Add the domain here
    unoptimized: true
  },
};

export default nextConfig;
