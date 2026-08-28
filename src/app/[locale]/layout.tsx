import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Poppins, Open_Sans } from "next/font/google";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { ContactWidget } from "@/components/site/ContactWidget";
import { APP_URL, OG_LOCALE_MAP, buildAlternates } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const METADATA_BY_LOCALE: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  fr: {
    title: "Permis-Exchange",
    description:
      "Conversion de votre permis de conduire étranger en permis italien, gérée pour vous : connexion directe EUCARIS et Motorizzazione Civile, délais raccourcis, zéro rejet de dossier.",
    keywords: [
      "conversion permis de conduire italien",
      "échanger permis étranger Italie",
      "Motorizzazione Civile",
      "EUCARIS",
      "permis de conduire immigré Italie",
      "conversion patente straniera",
    ],
  },
  en: {
    title: "Permis-Exchange",
    description:
      "Converting your foreign driving licence into an Italian one, handled for you: direct connection to EUCARIS and the Motorizzazione Civile, faster processing, zero rejections.",
    keywords: [
      "convert foreign driving licence Italy",
      "Italian driving licence conversion",
      "Motorizzazione Civile",
      "EUCARIS",
      "exchange driving licence Italy",
      "foreign licence to Italian licence",
    ],
  },
  it: {
    title: "Conversione patente straniera",
    description:
      "Conversione della tua patente di guida straniera in patente italiana, gestita per te: connessione diretta a EUCARIS e alla Motorizzazione Civile, tempi più rapidi, zero rifiuti.",
    keywords: [
      "conversione patente straniera",
      "conversione patente italiana",
      "Motorizzazione Civile",
      "EUCARIS",
      "scambio patente Italia",
      "patente estera in patente italiana",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = METADATA_BY_LOCALE[locale] ?? METADATA_BY_LOCALE[routing.defaultLocale];
  const ogLocale = OG_LOCALE_MAP[locale] ?? OG_LOCALE_MAP[routing.defaultLocale];

  return {
    metadataBase: new URL(APP_URL),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: buildAlternates("", locale),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${APP_URL}/${locale}`,
      siteName: meta.title,
      locale: ogLocale,
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE_MAP[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const settings = await getSiteSettings();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        poppins.variable,
        openSans.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <NextIntlClientProvider>
            {children}
            <ContactWidget
              email={settings?.contactEmail ?? null}
              whatsappPhone={settings?.contactPhone ?? null}
            />
            <Toaster position="top-center" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
