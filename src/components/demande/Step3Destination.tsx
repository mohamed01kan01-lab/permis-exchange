"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  validateDestinationStep,
  type StepState,
} from "@/app/[locale]/demande/actions";
import type { DestinationData } from "@/lib/validation/destination.schema";
import { isEuEeaCountry } from "@/lib/constants/countries";
import { FieldError } from "./FieldError";
import { SubmitButton } from "./SubmitButton";
import { cn } from "@/lib/utils";
import { useShakeOnError } from "@/hooks/useShakeOnError";

const initialState: StepState<DestinationData> = { success: false };

export function Step3Destination({
  licenceIssuingCountry,
  defaultValues,
  onComplete,
  onBack,
}: {
  licenceIssuingCountry?: string;
  defaultValues?: Partial<DestinationData>;
  onComplete: (data: DestinationData) => void;
  onBack: () => void;
}) {
  const t = useTranslations("demande.destination");
  const tCommon = useTranslations("demande.common");
  const [state, formAction] = useActionState(validateDestinationStep, initialState);
  const [procedureType, setProcedureType] = useState(
    defaultValues?.procedureType ??
      (licenceIssuingCountry && isEuEeaCountry(licenceIssuingCountry)
        ? "EU_EEA_EXCHANGE"
        : "NON_EU_CONVERSION"),
  );

  useEffect(() => {
    if (state.success && state.values) onComplete(state.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const errors = state.errors ?? {};
  const formRef = useShakeOnError<HTMLFormElement>(state.errors);

  const options = [
    { value: "EU_EEA_EXCHANGE" as const, label: t("euExchange") },
    { value: "NON_EU_CONVERSION" as const, label: t("nonEuConversion") },
  ];

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5" noValidate>
      <fieldset>
        <legend className="text-sm font-medium text-foreground">{t("procedureType")}</legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map((option) => (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-xl border p-4 text-sm font-medium transition-colors",
                procedureType === option.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-foreground hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name="procedureType"
                value={option.value}
                checked={procedureType === option.value}
                onChange={() => setProcedureType(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError messages={errors.procedureType} />
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
