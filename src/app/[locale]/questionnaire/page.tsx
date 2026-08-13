import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { QuestionnaireShell } from "@/components/prequalification/QuestionnaireShell";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "questionnaire.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/questionnaire", locale),
    openGraph: { title: t("title"), description: t("description") },
    twitter: { title: t("title"), description: t("description") },
  };
}

export default function QuestionnairePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <QuestionnaireShell />
      </main>
      <Footer />
    </>
  );
}
