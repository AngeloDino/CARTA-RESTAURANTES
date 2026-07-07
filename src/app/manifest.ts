import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Carta — Menú digital para tu restaurante",
    short_name: "Carta",
    description:
      "Menú digital QR para restaurantes colombianos.",
    start_url: "/",
    display: "standalone",
    background_color: "#121216",
    theme_color: "#d4a853",
    lang: "es",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
