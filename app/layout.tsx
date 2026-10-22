import type { Metadata } from "next";
import "./globals.css";
import Loader from "@/components/loader";
import TopBar from "@/components/top-bar";

export const metadata: Metadata = {
  title: "Frank Llonch — Mathematical Engineer",
  description:
    "Mathematical engineer from Barcelona building data systems, AI tools and the occasional pointless app.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <TopBar />
        {children}
      </body>
    </html>
  );
}
