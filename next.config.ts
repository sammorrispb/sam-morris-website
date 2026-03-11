import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        source: "/programs/tournaments",
        destination: "https://tournamentwebsite.vercel.app/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
