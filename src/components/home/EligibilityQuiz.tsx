"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  IconArrowsExchange,
  IconWorld,
  IconArrowLeft,
  IconRefresh,
} from "@tabler/icons-react";
import { TransitionLink } from "@/components/site/TransitionLink";
import { COUNTRIES, isEuEeaCountry } from "@/lib/constants/countries";

type Step = 0 | 1 | 2;

export function EligibilityQuiz() {
  const t = useTranslations("home.quiz");
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>(0);
  const [licenceCountry, setLicenceCountry] = useState("");
  const [residenceCountry, setResidenceCountry] = useState("");

  useGSAP(
    () => {
      if (!panelRef.current) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
      );
    },
    { scope: sectionRef, dependencies: [step] },
  );

  const isEuExchange = licenceCountry ? isEuEeaCountry(licenceCountry) : null;

  function restart() {
    setStep(0);
    setLicenceCountry("");
    setResidenceCountry("");
  }

  const demandeHref =
    step === 2
      ? `/demande?licenceCountry=${licenceCountry}&residenceCountry=${residenceCountry}&procedureType=${
          isEuExchange ? "EU_EEA_EXCHANGE" : "NON_EU_CONVERSION"
        }`
      : "/demande";

  return (
    <section ref={sectionRef} className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
            {t("eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Progress connector */}
        <div className="mx-auto mt-10 flex max-w-xs items-center justify-center gap-2">
          {[0, 1, 2].map((dotStep) => (
            <div key={dotStep} className="flex items-center gap-2">
              <span
                className={`size-2.5 rounded-full transition-colors duration-300 ${
                  step >= dotStep ? "bg-primary" : "bg-border"
                }`}
              />
              {dotStep < 2 && (
                <span
                  className={`h-px w-10 transition-colors duration-500 ${
                    step > dotStep ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div
          ref={panelRef}
          className="mx-auto mt-8 max-w-xl rounded-2xl border border-border bg-card p-8"
        >
          {step === 0 && (
            <div>
              <label htmlFor="quiz-licence-country" className="text-base font-semibold text-foreground">
                {t("step1.question")}
              </label>
              <select
                id="quiz-licence-country"
                value={licenceCountry}
                onChange={(e) => {
                  setLicenceCountry(e.target.value);
                  setStep(1);
                }}
                className="mt-4 h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="" disabled>
                  {t("step1.placeholder")}
                </option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {step === 1 && (
            <div>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="mb-4 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <IconArrowLeft className="size-3.5" aria-hidden />
                {t("back")}
              </button>
              <label htmlFor="quiz-residence-country" className="text-base font-semibold text-foreground">
                {t("step2.question")}
              </label>
              <select
                id="quiz-residence-country"
                value={residenceCountry}
                onChange={(e) => {
                  setResidenceCountry(e.target.value);
                  setStep(2);
                }}
                className="mt-4 h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="" disabled>
                  {t("step2.placeholder")}
                </option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                {isEuExchange ? (
                  <IconArrowsExchange className="size-7" stroke={1.75} aria-hidden />
                ) : (
                  <IconWorld className="size-7" stroke={1.75} aria-hidden />
                )}
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">
                {isEuExchange ? t("result.euExchange.title") : t("result.nonEuConversion.title")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isEuExchange
                  ? t("result.euExchange.description")
                  : t("result.nonEuConversion.description")}
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <TransitionLink
                  href={demandeHref}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary"
                >
                  {t("result.cta")}
                </TransitionLink>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <IconRefresh className="size-4" aria-hidden />
                  {t("restart")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
