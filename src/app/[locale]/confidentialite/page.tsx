import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

const SECTION_KEYS = [
  "controller",
  "data",
  "purpose",
  "legalBasis",
  "recipients",
  "retention",
  "rights",
  "security",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.privacy");
  return { title: t("metaTitle") };
}

export default async function ConfidentialitePage() {
  const t = await getTranslations("legal.privacy");
  const tLegal = await getTranslations("legal");

  return (
    <LegalPageLayout
      title={t("title")}
      lastUpdated={tLegal("lastUpdated")}
      intro={t("intro")}
    >
      {SECTION_KEYS.map((key) => (
        <LegalSection
          key={key}
          title={t(`sections.${key}.title`)}
          body={t(`sections.${key}.body`)}
        />
      ))}
    </LegalPageLayout>
  );
}
