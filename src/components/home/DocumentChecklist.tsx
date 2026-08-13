"use client";

import { useRef, useState } from "react";
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
} from "@tabler/icons-react";

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

const COLLAGE_PHOTOS = [
  { src: "/images/testimonial-01.jpeg", className: "left-[6%] top-[10%] w-[42%] rotate-[-6deg]", z: 10 },
  { src: "/images/testimonial-09.jpeg", className: "right-[4%] top-0 w-[38%] rotate-[5deg]", z: 20 },
  { src: "/images/testimonial-05.jpeg", className: "left-0 bottom-0 w-[36%] rotate-[4deg]", z: 20 },
  { src: "/images/testimonial-12.jpeg", className: "right-[8%] bottom-[2%] w-[42%] rotate-[-4deg]", z: 10 },
] as const;

export function DocumentChecklist() {
  const t = useTranslations("home.checklist");
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [procedure, setProcedure] = useState<ProcedureType>("eu");

  const items = procedure === "eu" ? EU_ITEMS : [...EU_ITEMS, ...NON_EU_EXTRA_ITEMS];

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

          <div
            aria-hidden
            className="relative mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:max-w-none"
          >
            {COLLAGE_PHOTOS.map((photo) => (
              <div
                key={photo.src}
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
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
