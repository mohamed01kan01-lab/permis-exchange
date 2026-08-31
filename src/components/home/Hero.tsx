"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { TransitionLink } from "@/components/site/TransitionLink";
import { useMagnetic } from "@/hooks/useMagnetic";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

gsap.registerPlugin(SplitText);

const SLIDER_PHOTOS = [
    "/images/catalogue/1/img1.jpeg",
    "/images/catalogue/1/img2.jpeg",
    "/images/catalogue/1/img3.jpeg",
    "/images/catalogue/1/img4.jpeg",
    "/images/catalogue/1/img5.jpeg",
    "/images/catalogue/1/img6.jpeg",
] as const;

const SLIDER_AUTOPLAY_DELAY = 4500;

export function Hero() {
    const t = useTranslations("home.hero");
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const primaryCtaRef = useMagnetic<HTMLAnchorElement>(0.3);
    const [api, setApi] = useState<CarouselApi>();
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        if (!api) return;
        setSelected(api.selectedScrollSnap());
        api.on("select", () => setSelected(api.selectedScrollSnap()));
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
                    const { reduceMotion } = context.conditions as {
                        reduceMotion: boolean;
                    };

                    gsap.set("[data-hero-fade]", { autoAlpha: 1, y: 0 });
                    gsap.set("[data-hero-photo]", { autoAlpha: 1, scale: 1 });

                    if (reduceMotion) return;

                    const cleanups: Array<() => void> = [];
                    const section = sectionRef.current;

                    // Soft glow that follows the cursor over the background photo
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
            {/* Full-bleed background photo */}
            <Image
                src="/new-og-img.jpeg"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover"
            />
            <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-b from-background/95 to-background/50 lg:bg-linear-to-r lg:from-background/95 lg:to-background/35"
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
                    <div className="text-left">
                        <p
                            data-hero-fade
                            className="text-sm font-semibold uppercase tracking-wide text-secondary"
                        >
                            {t("eyebrow")}
                        </p>
                        <h1
                            ref={titleRef}
                            className="mt-4 text-3xl font-bold leading-tight text-foreground sm:text-4xl"
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
                            className="mt-10 flex flex-col items-start justify-start gap-4 sm:flex-row"
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

                    <div
                        data-hero-photo
                        className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-2xl border-4 border-background shadow-xl sm:max-w-md lg:max-w-none"
                    >
                        <Carousel setApi={setApi} opts={{ loop: true }} className="h-full">
                            <CarouselContent className="ml-0 h-full">
                                {SLIDER_PHOTOS.map((src, index) => (
                                    <CarouselItem key={src} className="relative h-full basis-full pl-0">
                                        <Image
                                            src={src}
                                            alt=""
                                            fill
                                            sizes="(min-width: 1024px) 44vw, 90vw"
                                            className="object-cover"
                                            style={{ objectPosition: "50% 20%" }}
                                            priority={index === 0}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        <button
                            type="button"
                            onClick={() => api?.scrollPrev()}
                            aria-label={t("sliderPrev")}
                            className="absolute left-3 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background"
                        >
                            <IconChevronLeft className="size-4.5" stroke={2} aria-hidden />
                        </button>
                        <button
                            type="button"
                            onClick={() => api?.scrollNext()}
                            aria-label={t("sliderNext")}
                            className="absolute right-3 top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-background/80 text-foreground shadow-md backdrop-blur transition-colors hover:bg-background"
                        >
                            <IconChevronRight className="size-4.5" stroke={2} aria-hidden />
                        </button>

                        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
                            {SLIDER_PHOTOS.map((src, index) => (
                                <button
                                    key={src}
                                    type="button"
                                    onClick={() => api?.scrollTo(index)}
                                    aria-label={`${t("sliderGoTo")} ${index + 1}`}
                                    className={`h-2 rounded-full transition-all duration-200 ${
                                        index === selected
                                            ? "w-6 bg-background"
                                            : "w-2 bg-background/50 hover:bg-background/80"
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
