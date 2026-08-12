import { useTranslations } from "next-intl";
import { IconSteeringWheel } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "./TransitionLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const t = useTranslations("common.nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconSteeringWheel className="size-5" stroke={1.75} aria-hidden />
          </span>
          Permis-Exchange
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          <a href="#comment-ca-marche" className="group relative py-1 hover:text-foreground">
            {t("howItWorks")}
            <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
          </a>
          <a href="#services" className="group relative py-1 hover:text-foreground">
            {t("services")}
            <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
          </a>
          <a href="#faq" className="group relative py-1 hover:text-foreground">
            {t("faq")}
            <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LocaleSwitcher />
          <TransitionLink
            href="/demande"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg hover:shadow-primary/20 sm:inline-flex"
          >
            {t("cta")}
          </TransitionLink>
        </div>
      </div>

      <ScrollProgressBar />
    </header>
  );
}
