import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Frank Llonch - Mathematical Engineer",
  description:
    "Barcelona-born engineering student building data systems, AI tools, and clean interfaces.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}