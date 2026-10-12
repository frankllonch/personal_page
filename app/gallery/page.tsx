import type { Metadata } from "next";
import Gallery from "@/components/gallery/gallery";
import { loadArtworks } from "@/lib/artwork";

export const metadata: Metadata = {
  title: "Gallery — Frank Llonch",
  description: "Paintings, drawings and animations by Frank Llonch.",
};

/**
 * The gallery page. A Server Component: the artwork list is read and the
 * images measured here, at build time, and only the finished records reach the
 * client. To add a work, see content/artwork.json.
 */
export default async function GalleryPage() {
  const items = await loadArtworks();
  return <Gallery items={items} />;
}
