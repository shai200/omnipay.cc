import type { NextConfig } from "next";

// Static export for Firebase Hosting preview channels until App Hosting
// IAM is granted to the agent SA (serviceusage 403 on firebaseapphosting).
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
