import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://insight-journal.example.com";
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/pricing`, lastModified },
    { url: `${base}/privacy`, lastModified },
    { url: `${base}/terms`, lastModified },
    { url: `${base}/dashboard`, lastModified },
    { url: `${base}/journal`, lastModified },
  ];
}


