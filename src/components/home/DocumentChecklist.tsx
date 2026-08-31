"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IconFileCheck,
  IconId,
  IconHome,
  IconCamera,
  IconLanguage,
  IconCertificate,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

type ProcedureType = "eu" | "nonEu";

const EU_ITEMS = [
  { key: "licence", icon: IconFileCheck },
  { key: "id", icon: IconId },
  { key: "address", icon: IconHome },
  { key: "photo", icon: IconCamera },
] as const;

const NON_EU_EXTRA_ITEMS = [
  { key: "translation", icon: IconLanguage },
  { key: "conformity", icon: IconCertificate },
] as const;

const CAROUSEL_PHOTOS = [
  "/images/catalogue/2/img1.jpeg",
  "/images/catalogue/2/img2.jpeg",
  "/images/catalogue/2/img4.jpeg",
  "/images/catalogue/2/img5.jpeg",
  "/images/catalogue/2/img6.jpeg",
  "/images/catalogue/2/img7.jpeg",
  "/images/catalogue/2/img8.jpeg",
  "/images/catalogue/2/img9.jpeg",
  "/images/catalogue/2/img10.jpeg",
  "/images/catalogue/2/img11.jpeg",
  "/images/catalogue/2/img12.jpeg",
  "/images/catalogue/2/img14.jpeg",
  "/images/catalogue/2/img15.jpeg",
] as const;

const CAROUSEL_AUTOPLAY_DELAY = 3800;

export function DocumentChecklist() {
  const t = useTranslations("home.checklist");
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [procedure, setProcedure] = useState<ProcedureType>("eu");
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const items = procedure === "eu" ? EU_ITEMS : [...EU_ITEMS, ...NON_EU_EXTRA_ITEMS];

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

    const interval = setInterval(() => api.scrollNext(), CAROUSEL_AUTOPLAY_DELAY);
    return () => clearInterval(interval);
  }, [api]);

  useGSAP(
    () => {
      if (!listRef.current) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rows = gsap.utils.toArray<HTMLElement>("[data-checklist-item]", listRef.current);

      if (reduceMotion) {
        gsap.set(rows, { autoAlpha: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        rows,
        { autoAlpha: 0, x: -8 },
        { autoAlpha: 1, x: 0, duration: 0.35, ease: "power2.out", stagger: 0.05 },
      );
    },
    { scope: sectionRef, dependencies: [procedure] },
  );

  return (
    <section ref={sectionRef} className="bg-muted/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
                {t("eyebrow")}
              </p>
              <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
                {t("title")}
              </h2>
              <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
            </div>

            <div className="mx-auto mt-8 inline-flex w-full max-w-sm items-center rounded-full border border-border bg-card p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setProcedure("eu")}
                aria-pressed={procedure === "eu"}
                className={`flex-1 cursor-pointer rounded-full px-4 py-2 transition-colors duration-200 ${
                  procedure === "eu"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("toggleEu")}
              </button>
              <button
                type="button"
                onClick={() => setProcedure("nonEu")}
                aria-pressed={procedure === "nonEu"}
                className={`flex-1 cursor-pointer rounded-full px-4 py-2 transition-colors duration-200 ${
                  procedure === "nonEu"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("toggleNonEu")}
              </button>
            </div>

            <ul ref={listRef} className="mx-auto mt-8 flex max-w-lg flex-col gap-3">
              {items.map(({ key, icon: Icon }) => (
                <li
                  key={key}
                  data-checklist-item
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="size-4.5" stroke={1.75} aria-hidden />
                  </span>
                  <span className="text-sm text-foreground">{t(`items.${key}`)}</span>
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-6 max-w-lg text-center text-xs text-muted-foreground">
              {t("disclaimer")}
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-none">
            <Carousel setApi={setApi} opts={{ loop: true, align: "start" }}>
              <CarouselContent>
                {CAROUSEL_PHOTOS.map((src, index) => (
                  <CarouselItem key={src} className="basis-full sm:basis-1/2">
                    <div className="relative aspect-4/5 overflow-hidden rounded-2xl border-4 border-background shadow-xl">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 22vw, 40vw"
                        className="object-cover"
                        style={{ objectPosition: "50% 10%" }}
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
              aria-label={t("carouselPrev")}
              className="absolute -left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted sm:-left-4"
            >
              <IconChevronLeft className="size-4.5" stroke={2} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              aria-label={t("carouselNext")}
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
                  aria-label={`${t("carouselGoTo")} ${index + 1}`}
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
      </div>
    </section>
  );
}
