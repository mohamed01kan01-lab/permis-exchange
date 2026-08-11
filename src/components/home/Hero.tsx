"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { Link } from "@/i18n/navigation";
import { useMagnetic } from "@/hooks/useMagnetic";

gsap.registerPlugin(SplitText);

export function Hero() {
  const t = useTranslations("home.hero");
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const primaryCtaRef = useMagnetic<HTMLAnchorElement>(0.3);

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

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

          gsap.set("[data-hero-fade]", { autoAlpha: 1, y: 0 });

          if (reduceMotion) return;

          const cleanups: Array<() => void> = [];
          const section = sectionRef.current;

          // Slow ambient drift for the background glow blobs
          if (blob1Ref.current && blob2Ref.current) {
            const drift1 = gsap.to(blob1Ref.current, {
              x: 30,
              y: -20,
              duration: 9,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
            const drift2 = gsap.to(blob2Ref.current, {
              x: -24,
              y: 24,
              duration: 11,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
            cleanups.push(() => {
              drift1.kill();
              drift2.kill();
            });
          }

          // Mouse-reactive parallax on the grid + a soft glow that follows the cursor
          if (section && window.matchMedia("(hover: hover)").matches) {
            const gridX = gridRef.current
              ? gsap.quickTo(gridRef.current, "x", { duration: 0.9, ease: "power3.out" })
              : null;
            const gridY = gridRef.current
              ? gsap.quickTo(gridRef.current, "y", { duration: 0.9, ease: "power3.out" })
              : null;
            const glowX = glowRef.current
              ? gsap.quickTo(glowRef.current, "x", { duration: 0.5, ease: "power3.out" })
              : null;
            const glowY = glowRef.current
              ? gsap.quickTo(glowRef.current, "y", { duration: 0.5, ease: "power3.out" })
              : null;

            if (glowRef.current) gsap.set(glowRef.current, { autoAlpha: 0 });

            const handleMove = (e: MouseEvent) => {
              const rect = section.getBoundingClientRect();
              const relX = (e.clientX - rect.left) / rect.width - 0.5;
              const relY = (e.clientY - rect.top) / rect.height - 0.5;
              gridX?.(relX * -24);
              gridY?.(relY * -24);
              glowX?.(e.clientX - rect.left);
              glowY?.(e.clientY - rect.top);
              if (glowRef.current) gsap.to(glowRef.current, { autoAlpha: 1, duration: 0.3 });
            };
            const handleLeave = () => {
              if (glowRef.current) gsap.to(glowRef.current, { autoAlpha: 0, duration: 0.4 });
            };

            section.addEventListener("mousemove", handleMove);
            section.addEventListener("mouseleave", handleLeave);
            cleanups.push(() => {
              section.removeEventListener("mousemove", handleMove);
              section.removeEventListener("mouseleave", handleLeave);
            });
          }

          if (!titleRef.current) {
            return () => cleanups.forEach((fn) => fn());
          }

          const split = SplitText.create(titleRef.current, {
            type: "lines",
            mask: "lines",
          });

          gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 16 });

          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(split.lines, {
              yPercent: 100,
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.08,
            })
            .to(
              "[data-hero-fade]",
              { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08 },
              "-=0.45",
            );

          return () => {
            split.revert();
            cleanups.forEach((fn) => fn());
          };
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background">
      {/* Ambient gradient blobs */}
      <div
        ref={blob1Ref}
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ backgroundColor: "var(--color-secondary)" }}
      />
      <div
        ref={blob2Ref}
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-1/4 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: "var(--color-accent)" }}
      />

      {/* Dot grid */}
      <div
        ref={gridRef}
        aria-hidden
        className="pointer-events-none absolute inset-[-10%] opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-border) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 35%, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 35%, black 40%, transparent 80%)",
        }}
      />

      {/* Cursor-follow glow */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
        style={{ backgroundColor: "var(--color-primary)", opacity: 0.12 }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p
            data-hero-fade
            className="text-sm font-semibold uppercase tracking-wide text-secondary"
          >
            {t("eyebrow")}
          </p>
          <h1
            ref={titleRef}
            className="mt-4 text-4xl font-bold leading-tight text-foreground sm:text-5xl"
          >
            {t("title")}
          </h1>
          <p data-hero-fade className="mt-6 text-lg text-muted-foreground">
            {t("subtitle")}
          </p>

          <div
            data-hero-fade
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              ref={primaryCtaRef}
              href="/demande"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-shadow hover:shadow-lg hover:shadow-primary/30"
            >
              {t("ctaPrimary")}
            </Link>
            <a
              href="#comment-ca-marche"
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3.5 text-base font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        <dl
          data-hero-fade
          className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 border-t border-border pt-10 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-bold text-primary">{stat.value}</dd>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
