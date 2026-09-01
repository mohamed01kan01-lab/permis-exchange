"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { TransitionLink } from "@/components/site/TransitionLink";
import { useMagnetic } from "@/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const CLUSTER_PHOTOS = [
  { src: "/images/testimonial-02.jpeg", className: "left-0 top-1 -rotate-6", z: 10 },
  { src: "/images/testimonial-14.jpeg", className: "left-10 top-0 rotate-3", z: 20 },
  { src: "/images/testimonial-07.jpeg", className: "left-20 top-1.5 rotate-9", z: 10 },
] as const;

export function FinalCta() {
  const t = useTranslations("home.cta");
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.3);
  const blobRef = useRef<HTMLDivElement>(null);

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

          if (reduceMotion) {
            gsap.set("[data-cta-fade]", { autoAlpha: 1, y: 0, scale: 1 });
            return;
          }

          gsap.fromTo(
            "[data-cta-fade]",
            { autoAlpha: 0, y: 16, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%",
              },
            },
          );

          if (blobRef.current) {
            const drift = gsap.to(blobRef.current, {
              x: 40,
              y: -16,
              duration: 8,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
            return () => drift.kill();
          }
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-primary py-20 sm:py-24">
      <div
        ref={blobRef}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-[0.06] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 85%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <div
          data-cta-fade
          aria-hidden
          className="relative mx-auto mb-8 h-16 w-40"
        >
          {CLUSTER_PHOTOS.map((photo) => (
            <div
              key={photo.src}
              className={`absolute size-14 overflow-hidden rounded-xl border-4 border-background shadow-lg ${photo.className}`}
              style={{ zIndex: photo.z }}
            >
              <Image src={photo.src} alt="" fill sizes="56px" className="object-cover" style={{ objectPosition: "50% 20%" }} />
            </div>
          ))}
        </div>

        <h2
          data-cta-fade
          className="text-2xl font-bold text-primary-foreground sm:text-4xl"
        >
          {t("title")}
        </h2>
        <p data-cta-fade className="mt-4 text-sm text-primary-foreground/80 md:text-base lg:text-lg">
          {t("subtitle")}
        </p>
        <TransitionLink
          ref={ctaRef}
          href="/questionnaire"
          data-cta-fade
          className="mt-8 inline-flex items-center justify-center rounded-full bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-lg shadow-black/10 transition-shadow hover:shadow-xl hover:shadow-black/20"
        >
          {t("button")}
        </TransitionLink>
      </div>
    </section>
  );
}
