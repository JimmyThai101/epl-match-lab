import type { Metadata } from "next";
import { DEFAULT_SHARE, ogImagePath, type ShareSearch } from "@/lib/share";
import { shareCardFromSearch } from "@/lib/share-data";

function twitterAndOg(title: string, description: string, image: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "EPL Match Lab",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function homeMetadata(): Metadata {
  return twitterAndOg(DEFAULT_SHARE.title, DEFAULT_SHARE.description, ogImagePath({}));
}

export async function labMetadata(search: ShareSearch): Promise<Metadata> {
  const card = await shareCardFromSearch(search);
  return twitterAndOg(card.title, card.description, ogImagePath(search));
}
