import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "./TransitionLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ScrollProgressBar } from "./ScrollProgressBar";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const t = useTranslations("common.nav");
  const tFooter = useTranslations("common.footer");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 font-heading text-sm font-semibold text-foreground sm:text-lg"
        >
          <span className="flex size-8 shrink-0 overflow-hidden rounded-lg">
            <Image src="/logo.png" alt="" width={32} height={32} className="size-full object-cover" />
          </span>
          <span className="truncate">{tFooter("company")}</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 lg:flex">
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
          <Link href="/contact" className="group relative py-1 hover:text-foreground">
            {t("contact")}
            <span className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100" />
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <LocaleSwitcher />
            <TransitionLink
              href="/questionnaire"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg hover:shadow-primary/20"
            >
              {t("cta")}
            </TransitionLink>
          </div>
          <MobileMenu />
        </div>
      </div>

      <ScrollProgressBar />
    </header>
  );
}
