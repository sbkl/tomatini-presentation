import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tomatini",
    short_name: "Tomatini",
    description: "LPM training platform brief.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    scope:
      process.env.VERCEL_ENV === "production"
        ? "https://tomatini.sbkl.ltd"
        : "http://localhost:3000",
    related_applications: [
      {
        platform: "webapp",
        url:
          process.env.VERCEL_ENV === "production"
            ? "https://tomatini.sbkl.ltd/manifest.json"
            : "http://www.localhost:3000/manifest.json",
      },
    ],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16",
        type: "image/x-icon",
      },
      {
        src: "/assets/favicon-196.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/assets/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
