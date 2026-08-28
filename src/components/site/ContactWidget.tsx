"use client";

import { useTranslations } from "next-intl";
import { IconMessageCircle, IconMail, IconBrandWhatsapp } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function ContactWidget({
  email,
  whatsappPhone,
}: {
  email: string | null;
  whatsappPhone: string | null;
}) {
  const t = useTranslations("common.contactWidget");
  const waDigits = whatsappPhone?.replace(/[^\d]/g, "") || null;

  if (!email) return null;

  if (!waDigits) {
    return (
      <a
        href={`mailto:${email}`}
        aria-label={t("label")}
        className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
      >
        <IconMail className="size-6" stroke={1.75} aria-hidden />
      </a>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={t("label")}
            className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          />
        }
      >
        <IconMessageCircle className="size-6" stroke={1.75} aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end" className="w-52">
        <DropdownMenuItem render={<a href={`mailto:${email}`} />}>
          <IconMail className="size-4" stroke={1.75} aria-hidden />
          {t("email")}
        </DropdownMenuItem>
        <DropdownMenuItem
          render={
            <a
              href={`https://wa.me/${waDigits}?text=${encodeURIComponent(t("whatsappPrefill"))}`}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <IconBrandWhatsapp className="size-4" stroke={1.75} aria-hidden />
          {t("whatsapp")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
