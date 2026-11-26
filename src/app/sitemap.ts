import type { MetadataRoute } from "next";
import { SITE_URL, UPDATED } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(UPDATED);
  const both = (ko: string, ja: string) => ({ languages: { ko: `${SITE_URL}${ko}`, ja: `${SITE_URL}${ja}` } });
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1, alternates: both("/", "/ja") },
    { url: `${SITE_URL}/ja`, lastModified, changeFrequency: "weekly", priority: 0.8, alternates: both("/", "/ja") },
    { url: `${SITE_URL}/reserve`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/ja/notify`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2, alternates: both("/privacy", "/ja/privacy") },
    { url: `${SITE_URL}/ja/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2, alternates: both("/privacy", "/ja/privacy") },
  ];
}
