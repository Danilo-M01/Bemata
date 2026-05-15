import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
      {
        source: "/o-nama",
        destination: "/o-nama.html",
      },
      {
        source: "/ketering",
        destination: "/ketering.html",
      },
      {
        source: "/usluge",
        destination: "/usluge.html",
      },
      {
        source: "/kontakt",
        destination: "/kontakt.html",
      },
      {
        source: "/lokacije",
        destination: "/lokacije.html",
      }
    ];
  },
};

export default nextConfig;
