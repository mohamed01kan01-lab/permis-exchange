import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { IconCircleCheck } from "@tabler/icons-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TransitionLink } from "@/components/site/TransitionLink";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demande.confirmation" });
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function ConfirmationPage({
  searchParams,
}: PageProps<"/[locale]/demande/confirmation">) {
  const { ref } = await searchParams;
  const t = await getTranslations("demande.confirmation");

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/10">
            <IconCircleCheck className="size-9 text-accent" aria-hidden />
          </span>
          <h1 className="mt-6 text-3xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>

          {ref && (
            <p className="mt-6 rounded-lg border border-border bg-card px-4 py-3 font-mono text-sm text-foreground">
              {t("reference")}: {ref}
            </p>
          )}

          <TransitionLink
            href="/"
            className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
          >
            {t("backHome")}
          </TransitionLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
