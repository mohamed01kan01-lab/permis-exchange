"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { TransitionLink } from "@/components/site/TransitionLink";
import { useMagnetic } from "@/hooks/useMagnetic";

gsap.registerPlugin(SplitText);

export function Hero() {
    const t = useTranslations("home.hero");
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const primaryCtaRef = useMagnetic<HTMLAnchorElement>(0.3);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add(
                {
                    reduceMotion: "(prefers-reduced-motion: reduce)",
                    motionOK: "(prefers-reduced-motion: no-preference)",
                },
                (context) => {
                    const { reduceMotion } = context.conditions as {
                        reduceMotion: boolean;
                    };

                    gsap.set("[data-hero-fade]", { autoAlpha: 1, y: 0 });
                    gsap.set("[data-hero-photo]", { autoAlpha: 1, scale: 1 });

                    if (reduceMotion) return;

                    const cleanups: Array<() => void> = [];
                    const section = sectionRef.current;

                    // Soft glow that follows the cursor
                    if (
                        section &&
                        glowRef.current &&
                        window.matchMedia("(hover: hover)").matches
                    ) {
                        const glowX = gsap.quickTo(glowRef.current, "x", {
                            duration: 0.5,
                            ease: "power3.out",
                        });
                        const glowY = gsap.quickTo(glowRef.current, "y", {
                            duration: 0.5,
                            ease: "power3.out",
                        });

                        gsap.set(glowRef.current, { autoAlpha: 0 });

                        const handleMove = (e: MouseEvent) => {
                            const rect = section.getBoundingClientRect();
                            glowX(e.clientX - rect.left);
                            glowY(e.clientY - rect.top);
                            gsap.to(glowRef.current, {
                                autoAlpha: 1,
                                duration: 0.3,
                            });
                        };
                        const handleLeave = () => {
                            gsap.to(glowRef.current, {
                                autoAlpha: 0,
                                duration: 0.4,
                            });
                        };

                        section.addEventListener("mousemove", handleMove);
                        section.addEventListener("mouseleave", handleLeave);
                        cleanups.push(() => {
                            section.removeEventListener(
                                "mousemove",
                                handleMove,
                            );
                            section.removeEventListener(
                                "mouseleave",
                                handleLeave,
                            );
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
                    gsap.set("[data-hero-photo]", {
                        autoAlpha: 0,
                        scale: 0.85,
                    });

                    gsap.timeline({ defaults: { ease: "power3.out" } })
                        .from(split.lines, {
                            yPercent: 100,
                            autoAlpha: 0,
                            duration: 0.9,
                            stagger: 0.08,
                        })
                        .to(
                            "[data-hero-fade]",
                            {
                                autoAlpha: 1,
                                y: 0,
                                duration: 0.6,
                                stagger: 0.08,
                            },
                            "-=0.45",
                        )
                        .to(
                            "[data-hero-photo]",
                            {
                                autoAlpha: 1,
                                scale: 1,
                                duration: 0.6,
                            },
                            "-=0.5",
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
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-background"
        >
            {/* Cursor-follow glow */}
            <div
                ref={glowRef}
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl"
                style={{
                    backgroundColor: "var(--color-primary)",
                    opacity: 0.12,
                }}
            />

            <div className="relative mx-auto max-w-6xl px-4 py-4 mb-10 sm:px-6 sm:py-28">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="text-left">
                        <div className="relative overflow-hidden rounded-2xl border border-border px-6 py-8 sm:px-8 sm:py-10">
                            <Image
                                src="/new-og-img.jpeg"
                                alt=""
                                fill
                                priority
                                sizes="(min-width: 1024px) 44vw, 90vw"
                                className="object-cover"
                            />
                            <div
                                aria-hidden
                                className="absolute inset-0 bg-background/70"
                            />

                            <div className="relative">
                                <span
                                    data-hero-fade
                                    className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-secondary"
                                >
                                    {t("eyebrow")}
                                </span>
                                <h1
                                    ref={titleRef}
                                    className="mt-4 text-2xl md:text-3xl lg:4xl font-bold leading-tight text-foreground"
                                >
                                    {t("title")}
                                </h1>
                            </div>
                        </div>

                        <p
                            data-hero-fade
                            className="mt-6 text-sm md:text-base lg:text-lg text-muted-foreground"
                        >
                            {t("subtitle")}
                        </p>

                        <div
                            data-hero-fade
                            className="mt-10 flex items-start justify-start gap-2 flex-wrap"
                        >
                            <TransitionLink
                                ref={primaryCtaRef}
                                href="/questionnaire"
                                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-shadow hover:shadow-lg hover:shadow-primary/30"
                            >
                                {t("ctaPrimary")}
                            </TransitionLink>
                            <a
                                href="#comment-ca-marche"
                                className="inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
                            >
                                {t("ctaSecondary")}
                            </a>
                        </div>
                    </div>

                    <div
                        data-hero-photo
                        className="relative mx-auto w-full max-w-xl overflow-hidden rounded-2xl border-4 border-background shadow-xl lg:max-w-none"
                    >
                        <Image
                            src="/hero.jpeg"
                            alt=""
                            width={2752}
                            height={1536}
                            sizes="(min-width: 1024px) 44vw, 90vw"
                            className="h-auto w-full object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
