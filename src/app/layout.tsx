import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carta — Menú digital para tu restaurante",
  description:
    "Menú digital QR para restaurantes colombianos. Un producto de New Tech Industries.",
  applicationName: "Carta",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Carta" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121216",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
