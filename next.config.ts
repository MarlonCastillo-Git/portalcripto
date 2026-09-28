import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: ["192.168.0.17"],
images: {
remotePatterns: [
{ protocol: "https", hostname: "coin-images.coingecko.com", pathname: "/coins/images/**" },
{ protocol: "https", hostname: "assets.coingecko.com", pathname: "/coins/images/**" },
{ protocol: "https", hostname: "s2.coinmarketcap.com", pathname: "/static/img/coins/**" },
{ protocol: "https", hostname: "picsum.photos" },
{ protocol: "https", hostname: "fastly.picsum.photos" },
{ protocol: "https", hostname: "images.unsplash.com" },
],
},
};


export default nextConfig;
