"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { validateHistoryStep, type StepState } from "@/app/[locale]/questionnaire/actions";
import type { HistoryStepData } from "@/lib/validation/prequalification.schema";
import { FieldError } from "@/components/demande/FieldError";
import { SubmitButton } from "@/components/demande/SubmitButton";
import { useShakeOnError } from "@/hooks/useShakeOnError";
import { YesNoField } from "./YesNoField";
import { cn } from "@/lib/utils";

const initialState: StepState<HistoryStepData> = { success: false };

export function StepHistory({
  defaultValues,
  onComplete,
  onBack,
}: {
  defaultValues?: Partial<HistoryStepData>;
  onComplete: (data: HistoryStepData) => void;
  onBack: () => void;
}) {
  const t = useTranslations("questionnaire.history");
  const tCommon = useTranslations("questionnaire.common");
  const [state, formAction] = useActionState(validateHistoryStep, initialState);
  const [timing, setTiming] = useState(defaultValues?.licenceTiming ?? "");
  const [byExchange, setByExchange] = useState(
    defaultValues?.licenceObtainedByExchange ?? "",
  );
  const [previousAttempt, setPreviousAttempt] = useState(
    defaultValues?.previousConversionAttempt ?? "",
  );

  useEffect(() => {
    if (state.success && state.values) onComplete(state.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const errors = state.errors ?? {};
  const formRef = useShakeOnError<HTMLFormElement>(state.errors);

  const timingOptions = [
    { value: "BEFORE_RESIDENCY", label: t("timingBefore") },
    { value: "AFTER_RESIDENCY", label: t("timingAfter") },
  ];

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6" noValidate>
      <fieldset>
        <legend className="text-sm font-medium text-foreground">{t("timingQuestion")}</legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {timingOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-colors",
                timing === option.value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-foreground hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name="licenceTiming"
                value={option.value}
                checked={timing === option.value}
                onChange={() => setTiming(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError messages={errors.licenceTiming} />
      </fieldset>

      <YesNoField
        name="licenceObtainedByExchange"
        label={t("obtainedByExchange")}
        value={byExchange}
        onChange={setByExchange}
        yesLabel={tCommon("yes")}
        noLabel={tCommon("no")}
      />
      <FieldError messages={errors.licenceObtainedByExchange} />

      <YesNoField
        name="previousConversionAttempt"
        label={t("previousAttempt")}
        value={previousAttempt}
        onChange={setPreviousAttempt}
        yesLabel={tCommon("yes")}
        noLabel={tCommon("no")}
      />
      <FieldError messages={errors.previousConversionAttempt} />

      {previousAttempt === "true" && (
        <div>
          <label
            htmlFor="previousConversionResult"
            className="text-sm font-medium text-foreground"
          >
            {t("previousResult")}
          </label>
          <textarea
            id="previousConversionResult"
            name="previousConversionResult"
            rows={3}
            defaultValue={defaultValues?.previousConversionResult}
            className="mt-1.5 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <FieldError messages={errors.previousConversionResult} />
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {tCommon("back")}
        </button>
        <SubmitButton pendingLabel={tCommon("loading")}>{tCommon("next")}</SubmitButton>
      </div>
    </form>
  );
}
