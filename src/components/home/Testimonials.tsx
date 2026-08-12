"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IconShieldCheck, IconCloudLock, IconHeadset, IconQuote } from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const BADGE_KEYS = ["gdpr", "hosting", "support"] as const;
const BADGE_ICONS = {
  gdpr: IconShieldCheck,
  hosting: IconCloudLock,
  support: IconHeadset,
} as const;

const QUOTE_KEYS = ["sophie", "julien", "amara"] as const;

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export function Testimonials() {
  const t = useTranslations("home.testimonials");
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
          const cards = gsap.utils.toArray<HTMLElement>("[data-quote-card]");
          const badges = gsap.utils.toArray<HTMLElement>("[data-trust-badge]");

          if (reduceMotion) {
            gsap.set([...cards, ...badges], { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.set(badges, { autoAlpha: 0, y: 10 });
          gsap.set(cards, { autoAlpha: 0, y: 20 });

          ScrollTrigger.batch(badges, {
            start: "top 90%",
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                stagger: 0.08,
              }),
          });

          ScrollTrigger.batch(cards, {
            start: "top 85%",
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.1,
              }),
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-3">
          {BADGE_KEYS.map((key) => {
            const Icon = BADGE_ICONS[key];
            return (
              <span
                key={key}
                data-trust-badge
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground"
              >
                <Icon className="size-4 text-accent" stroke={1.75} aria-hidden />
                {t(`badges.${key}`)}
              </span>
            );
          })}
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {QUOTE_KEYS.map((key) => {
            const name = t(`quotes.${key}.name`);
            return (
              <figure
                key={key}
                data-quote-card
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <IconQuote className="size-6 text-primary/30" stroke={1.5} aria-hidden />
                <blockquote className="mt-3 flex-1 text-sm text-foreground/90">
                  “{t(`quotes.${key}.text`)}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initialsFor(name)}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t(`quotes.${key}.location`)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
