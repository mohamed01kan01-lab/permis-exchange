"use client";

import { useActionState, useEffect, useRef, useState, type FocusEvent } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { IconCircleCheck } from "@tabler/icons-react";
import { validateIdentityStep, type StepState } from "@/app/[locale]/demande/actions";
import type { IdentityData } from "@/lib/validation/identity.schema";
import { COUNTRIES } from "@/lib/constants/countries";
import { FieldError } from "./FieldError";
import { DateField } from "./DateField";
import { SubmitButton } from "./SubmitButton";
import { useShakeOnError } from "@/hooks/useShakeOnError";

const initialState: StepState<IdentityData> = { success: false };

export function Step1Identity({
  defaultValues,
  onComplete,
}: {
  defaultValues?: Partial<IdentityData>;
  onComplete: (data: IdentityData) => void;
}) {
  const t = useTranslations("demande.identity");
  const tCommon = useTranslations("demande.common");
  const [state, formAction] = useActionState(validateIdentityStep, initialState);

  useEffect(() => {
    if (state.success && state.values) onComplete(state.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const errors = state.errors ?? {};
  const formRef = useShakeOnError<HTMLFormElement>(state.errors);
  const [emailValid, setEmailValid] = useState(false);
  const checkmarkRef = useRef<HTMLSpanElement>(null);

  function handleEmailBlur(event: FocusEvent<HTMLInputElement>) {
    const valid = event.target.value.length > 0 && event.target.checkValidity();
    setEmailValid(valid);
    if (valid && checkmarkRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        checkmarkRef.current,
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.3, ease: "back.out(3)" },
      );
    }
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium text-foreground">
            {t("firstName")}
          </label>
          <input
            id="firstName"
            name="firstName"
            defaultValue={defaultValues?.firstName}
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? "firstName-error" : undefined}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <span id="firstName-error">
            <FieldError messages={errors.firstName} />
          </span>
        </div>

        <div>
          <label htmlFor="lastName" className="text-sm font-medium text-foreground">
            {t("lastName")}
          </label>
          <input
            id="lastName"
            name="lastName"
            defaultValue={defaultValues?.lastName}
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? "lastName-error" : undefined}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <span id="lastName-error">
            <FieldError messages={errors.lastName} />
          </span>
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="text-sm font-medium text-foreground">
            {t("dateOfBirth")}
          </label>
          <DateField
            id="dateOfBirth"
            name="dateOfBirth"
            defaultValue={defaultValues?.dateOfBirth}
            ariaInvalid={!!errors.dateOfBirth}
          />
          <FieldError messages={errors.dateOfBirth} />
        </div>

        <div>
          <label htmlFor="countryOfResidence" className="text-sm font-medium text-foreground">
            {t("countryOfResidence")}
          </label>
          <select
            id="countryOfResidence"
            name="countryOfResidence"
            defaultValue={defaultValues?.countryOfResidence ?? ""}
            aria-invalid={!!errors.countryOfResidence}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="" disabled>
              —
            </option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <FieldError messages={errors.countryOfResidence} />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            {t("email")}
          </label>
          <div className="relative mt-1.5">
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={defaultValues?.email}
              aria-invalid={!!errors.email}
              onBlur={handleEmailBlur}
              onChange={() => emailValid && setEmailValid(false)}
              className="h-10 w-full rounded-lg border border-input bg-transparent px-3 pr-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            {emailValid && (
              <span
                ref={checkmarkRef}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-accent"
              >
                <IconCircleCheck className="size-4" stroke={1.75} aria-hidden />
              </span>
            )}
          </div>
          <FieldError messages={errors.email} />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            {t("phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultValues?.phone}
            aria-invalid={!!errors.phone}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <FieldError messages={errors.phone} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="addressLine1" className="text-sm font-medium text-foreground">
            {t("addressLine1")}
          </label>
          <input
            id="addressLine1"
            name="addressLine1"
            defaultValue={defaultValues?.addressLine1}
            aria-invalid={!!errors.addressLine1}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <FieldError messages={errors.addressLine1} />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="addressLine2" className="text-sm font-medium text-foreground">
            {t("addressLine2")}
          </label>
          <input
            id="addressLine2"
            name="addressLine2"
            defaultValue={defaultValues?.addressLine2}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        <div>
          <label htmlFor="postalCode" className="text-sm font-medium text-foreground">
            {t("postalCode")}
          </label>
          <input
            id="postalCode"
            name="postalCode"
            defaultValue={defaultValues?.postalCode}
            aria-invalid={!!errors.postalCode}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <FieldError messages={errors.postalCode} />
        </div>

        <div>
          <label htmlFor="city" className="text-sm font-medium text-foreground">
            {t("city")}
          </label>
          <input
            id="city"
            name="city"
            defaultValue={defaultValues?.city}
            aria-invalid={!!errors.city}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <FieldError messages={errors.city} />
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingLabel={tCommon("loading")}>{t("next")}</SubmitButton>
      </div>
    </form>
  );
}
