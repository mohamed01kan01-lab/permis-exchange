"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IconFileSearch,
  IconListCheck,
  IconRoute,
  IconProgressCheck,
  type IconProps,
} from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const STEP_KEYS = ["step1", "step2", "step3", "step4"] as const;

const STEP_ICONS: Record<(typeof STEP_KEYS)[number], React.ComponentType<IconProps>> = {
  step1: IconFileSearch,
  step2: IconListCheck,
  step3: IconRoute,
  step4: IconProgressCheck,
};

const STEP_ROTATIONS: Record<(typeof STEP_KEYS)[number], number> = {
  step1: -11,
  step2: 13,
  step3: -9,
  step4: 7,
};

export function ProcessTimeline() {
  const t = useTranslations("home.process");
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

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
          const cards = gsap.utils.toArray<HTMLElement>("[data-step-card]");

          if (reduceMotion) {
            gsap.set(cards, { autoAlpha: 1, y: 0 });
            if (lineRef.current) gsap.set(lineRef.current, { scaleX: 1 });
            return;
          }

          gsap.set(cards, { autoAlpha: 0, y: 24 });

          ScrollTrigger.batch(cards, {
            start: "top 85%",
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.12,
              }),
          });

          if (lineRef.current) {
            gsap.fromTo(
              lineRef.current,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                transformOrigin: "left center",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top 70%",
                  end: "bottom 60%",
                  scrub: 0.5,
                },
              },
            );
          }
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="comment-ca-marche"
      className="bg-muted/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="relative mt-16">
          <div
            aria-hidden
            className="absolute top-5 right-0 left-0 hidden h-px bg-border lg:block"
          >
            <div
              ref={lineRef}
              className="h-full origin-left bg-primary"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <ol className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEP_KEYS.map((key, index) => {
              const Icon = STEP_ICONS[key];
              return (
                <li
                  key={key}
                  data-step-card
                  className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <Icon
                    aria-hidden
                    className="pointer-events-none absolute -right-4 -bottom-4 size-24 text-foreground/6"
                    stroke={1.25}
                    style={{ transform: `rotate(${STEP_ROTATIONS[key]}deg)` }}
                  />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform duration-300 group-hover:scale-110">
                    {index + 1}
                  </span>
                  <h3 className="relative text-lg font-semibold text-foreground">
                    {t(`steps.${key}.title`)}
                  </h3>
                  <p className="relative text-sm text-muted-foreground">
                    {t(`steps.${key}.description`)}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
