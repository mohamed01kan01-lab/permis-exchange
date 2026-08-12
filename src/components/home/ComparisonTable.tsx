"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IconArrowsExchange, IconWorld, IconCheck, IconMinus } from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const ROW_KEYS = ["eligibility", "documents", "delay", "validity"] as const;

export function ComparisonTable() {
  const t = useTranslations("home.comparison");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          motionOK: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as { reduceMotion: boolean };
          const rows = gsap.utils.toArray<HTMLElement>("[data-comparison-row]");

          if (reduceMotion) {
            gsap.set(rows, { autoAlpha: 1, x: 0 });
            return;
          }

          gsap.set(rows, { autoAlpha: 0, x: -12 });

          ScrollTrigger.batch(rows, {
            start: "top 90%",
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                x: 0,
                duration: 0.45,
                ease: "power2.out",
                stagger: 0.08,
              }),
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-160 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th scope="col" className="px-5 py-4 font-semibold text-foreground">
                  {t("criteria")}
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-foreground">
                  <span className="flex items-center gap-2">
                    <IconArrowsExchange className="size-4 text-primary" stroke={1.75} aria-hidden />
                    {t("euExchangeHeader")}
                  </span>
                </th>
                <th scope="col" className="px-5 py-4 font-semibold text-foreground">
                  <span className="flex items-center gap-2">
                    <IconWorld className="size-4 text-primary" stroke={1.75} aria-hidden />
                    {t("nonEuHeader")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROW_KEYS.map((key) => (
                <tr
                  key={key}
                  data-comparison-row
                  className="border-b border-border last:border-0 odd:bg-card even:bg-muted/20"
                >
                  <th scope="row" className="px-5 py-4 font-medium text-foreground">
                    {t(`rows.${key}.label`)}
                  </th>
                  <td className="px-5 py-4 text-muted-foreground">
                    {t(`rows.${key}.eu`)}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {t(`rows.${key}.nonEu`)}
                  </td>
                </tr>
              ))}
              <tr data-comparison-row className="odd:bg-card even:bg-muted/20">
                <th scope="row" className="px-5 py-4 font-medium text-foreground">
                  {t("rows.exam.label")}
                </th>
                <td className="px-5 py-4">
                  <IconMinus className="size-4 text-muted-foreground" stroke={1.75} aria-hidden />
                </td>
                <td className="px-5 py-4">
                  <IconCheck className="size-4 text-accent" stroke={2} aria-hidden />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">{t("disclaimer")}</p>
      </div>
    </section>
  );
}
