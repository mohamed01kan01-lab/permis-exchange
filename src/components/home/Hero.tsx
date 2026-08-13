"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import {
    IconClockHour4,
    IconShieldCheck,
    IconWorld,
} from "@tabler/icons-react";
import { TransitionLink } from "@/components/site/TransitionLink";
import { useMagnetic } from "@/hooks/useMagnetic";

gsap.registerPlugin(SplitText);

const COLLAGE_PHOTOS = [
    {
        src: "/images/testimonial-03.jpeg",
        className: "left-[4%] top-[6%] w-[46%] rotate-[-7deg]",
        z: 10,
    },
    {
        src: "/images/testimonial-08.jpeg",
        className: "right-[2%] top-0 w-[40%] rotate-[6deg]",
        z: 20,
    },
    {
        src: "/images/testimonial-06.jpeg",
        className: "left-0 bottom-[4%] w-[38%] rotate-[5deg]",
        z: 20,
    },
    {
        src: "/images/testimonial-10.jpeg",
        className: "right-[6%] bottom-0 w-[44%] rotate-[-5deg]",
        z: 10,
    },
    {
        src: "/images/testimonial-11.jpeg",
        className:
            "left-1/2 top-1/2 w-[36%] -translate-x-1/2 -translate-y-1/2 rotate-[2deg]",
        z: 30,
    },
] as const;

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
        {
            value: t("stat1Value"),
            label: t("stat1Label"),
            icon: IconClockHour4,
            rotation: -15,
        },
        {
            value: t("stat2Value"),
            label: t("stat2Label"),
            icon: IconShieldCheck,
            rotation: 10,
        },
        {
            value: t("stat3Value"),
            label: t("stat3Label"),
            icon: IconWorld,
            rotation: -8,
        },
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
                    const { reduceMotion } = context.conditions as {
                        reduceMotion: boolean;
                    };

                    gsap.set("[data-hero-fade]", { autoAlpha: 1, y: 0 });
                    gsap.set("[data-hero-photo]", { autoAlpha: 1, scale: 1 });

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
                    if (
                        section &&
                        window.matchMedia("(hover: hover)").matches
                    ) {
                        const gridX = gridRef.current
                            ? gsap.quickTo(gridRef.current, "x", {
                                  duration: 0.9,
                                  ease: "power3.out",
                              })
                            : null;
                        const gridY = gridRef.current
                            ? gsap.quickTo(gridRef.current, "y", {
                                  duration: 0.9,
                                  ease: "power3.out",
                              })
                            : null;
                        const glowX = glowRef.current
                            ? gsap.quickTo(glowRef.current, "x", {
                                  duration: 0.5,
                                  ease: "power3.out",
                              })
                            : null;
                        const glowY = glowRef.current
                            ? gsap.quickTo(glowRef.current, "y", {
                                  duration: 0.5,
                                  ease: "power3.out",
                              })
                            : null;

                        if (glowRef.current)
                            gsap.set(glowRef.current, { autoAlpha: 0 });

                        const handleMove = (e: MouseEvent) => {
                            const rect = section.getBoundingClientRect();
                            const relX =
                                (e.clientX - rect.left) / rect.width - 0.5;
                            const relY =
                                (e.clientY - rect.top) / rect.height - 0.5;
                            gridX?.(relX * -24);
                            gridY?.(relY * -24);
                            glowX?.(e.clientX - rect.left);
                            glowY?.(e.clientY - rect.top);
                            if (glowRef.current)
                                gsap.to(glowRef.current, {
                                    autoAlpha: 1,
                                    duration: 0.3,
                                });
                        };
                        const handleLeave = () => {
                            if (glowRef.current)
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
                                stagger: 0.1,
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
                style={{
                    backgroundColor: "var(--color-primary)",
                    opacity: 0.12,
                }}
            />

            <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
                <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="text-center lg:text-left">
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
                        <p
                            data-hero-fade
                            className="mt-6 text-lg text-muted-foreground"
                        >
                            {t("subtitle")}
                        </p>

                        <div
                            data-hero-fade
                            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
                        >
                            <TransitionLink
                                ref={primaryCtaRef}
                                href="/questionnaire"
                                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-shadow hover:shadow-lg hover:shadow-primary/30"
                            >
                                {t("ctaPrimary")}
                            </TransitionLink>
                            <a
                                href="#comment-ca-marche"
                                className="inline-flex items-center justify-center rounded-full border border-border px-8 py-3.5 text-xs font-semibold text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
                            >
                                {t("ctaSecondary")}
                            </a>
                        </div>
                    </div>

                    <div className="relative mx-auto aspect-square w-full max-w-sm sm:max-w-md lg:max-w-none">
                        {COLLAGE_PHOTOS.map((photo, index) => (
                            <div
                                key={photo.src}
                                data-hero-photo
                                className={`absolute aspect-[4/5] overflow-hidden rounded-2xl border-4 border-background shadow-xl ${photo.className}`}
                                style={{ zIndex: photo.z }}
                            >
                                <Image
                                    src={photo.src}
                                    alt=""
                                    fill
                                    sizes="(min-width: 1024px) 22vw, 40vw"
                                    className="object-cover"
                                    style={{ objectPosition: "50% 20%" }}
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <dl
                    data-hero-fade
                    className="mt-16 grid grid-cols-1 gap-4 border-t border-border pt-10 sm:grid-cols-3"
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5"
                        >
                            <stat.icon
                                aria-hidden
                                className="pointer-events-none absolute -right-3 -bottom-3 size-16 text-foreground/6"
                                stroke={1.25}
                                style={{
                                    transform: `rotate(${stat.rotation}deg)`,
                                }}
                            />
                            <span className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <stat.icon
                                    className="size-5"
                                    stroke={1.75}
                                    aria-hidden
                                />
                            </span>
                            <div className="relative">
                                <dt className="sr-only">{stat.label}</dt>
                                <dd className="text-2xl font-bold text-foreground">
                                    {stat.value}
                                </dd>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
