"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  IconArrowsExchange,
  IconMoodSmile,
  IconWorld,
  IconDeviceLaptop,
  IconChevronLeft,
  IconChevronRight,
  type IconProps,
} from "@tabler/icons-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

const STAT_KEYS = ["exchanged", "satisfaction", "countries", "online"] as const;

const SLIDER_PHOTOS = [
  "/images/catalogue/1/img1.jpeg",
  "/images/catalogue/1/img2.jpeg",
  "/images/catalogue/1/img3.jpeg",
  "/images/catalogue/1/img4.jpeg",
  "/images/catalogue/1/img5.jpeg",
  "/images/catalogue/1/img6.jpeg",
] as const;

const SLIDER_AUTOPLAY_DELAY = 4500;

const STAT_ICONS: Record<(typeof STAT_KEYS)[number], React.ComponentType<IconProps>> = {
  exchanged: IconArrowsExchange,
  satisfaction: IconMoodSmile,
  countries: IconWorld,
  online: IconDeviceLaptop,
};

// value = valeur finale numérique à afficher (pour l'animation de comptage), suffix = ce qui l'accompagne dans le rendu
const STAT_VALUES: Record<(typeof STAT_KEYS)[number], { target: number; format: (n: number) => string }> = {
  exchanged: { target: 500, format: (n) => `${Math.round(n)}+` },
  satisfaction: { target: 95, format: (n) => `${Math.round(n)}%` },
  countries: { target: 180, format: (n) => `${Math.round(n)}+` },
  online: { target: 100, format: (n) => `${Math.round(n)}%` },
};

export function StatsSection() {
  const t = useTranslations("home.stats");
  const sectionRef = useRef<HTMLElement>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSnapCount(api.scrollSnapList().length);
    setSelected(api.selectedScrollSnap());
    api.on("select", () => setSelected(api.selectedScrollSnap()));
    api.on("reInit", () => {
      setSnapCount(api.scrollSnapList().length);
      setSelected(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = setInterval(() => api.scrollNext(), SLIDER_AUTOPLAY_DELAY);
    return () => clearInterval(interval);
  }, [api]);

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
        <div className="mx-auto max-w-2xl text-left sm:text-center">
          <span className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base lg:text-lg">{t("subtitle")}</p>
        </div>

        <dl className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_KEYS.map((key) => {
            const Icon = STAT_ICONS[key];
            return (
              <div
                key={key}
                data-stat-card
                className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:items-center sm:p-8 sm:text-center"
              >
                <Icon
                  aria-hidden
                  className="pointer-events-none absolute -right-4 -bottom-4 size-24 text-foreground/6"
                  stroke={1.25}
                />
                <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-6" stroke={1.75} aria-hidden />
                </span>
                <dt className="sr-only">{t(`items.${key}.label`)}</dt>
                <dd
                  data-stat-counter={key}
                  className="relative text-4xl font-bold text-foreground"
                >
                  {STAT_VALUES[key].format(STAT_VALUES[key].target)}
                </dd>
                <p className="relative text-sm text-muted-foreground">{t(`items.${key}.label`)}</p>
              </div>
            );
          })}
        </dl>

        <div className="relative mx-auto mt-14 w-full">
          <Carousel setApi={setApi} opts={{ loop: true, align: "start" }}>
            <CarouselContent>
              {SLIDER_PHOTOS.map((src, index) => (
                <CarouselItem key={src} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="relative aspect-4/5 overflow-hidden rounded-2xl border-4 border-background shadow-xl">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                      style={{ objectPosition: "50% 20%" }}
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            aria-label={t("sliderPrev")}
            className="absolute -left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted sm:-left-4"
          >
            <IconChevronLeft className="size-4.5" stroke={2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            aria-label={t("sliderNext")}
            className="absolute -right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted sm:-right-4"
          >
            <IconChevronRight className="size-4.5" stroke={2} aria-hidden />
          </button>

          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: snapCount }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`${t("sliderGoTo")} ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === selected
                    ? "w-6 bg-primary"
                    : "w-2 bg-border hover:bg-muted-foreground/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
