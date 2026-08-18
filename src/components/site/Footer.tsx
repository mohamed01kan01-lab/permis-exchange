import { useTranslations } from "next-intl";
import { IconSteeringWheel } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("common.footer");
  const nav = useTranslations("common.nav");

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <IconSteeringWheel className="size-5" stroke={1.75} aria-hidden />
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
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} {t("company")} — {t("rights")}
      </div>
    </footer>
  );
}
