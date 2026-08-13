"use client";

import { useActionState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  submitPreQualification,
  type SubmitState,
} from "@/app/[locale]/questionnaire/actions";
import type {
  LicenceStepData,
  ResidencyStepData,
  HistoryStepData,
  ContactStepData,
} from "@/lib/validation/prequalification.schema";
import { getCountryName } from "@/lib/constants/countries";
import { FieldError } from "@/components/demande/FieldError";
import { SubmitButton } from "@/components/demande/SubmitButton";

const initialState: SubmitState = { success: false };

type FullData = LicenceStepData & ResidencyStepData & HistoryStepData & ContactStepData;

export function StepReview({ data, onBack }: { data: FullData; onBack: () => void }) {
  const t = useTranslations("questionnaire.review");
  const tCommon = useTranslations("questionnaire.common");
  const tHistory = useTranslations("questionnaire.history");
  const locale = useLocale();
  const router = useRouter();
  const [state, formAction] = useActionState(submitPreQualification, initialState);

  useEffect(() => {
    if (state.success && state.id) {
      router.push(`/questionnaire/confirmation?ref=${state.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const yesNo = (v: string) => (v === "true" ? tCommon("yes") : tCommon("no"));

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="licenceIssuingCountry" value={data.licenceIssuingCountry} />
      <input type="hidden" name="licenceStillValid" value={data.licenceStillValid} />
      {data.licenceCategories.map((c) => (
        <input key={c} type="hidden" name="licenceCategories" value={c} />
      ))}
      <input type="hidden" name="hasItalianResidency" value={data.hasItalianResidency} />
      <input
        type="hidden"
        name="italianResidencySince"
        value={data.italianResidencySince}
      />
      <input type="hidden" name="licenceTiming" value={data.licenceTiming} />
      <input
        type="hidden"
        name="licenceObtainedByExchange"
        value={data.licenceObtainedByExchange}
      />
      <input
        type="hidden"
        name="previousConversionAttempt"
        value={data.previousConversionAttempt}
      />
      <input
        type="hidden"
        name="previousConversionResult"
        value={data.previousConversionResult ?? ""}
      />
      <input type="hidden" name="firstName" value={data.firstName} />
      <input type="hidden" name="lastName" value={data.lastName} />
      <input type="hidden" name="email" value={data.email} />
      <input type="hidden" name="phone" value={data.phone} />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">{t("licenceSection")}</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Row label={t("country")} value={getCountryName(data.licenceIssuingCountry)} />
          <Row label={t("stillValid")} value={yesNo(data.licenceStillValid)} />
          <Row label={t("categories")} value={data.licenceCategories.join(", ")} />
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">{t("residencySection")}</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Row label={t("hasResidency")} value={yesNo(data.hasItalianResidency)} />
          <Row label={t("since")} value={data.italianResidencySince} />
          <Row
            label={t("timing")}
            value={
              data.licenceTiming === "BEFORE_RESIDENCY"
                ? tHistory("timingBefore")
                : tHistory("timingAfter")
            }
          />
          <Row
            label={t("obtainedByExchange")}
            value={yesNo(data.licenceObtainedByExchange)}
          />
          <Row
            label={t("previousAttempt")}
            value={yesNo(data.previousConversionAttempt)}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">{t("contactSection")}</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <Row label={t("name")} value={`${data.firstName} ${data.lastName}`} />
          <Row label={t("email")} value={data.email} />
          <Row label={t("phone")} value={data.phone} />
        </dl>
      </section>

      <FieldError messages={state.errors?.consent} />

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {tCommon("back")}
        </button>
        <SubmitButton pendingLabel={t("submitting")}>{t("submit")}</SubmitButton>
      </div>
    </form>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
