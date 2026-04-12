import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solarviewer",
  description: "An interactive solar system scene built with Next.js and React Three Fiber."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
