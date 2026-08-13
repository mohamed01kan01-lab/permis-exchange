"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { validateContactStep, type StepState } from "@/app/[locale]/questionnaire/actions";
import type { ContactStepData } from "@/lib/validation/prequalification.schema";
import { FieldError } from "@/components/demande/FieldError";
import { SubmitButton } from "@/components/demande/SubmitButton";
import { useShakeOnError } from "@/hooks/useShakeOnError";

const initialState: StepState<ContactStepData> = { success: false };

export function StepContact({
  defaultValues,
  onComplete,
  onBack,
}: {
  defaultValues?: Partial<ContactStepData>;
  onComplete: (data: ContactStepData) => void;
  onBack: () => void;
}) {
  const t = useTranslations("questionnaire.contact");
  const tCommon = useTranslations("questionnaire.common");
  const [state, formAction] = useActionState(validateContactStep, initialState);

  useEffect(() => {
    if (state.success && state.values) onComplete(state.values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const errors = state.errors ?? {};
  const formRef = useShakeOnError<HTMLFormElement>(state.errors);

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
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <FieldError messages={errors.firstName} />
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
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <FieldError messages={errors.lastName} />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={defaultValues?.email}
            aria-invalid={!!errors.email}
            className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
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
          <p className="mt-1 text-xs text-muted-foreground">{t("phoneHint")}</p>
        </div>
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
