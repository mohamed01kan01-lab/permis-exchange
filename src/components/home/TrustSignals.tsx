"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IconNetwork,
  IconDatabase,
  IconShieldLock,
  IconUsersGroup,
  IconShieldCheck,
  type IconProps,
} from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const CARD_KEYS = ["eucaris", "motorizzazione", "security", "team"] as const;

const CARD_ICONS: Record<(typeof CARD_KEYS)[number], React.ComponentType<IconProps>> = {
  eucaris: IconNetwork,
  motorizzazione: IconDatabase,
  security: IconShieldLock,
  team: IconUsersGroup,
};

const CARD_ROTATIONS: Record<(typeof CARD_KEYS)[number], number> = {
  eucaris: -12,
  motorizzazione: 9,
  security: -7,
  team: 14,
};

export function TrustSignals() {
  const t = useTranslations("home.trust");
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);

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
          const bus = diagramRef.current?.querySelector("[data-hub-bus]") ?? null;
          const stubs = gsap.utils.toArray<HTMLElement>("[data-hub-stub]");
          const hub = diagramRef.current?.querySelector("[data-hub-badge]") ?? null;

          if (reduceMotion) {
            gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
            gsap.set([bus, ...stubs].filter(Boolean), { scaleX: 1, scaleY: 1 });
            gsap.set(hub, { autoAlpha: 1, scale: 1 });
            return;
          }

          gsap.set(cards, { autoAlpha: 0, y: 20, scale: 0.96 });
          if (bus) gsap.set(bus, { scaleX: 0 });
          if (stubs.length) gsap.set(stubs, { scaleY: 0 });
          if (hub) gsap.set(hub, { autoAlpha: 0, scale: 0.5 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          });

          if (bus) tl.to(bus, { scaleX: 1, duration: 0.5, ease: "power2.out" });
          if (hub)
            tl.to(hub, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, "-=0.2");
          if (stubs.length)
            tl.to(
              stubs,
              { scaleY: 1, duration: 0.35, ease: "power2.out", stagger: 0.08 },
              "-=0.15",
            );

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

        <div className="mt-16">
          {/* Interconnection diagram — desktop only, mirrors the 4-col grid below */}
          <div
            ref={diagramRef}
            aria-hidden
            className="pointer-events-none relative mb-8 hidden h-14 lg:block"
          >
            <div
              data-hub-bus
              className="absolute top-1/2 left-[12.5%] right-[12.5%] h-px origin-center -translate-y-1/2 bg-border"
            />
            <div
              data-hub-badge
              className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            >
              <span className="flex size-10 items-center justify-center rounded-full border-2 border-primary bg-card text-primary shadow-sm">
                <IconShieldCheck className="size-5" stroke={1.75} aria-hidden />
              </span>
            </div>
            <div className="absolute inset-x-0 top-1/2 bottom-0 grid grid-cols-4 gap-6">
              {CARD_KEYS.map((key) => (
                <div key={key} className="relative flex justify-center">
                  <span
                    data-hub-stub
                    className="h-full w-px origin-top bg-border"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  <Icon
                    aria-hidden
                    className="pointer-events-none absolute -right-4 -bottom-4 size-24 text-foreground/6"
                    stroke={1.25}
                    style={{ transform: `rotate(${CARD_ROTATIONS[key]}deg)` }}
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

          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-xs text-muted-foreground">{t("complianceNote")}</p>
            <div className="flex items-center gap-8">
              <Image
                src="/images/partners/partner-1.jpeg"
                alt="Ministero delle Infrastrutture e dei Trasporti"
                width={140}
                height={56}
                className="h-12 w-auto object-contain"
              />
              <Image
                src="/images/partners/partner-2.jpeg"
                alt="Unione Europea"
                width={84}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
