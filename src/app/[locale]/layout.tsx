import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Poppins, Open_Sans } from "next/font/google";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/site/ThemeProvider";
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

const METADATA_BY_LOCALE: Record<string, Metadata> = {
  fr: {
    title: "Permis-Exchange",
    description:
      "Conversion de votre permis de conduire étranger en permis italien, gérée pour vous : connexion directe EUCARIS et Motorizzazione Civile, délais raccourcis, zéro rejet de dossier.",
  },
  en: {
    title: "Permis-Exchange",
    description:
      "Converting your foreign driving licence into an Italian one, handled for you: direct connection to EUCARIS and the Motorizzazione Civile, faster processing, zero rejections.",
  },
  it: {
    title: "Conversione patente straniera",
    description:
      "Conversione della tua patente di guida straniera in patente italiana, gestita per te: connessione diretta a EUCARIS e alla Motorizzazione Civile, tempi più rapidi, zero rifiuti.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return METADATA_BY_LOCALE[locale] ?? METADATA_BY_LOCALE[routing.defaultLocale];
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
            <Toaster position="top-center" />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
