import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { APP_URL } from "@/lib/seo";

const PATHS: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/questionnaire", priority: 0.9, changeFrequency: "monthly" },
  { path: "/demande", priority: 0.8, changeFrequency: "monthly" },
  { path: "/cgu", priority: 0.3, changeFrequency: "yearly" },
  { path: "/confidentialite", priority: 0.3, changeFrequency: "yearly" },
  { path: "/mentions-legales", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, changeFrequency } of PATHS) {
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = `${APP_URL}/${locale}${path}`;
    }
    languages["x-default"] = `${APP_URL}/${routing.defaultLocale}${path}`;

    for (const locale of routing.locales) {
      entries.push({
        url: `${APP_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      });
    }
  }

  return entries;
}
