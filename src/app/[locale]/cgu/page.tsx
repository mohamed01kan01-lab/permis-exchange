import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageLayout, LegalSection } from "@/components/legal/LegalPageLayout";

const SECTION_KEYS = [
  "purpose",
  "acceptance",
  "service",
  "obligations",
  "liability",
  "pricing",
  "law",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.terms");
  return { title: t("metaTitle") };
}

export default async function CguPage() {
  const t = await getTranslations("legal.terms");
  const tLegal = await getTranslations("legal");

  return (
    <LegalPageLayout title={t("title")} lastUpdated={tLegal("lastUpdated")}>
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
