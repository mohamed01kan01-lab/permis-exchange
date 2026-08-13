"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { validateResidencyStep, type StepState } from "@/app/[locale]/questionnaire/actions";
import type { ResidencyStepData } from "@/lib/validation/prequalification.schema";
import { FieldError } from "@/components/demande/FieldError";
import { SubmitButton } from "@/components/demande/SubmitButton";
import { useShakeOnError } from "@/hooks/useShakeOnError";
import { YesNoField } from "./YesNoField";

const initialState: StepState<ResidencyStepData> = { success: false };

export function StepResidency({
  defaultValues,
  onComplete,
  onBack,
}: {
  defaultValues?: Partial<ResidencyStepData>;
  onComplete: (data: ResidencyStepData) => void;
  onBack: () => void;
}) {
  const t = useTranslations("questionnaire.residency");
  const tCommon = useTranslations("questionnaire.common");
  const [state, formAction] = useActionState(validateResidencyStep, initialState);
  const [hasResidency, setHasResidency] = useState(
    defaultValues?.hasItalianResidency ?? "",
  );

  useEffect(() => {
    if (state.success && state.values) onComplete(state.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const errors = state.errors ?? {};
  const formRef = useShakeOnError<HTMLFormElement>(state.errors);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-6" noValidate>
      <YesNoField
        name="hasItalianResidency"
        label={t("hasResidency")}
        value={hasResidency}
        onChange={setHasResidency}
        yesLabel={tCommon("yes")}
        noLabel={tCommon("no")}
      />
      <FieldError messages={errors.hasItalianResidency} />

      <div>
        <label htmlFor="italianResidencySince" className="text-sm font-medium text-foreground">
          {t("since")}
        </label>
        <input
          id="italianResidencySince"
          name="italianResidencySince"
          type="date"
          defaultValue={defaultValues?.italianResidencySince}
          aria-invalid={!!errors.italianResidencySince}
          className="mt-1.5 h-10 w-full max-w-xs rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <FieldError messages={errors.italianResidencySince} />
      </div>

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
