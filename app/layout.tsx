import type { Metadata } from "next";
import "./globals.css";
import Loader from "@/components/loader";

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
      <head>
        {/* The first sprite gates the intro animation, so fetch it with the document. */}
        <link rel="preload" as="image" href="/loader/car-00.webp" type="image/webp" />
        {/* The overlay is removed by its own script; without JS it must not trap the page. */}
        <noscript>
          <style>{`#intro-loader{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <Loader />
        {children}
      </body>
    </html>
  );
}
