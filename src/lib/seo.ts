import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const OG_LOCALE_MAP: Record<string, string> = {
  fr: "fr_FR",
  en: "en_US",
  it: "it_IT",
};

/**
 * Construit canonical + hreflang pour un chemin donné (ex: "/demande"),
 * décliné sur toutes les locales supportées.
 */
export function buildAlternates(path: string, locale: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `${APP_URL}/${l}${path}`;
  }
  languages["x-default"] = `${APP_URL}/${routing.defaultLocale}${path}`;

  return {
    canonical: `${APP_URL}/${locale}${path}`,
    languages,
  };
}
