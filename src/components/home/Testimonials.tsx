"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { IconShieldCheck, IconCloudLock, IconHeadset, IconQuote, IconCircleCheckFilled, IconId } from "@tabler/icons-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

const BADGE_KEYS = ["gdpr", "hosting", "support"] as const;
const BADGE_ICONS = {
  gdpr: IconShieldCheck,
  hosting: IconCloudLock,
  support: IconHeadset,
} as const;

const TESTIMONIALS = [
  { id: "t1", name: "Karim", image: "/images/testimonial-01.jpeg", category: "B" },
  { id: "t2", name: "Elena", image: "/images/testimonial-02.jpeg", category: "B" },
  { id: "t3", name: "David", image: "/images/testimonial-03.jpeg", category: "B" },
  { id: "t4", name: "Ahmed", image: "/images/testimonial-04.jpeg", category: "A" },
  { id: "t5", name: "Nadia", image: "/images/testimonial-05.jpeg", category: "A" },
  { id: "t6", name: "Marco", image: "/images/testimonial-06.jpeg", category: "B" },
  { id: "t7", name: "Sofia", image: "/images/testimonial-07.jpeg", category: "B" },
  { id: "t8", name: "Fatima", image: "/images/testimonial-08.jpeg", category: "A" },
  { id: "t9", name: "Ibrahim", image: "/images/testimonial-09.jpeg", category: "C" },
  { id: "t10", name: "Laura", image: "/images/testimonial-10.jpeg", category: "B" },
  { id: "t11", name: "Yusuf", image: "/images/testimonial-11.jpeg", category: "BE" },
  { id: "t12", name: "Maria", image: "/images/testimonial-12.jpeg", category: "B" },
  { id: "t13", name: "Layla", image: "/images/testimonial-13.jpeg", category: "B" },
  { id: "t14", name: "Rafael", image: "/images/testimonial-14.jpeg", category: "D" },
] as const;

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
          const badges = gsap.utils.toArray<HTMLElement>("[data-trust-badge]");
          const carousel = document.querySelector("[data-testimonial-carousel]");

          if (reduceMotion) {
            gsap.set(badges, { autoAlpha: 1, y: 0 });
            if (carousel) gsap.set(carousel, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.set(badges, { autoAlpha: 0, y: 10 });

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

          if (carousel) {
            gsap.set(carousel, { autoAlpha: 0, y: 20 });
            ScrollTrigger.create({
              trigger: carousel,
              start: "top 85%",
              onEnter: () =>
                gsap.to(carousel, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }),
            });
          }
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

        <div data-testimonial-carousel className="mt-14">
          <Carousel opts={{ align: "start", loop: true }} className="px-1 sm:px-12">
            <CarouselContent>
              {TESTIMONIALS.map(({ id, name, image, category }) => (
                <CarouselItem key={id} className="sm:basis-1/2 lg:basis-1/3">
                  <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                        style={{ objectPosition: "50% 20%" }}
                      />
                      <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-border bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
                        <IconId className="size-3.5 text-primary" stroke={1.75} aria-hidden />
                        {t("licencePrefix")} {category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <IconQuote className="size-6 text-primary/30" stroke={1.5} aria-hidden />
                      <blockquote className="mt-3 flex-1 text-sm text-foreground/90">
                        “{t(`quotes.${id}`)}”
                      </blockquote>
                      <figcaption className="mt-5 flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{name}</span>
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <IconCircleCheckFilled className="size-3.5 text-accent" aria-hidden />
                          {t("verifiedClient")}
                        </span>
                      </figcaption>
                    </div>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
