"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IconNetwork,
  IconDatabase,
  IconShieldLock,
  IconUsersGroup,
  type IconProps,
} from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const CARD_KEYS = ["eucaris", "resper", "security", "team"] as const;

const CARD_ICONS: Record<(typeof CARD_KEYS)[number], React.ComponentType<IconProps>> = {
  eucaris: IconNetwork,
  resper: IconDatabase,
  security: IconShieldLock,
  team: IconUsersGroup,
};

export function TrustSignals() {
  const t = useTranslations("home.trust");
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
          const cards = gsap.utils.toArray<HTMLElement>("[data-trust-card]");

          if (reduceMotion) {
            gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
            return;
          }

          gsap.set(cards, { autoAlpha: 0, y: 20, scale: 0.96 });

          ScrollTrigger.batch(cards, {
            start: "top 85%",
            onEnter: (batch) =>
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.55,
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
    <section ref={sectionRef} className="py-20 sm:py-28">
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

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARD_KEYS.map((key) => {
            const Icon = CARD_ICONS[key];
            return (
              <div
                key={key}
                data-trust-card
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-accent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15"
                />
                <span className="relative flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" stroke={1.75} aria-hidden />
                </span>
                <h3 className="relative mt-4 text-base font-semibold text-foreground">
                  {t(`cards.${key}.title`)}
                </h3>
                <p className="relative mt-2 text-sm text-muted-foreground">
                  {t(`cards.${key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
