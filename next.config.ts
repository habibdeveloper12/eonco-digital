import type { NextConfig } from "next";

// Allow optimised images from the connected WordPress media library.
const wp = process.env.WORDPRESS_URL ? new URL(process.env.WORDPRESS_URL) : null;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: wp ? [{ protocol: wp.protocol.replace(":", "") as "https" | "http", hostname: wp.hostname, pathname: "/wp-content/uploads/**" }] : [],
  },
  // One canonical address for Google: www.takesolutiontoday.com → takesolutiontoday.com
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.takesolutiontoday.com" }], destination: "https://takesolutiontoday.com/:path*", permanent: true },
    ];
  },
  async headers() {
    return [
      // Long cache for static files that never change name
      { source: "/:file(favicon.svg|take-solution-today-company-deck.pdf)", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      { source: "/:path*", headers: [{ key: "X-Content-Type-Options", value: "nosniff" }, { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }] },
    ];
  },
};

export default nextConfig;
