"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { validateLicenceStep, type StepState } from "@/app/[locale]/questionnaire/actions";
import type { LicenceStepData } from "@/lib/validation/prequalification.schema";
import { COUNTRIES } from "@/lib/constants/countries";
import { LICENCE_CATEGORIES } from "@/lib/constants/licence-categories";
import { FieldError } from "@/components/demande/FieldError";
import { SubmitButton } from "@/components/demande/SubmitButton";
import { useShakeOnError } from "@/hooks/useShakeOnError";
import { YesNoField } from "./YesNoField";
import { cn } from "@/lib/utils";

const initialState: StepState<LicenceStepData> = { success: false };

export function StepLicence({
  defaultValues,
  onComplete,
}: {
  defaultValues?: Partial<LicenceStepData>;
  onComplete: (data: LicenceStepData) => void;
}) {
  const t = useTranslations("questionnaire.licence");
  const tCommon = useTranslations("questionnaire.common");
  const [state, formAction] = useActionState(validateLicenceStep, initialState);
  const [stillValid, setStillValid] = useState(defaultValues?.licenceStillValid ?? "");
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
    <form ref={formRef} action={formAction} className="flex flex-col gap-6" noValidate>
      <div>
        <label htmlFor="licenceIssuingCountry" className="text-sm font-medium text-foreground">
          {t("country")}
        </label>
        <select
          id="licenceIssuingCountry"
          name="licenceIssuingCountry"
          defaultValue={defaultValues?.licenceIssuingCountry ?? ""}
          aria-invalid={!!errors.licenceIssuingCountry}
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
        <FieldError messages={errors.licenceIssuingCountry} />
      </div>

      <YesNoField
        name="licenceStillValid"
        label={t("stillValid")}
        value={stillValid}
        onChange={setStillValid}
        yesLabel={tCommon("yes")}
        noLabel={tCommon("no")}
      />
      <FieldError messages={errors.licenceStillValid} />

      <fieldset>
        <legend className="text-sm font-medium text-foreground">{t("categories")}</legend>
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

      <div className="flex justify-end">
        <SubmitButton pendingLabel={tCommon("loading")}>{tCommon("next")}</SubmitButton>
      </div>
    </form>
  );
}
