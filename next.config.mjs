/** @type {import('next').NextConfig} */
import { config } from 'dotenv';
config(); // Load environment variables from .env file

const nextConfig = {
    env: {
    API_KEY: process.env.API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },
};
// module.exports = {
//   env: {
//     API_KEY: process.env.API_KEY,
//     MONGODB_URI: process.env.MONGODB_URI,

//   },
// };

export default nextConfig;
