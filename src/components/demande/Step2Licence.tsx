"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { validateLicenceStep, type StepState } from "@/app/[locale]/demande/actions";
import type { LicenceData } from "@/lib/validation/licence.schema";
import { COUNTRIES } from "@/lib/constants/countries";
import { LICENCE_CATEGORIES } from "@/lib/constants/licence-categories";
import { FieldError } from "./FieldError";
import { SubmitButton } from "./SubmitButton";
import { cn } from "@/lib/utils";
import { useShakeOnError } from "@/hooks/useShakeOnError";

const initialState: StepState<LicenceData> = { success: false };

export function Step2Licence({
  defaultValues,
  onComplete,
  onBack,
}: {
  defaultValues?: Partial<LicenceData>;
  onComplete: (data: LicenceData) => void;
  onBack: () => void;
}) {
  const t = useTranslations("demande.licence");
  const tCommon = useTranslations("demande.common");
  const [state, formAction] = useActionState(validateLicenceStep, initialState);
  const [categories, setCategories] = useState<string[]>(
    defaultValues?.licenceCategories ?? [],
  );

  useEffect(() => {
    if (state.success && state.values) onComplete(state.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const errors = state.errors ?? {};
  const formRef = useShakeOnError<HTMLFormElement>(state.errors);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5" noValidate>
      <div>
        <label
          htmlFor="licenceIssuingCountry"
          className="text-sm font-medium text-foreground"
        >
          {t("licenceIssuingCountry")}
        </label>
        <select
          id="licenceIssuingCountry"
          name="licenceIssuingCountry"
          defaultValue={defaultValues?.licenceIssuingCountry ?? ""}
          aria-invalid={!!errors.licenceIssuingCountry}
          className="mt-1.5 h-10 w-full max-w-xs rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
        <FieldError messages={errors.licenceIssuingCountry} />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-foreground">
          {t("licenceCategories")}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {LICENCE_CATEGORIES.map((category) => {
            const checked = categories.includes(category);
            return (
              <label
                key={category}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                  checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-foreground hover:bg-muted",
                )}
              >
                <input
                  type="checkbox"
                  name="licenceCategories"
                  value={category}
                  checked={checked}
                  onChange={(event) => {
                    setCategories((prev) =>
                      event.target.checked
                        ? [...prev, category]
                        : prev.filter((c) => c !== category),
                    );
                  }}
                  className="sr-only"
                />
                {category}
              </label>
            );
          })}
        </div>
        <FieldError messages={errors.licenceCategories} />
      </fieldset>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {t("back")}
        </button>
        <SubmitButton pendingLabel={tCommon("loading")}>{t("next")}</SubmitButton>
      </div>
    </form>
  );
}
