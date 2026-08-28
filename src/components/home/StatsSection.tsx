"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IconClockHour4,
  IconShieldCheck,
  IconWorld,
  IconDeviceLaptop,
  type IconProps,
} from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const STAT_KEYS = ["time", "rejections", "countries", "online"] as const;

const STAT_ICONS: Record<(typeof STAT_KEYS)[number], React.ComponentType<IconProps>> = {
  time: IconClockHour4,
  rejections: IconShieldCheck,
  countries: IconWorld,
  online: IconDeviceLaptop,
};

// value = valeur finale numérique à afficher (pour l'animation de comptage), suffix = ce qui l'accompagne dans le rendu
const STAT_VALUES: Record<(typeof STAT_KEYS)[number], { target: number; format: (n: number) => string }> = {
  time: { target: 48, format: (n) => `${Math.round(n)}h` },
  rejections: { target: 0, format: (n) => String(Math.round(n)).padStart(2, "0") },
  countries: { target: 180, format: (n) => `${Math.round(n)}+` },
  online: { target: 100, format: (n) => `${Math.round(n)}%` },
};

export function StatsSection() {
  const t = useTranslations("home.stats");
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
          const cards = gsap.utils.toArray<HTMLElement>("[data-stat-card]");
          const counters = gsap.utils.toArray<HTMLElement>("[data-stat-counter]");

          if (reduceMotion) {
            gsap.set(cards, { autoAlpha: 1, y: 0 });
            counters.forEach((el) => {
              const key = el.dataset.statCounter as (typeof STAT_KEYS)[number];
              el.textContent = STAT_VALUES[key].format(STAT_VALUES[key].target);
            });
            return;
          }

          gsap.set(cards, { autoAlpha: 0, y: 20 });

          ScrollTrigger.batch(cards, {
            start: "top 85%",
            onEnter: (batch) => {
              gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                ease: "power2.out",
                stagger: 0.1,
              });

              batch.forEach((card) => {
                const counter = card.querySelector<HTMLElement>("[data-stat-counter]");
                if (!counter) return;
                const key = counter.dataset.statCounter as (typeof STAT_KEYS)[number];
                const { target, format } = STAT_VALUES[key];
                const proxy = { value: 0 };
                gsap.to(proxy, {
                  value: target,
                  duration: 1.4,
                  ease: "power2.out",
                  onUpdate: () => {
                    counter.textContent = format(proxy.value);
                  },
                });
              });
            },
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

        <dl className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_KEYS.map((key) => {
            const Icon = STAT_ICONS[key];
            return (
              <div
                key={key}
                data-stat-card
                className="relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card p-8 text-center"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" stroke={1.75} aria-hidden />
                </span>
                <dt className="sr-only">{t(`items.${key}.label`)}</dt>
                <dd
                  data-stat-counter={key}
                  className="text-4xl font-bold text-foreground"
                >
                  {STAT_VALUES[key].format(STAT_VALUES[key].target)}
                </dd>
                <p className="text-sm text-muted-foreground">{t(`items.${key}.label`)}</p>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
