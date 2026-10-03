/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source:
          "/:category(house-manager|nurse|physiotherapist|nurse-aide-or-assistant|special-need-caregivers|home-health-assistant)",
        destination: "/specialist?category=:category",
      },
      {
        source:
          "/specialist/:category(house-manager|nurse|physiotherapist|nurse-aide-or-assistant|special-need-caregivers|home-health-assistant)",
        destination: "/specialist?category=:category",
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "emhealth.org",
      },
      {
        protocol: "https",
        hostname: "static.tildacdn.com",
      },
      {
        protocol: "https",
        hostname: "servannacare.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "t3.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "cervannacare.testorbis.com",
      },
      {
        protocol: "https",
        hostname: "backend.cervannacare.com",
      },
      {
        protocol: "https",
        hostname: "cervannacare.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "192.168.68.25",
      },
    ],
  },
};

export default nextConfig;
