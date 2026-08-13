"use client";

import { useTranslations } from "next-intl";
import { IconMenu } from "@tabler/icons-react";
import { TransitionLink } from "./TransitionLink";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "#comment-ca-marche", key: "howItWorks" },
  { href: "#services", key: "services" },
  { href: "#faq", key: "faq" },
] as const;

export function MobileMenu() {
  const t = useTranslations("common.nav");

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <IconMenu className="size-5" stroke={1.75} aria-hidden />
        <span className="sr-only">{t("menu")}</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-3/4">
        <SheetHeader className="border-b border-border">
          <SheetTitle>{t("menu")}</SheetTitle>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 px-4 text-base font-medium text-foreground">
          {NAV_LINKS.map((link) => (
            <SheetClose
              key={link.key}
              render={<a href={link.href} />}
              className="rounded-lg px-3 py-3 transition-colors hover:bg-muted"
            >
              {t(link.key)}
            </SheetClose>
          ))}
        </nav>

        <SheetFooter className="gap-4 border-t border-border">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
          <SheetClose
            render={<TransitionLink href="/questionnaire" />}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
          >
            {t("cta")}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
