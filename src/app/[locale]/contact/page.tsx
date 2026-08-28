import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { IconMail, IconMapPin, IconClock, IconPhone } from "@tabler/icons-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TransitionLink } from "@/components/site/TransitionLink";
import { buildAlternates } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/contact", locale),
    openGraph: { title: t("title"), description: t("description") },
    twitter: { title: t("title"), description: t("description") },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const settings = await getSiteSettings();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                {t("eyebrow")}
              </p>
              <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
                {t("title")}
              </h1>
              <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>

              <dl className="mt-10 flex flex-col gap-6">
                {settings?.contactEmail && (
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <IconMail className="size-5" stroke={1.75} aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs text-muted-foreground">{t("emailLabel")}</dt>
                      <dd>
                        <a
                          href={`mailto:${settings.contactEmail}`}
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          {settings.contactEmail}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}

                {settings?.contactPhone && (
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <IconPhone className="size-5" stroke={1.75} aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs text-muted-foreground">{t("phoneLabel")}</dt>
                      <dd>
                        <a
                          href={`tel:${settings.contactPhone}`}
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          {settings.contactPhone}
                        </a>
                      </dd>
                    </div>
                  </div>
                )}

                {settings?.contactAddress && (
                  <div className="flex items-start gap-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <IconMapPin className="size-5" stroke={1.75} aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs text-muted-foreground">{t("addressLabel")}</dt>
                      <dd className="text-sm font-medium text-foreground">
                        {settings.contactAddress}
                      </dd>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <IconClock className="size-5" stroke={1.75} aria-hidden />
                  </span>
                  <div>
                    <dt className="text-xs text-muted-foreground">{t("hoursLabel")}</dt>
                    <dd className="text-sm font-medium text-foreground">
                      {t("hoursValue")}
                    </dd>
                  </div>
                </div>
              </dl>

              <TransitionLink
                href="/questionnaire"
                className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-shadow hover:shadow-lg hover:shadow-primary/30"
              >
                {t("cta")}
              </TransitionLink>
            </div>

            {settings?.contactAddress && (
              <div className="overflow-hidden rounded-2xl border border-border">
                <iframe
                  title={t("mapTitle")}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(settings.contactAddress)}&output=embed`}
                  className="h-80 w-full lg:h-full lg:min-h-100"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
