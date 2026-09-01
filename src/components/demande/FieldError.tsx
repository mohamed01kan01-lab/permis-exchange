"use client";

import { useTranslations } from "next-intl";

export function FieldError({ messages }: { messages?: string[] }) {
  const t = useTranslations("common.validation");
  if (!messages?.length) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-destructive">
      {t(messages[0])}
    </p>
  );
}
