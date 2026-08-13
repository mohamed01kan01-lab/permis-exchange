import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DemandeFormShell } from "@/components/demande/DemandeFormShell";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demande.meta" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: buildAlternates("/demande", locale),
    openGraph: { title: t("title"), description: t("subtitle") },
    twitter: { title: t("title"), description: t("subtitle") },
  };
}

export default function DemandePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={null}>
          <DemandeFormShell />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
