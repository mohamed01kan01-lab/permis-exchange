"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IconArrowsExchange, IconWorld, IconCheck, type IconProps } from "@tabler/icons-react";
import { Link } from "@/i18n/navigation";
import { useMagnetic } from "@/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

function ScopeCard({
  icon: Icon,
  title,
  description,
  bullets,
  cta,
}: {
  icon: React.ComponentType<IconProps>;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
}) {
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.25);

  return (
    <div
      data-scope-card
      className="group relative overflow-hidden flex flex-col rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10"
      />
      <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-6" stroke={1.75} aria-hidden />
      </span>
      <h3 className="relative mt-5 text-xl font-semibold text-foreground">{title}</h3>
      <p className="relative mt-3 text-sm text-muted-foreground">{description}</p>
      <ul className="relative mt-6 flex flex-1 flex-col gap-3 text-sm text-foreground/90">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <IconCheck className="mt-0.5 size-4 shrink-0 text-accent" stroke={2} aria-hidden />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      <Link
        ref={ctaRef}
        href="/demande"
        className="relative mt-8 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
      >
        {cta}
      </Link>
    </div>
  );
}

export function ServiceScope() {
  const t = useTranslations("home.scope");
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
          const cards = gsap.utils.toArray<HTMLElement>("[data-scope-card]");

          if (reduceMotion) {
            gsap.set(cards, { autoAlpha: 1, x: 0 });
            return;
          }

          cards.forEach((card, index) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0, x: index === 0 ? -32 : 32 },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                },
              },
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="services" className="bg-muted/40 py-20 sm:py-28">
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

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ScopeCard
            icon={IconArrowsExchange}
            title={t("euExchange.title")}
            description={t("euExchange.description")}
            bullets={[
              t("euExchange.bullet1"),
              t("euExchange.bullet2"),
              t("euExchange.bullet3"),
            ]}
            cta={t("euExchange.cta")}
          />
          <ScopeCard
            icon={IconWorld}
            title={t("nonEuConversion.title")}
            description={t("nonEuConversion.description")}
            bullets={[
              t("nonEuConversion.bullet1"),
              t("nonEuConversion.bullet2"),
              t("nonEuConversion.bullet3"),
            ]}
            cta={t("nonEuConversion.cta")}
          />
        </div>
      </div>
    </section>
  );
}
