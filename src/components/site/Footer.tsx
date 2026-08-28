import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { IconMail, IconPhone, IconMapPin } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const t = await getTranslations("common.footer");
  const nav = await getTranslations("common.nav");
  const tContact = await getTranslations("contact");
  const settings = await getSiteSettings();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <span className="flex size-8 overflow-hidden rounded-lg">
              <Image src="/logo.png" alt="" width={32} height={32} className="size-full object-cover" />
            </span>
            {t("company")}
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {t("tagline")}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("linksTitle")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="#comment-ca-marche" className="hover:text-foreground">
                {nav("howItWorks")}
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-foreground">
                {nav("services")}
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-foreground">
                {nav("faq")}
              </a>
            </li>
            <li>
              <Link href="/questionnaire" className="hover:text-foreground">
                {nav("cta")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-foreground">
                {nav("contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("legalTitle")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/confidentialite" className="hover:text-foreground">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/cgu" className="hover:text-foreground">
                {t("terms")}
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-foreground">
                {t("legalNotice")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("contactTitle")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {settings?.contactEmail && (
              <li>
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <IconMail className="size-4 shrink-0" stroke={1.75} aria-hidden />
                  {settings.contactEmail}
                </a>
              </li>
            )}
            {settings?.contactPhone && (
              <li>
                <a
                  href={`tel:${settings.contactPhone}`}
                  className="flex items-center gap-2 hover:text-foreground"
                >
                  <IconPhone className="size-4 shrink-0" stroke={1.75} aria-hidden />
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {settings?.contactAddress && (
              <li className="flex items-start gap-2">
                <IconMapPin className="mt-0.5 size-4 shrink-0" stroke={1.75} aria-hidden />
                <span>{settings.contactAddress}</span>
              </li>
            )}
            {!settings?.contactEmail && !settings?.contactPhone && !settings?.contactAddress && (
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  {tContact("cta")}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {t("company")} — {t("rights")}
      </div>
    </footer>
  );
}
