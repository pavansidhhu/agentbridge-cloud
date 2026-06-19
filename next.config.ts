import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow tunnel URLs for dev testing (localtunnel, ngrok, etc.)
  allowedDevOrigins: [
    'cold-radios-throw.loca.lt',
    '*.loca.lt',
    '*.ngrok.io',
    '*.ngrok-free.app',
    '*.tunnel.app',
  ],
};

export default nextConfig;
