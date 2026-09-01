"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IconChevronDown } from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const ITEM_KEYS = ["q1", "q2", "q3", "q4", "q5"] as const;

export function Faq() {
  const t = useTranslations("home.faq");
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
          const items = gsap.utils.toArray<HTMLElement>("[data-faq-item]");

          if (reduceMotion) {
            gsap.set(items, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.set(items, { autoAlpha: 0, y: 16 });

          gsap.to(items, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-left sm:text-center">
          <span className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card">
          {ITEM_KEYS.map((key) => (
            <details
              key={key}
              data-faq-item
              className="group p-6 transition-colors hover:bg-muted/40 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-foreground">
                {t(`items.${key}.question`)}
                <IconChevronDown
                  aria-hidden
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  stroke={1.75}
                />
              </summary>
              <p className="mt-4 text-sm text-muted-foreground">
                {t(`items.${key}.answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
