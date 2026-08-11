"use client";

import { useActionState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { submitRequest, type SubmitState } from "@/app/[locale]/demande/actions";
import type { IdentityData } from "@/lib/validation/identity.schema";
import type { LicenceData } from "@/lib/validation/licence.schema";
import type { DestinationData } from "@/lib/validation/destination.schema";
import type { UploadedDocument } from "@/lib/validation/documents.schema";
import { getCountryName } from "@/lib/constants/countries";
import { FieldError } from "./FieldError";
import { SubmitButton } from "./SubmitButton";

const initialState: SubmitState = { success: false };

type FullData = IdentityData & LicenceData & DestinationData & {
  documents: UploadedDocument[];
};

export function Step5Review({
  data,
  onBack,
}: {
  data: FullData;
  onBack: () => void;
}) {
  const t = useTranslations("demande.review");
  const tDocs = useTranslations("demande.documents");
  const tCommon = useTranslations("demande.common");
  const locale = useLocale();
  const router = useRouter();
  const [state, formAction] = useActionState(submitRequest, initialState);

  useEffect(() => {
    if (state.success && state.requestId) {
      router.push(`/demande/confirmation?ref=${state.requestId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const documentLabels: Record<UploadedDocument["type"], string> = {
    LICENSE_FRONT: tDocs("licenseFront"),
    LICENSE_BACK: tDocs("licenseBack"),
    ID_DOCUMENT: tDocs("idDocument"),
    PROOF_OF_ADDRESS: tDocs("proofOfAddress"),
    SWORN_TRANSLATION: tDocs("swornTranslation"),
  };

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="firstName" value={data.firstName} />
      <input type="hidden" name="lastName" value={data.lastName} />
      <input type="hidden" name="dateOfBirth" value={data.dateOfBirth} />
      <input type="hidden" name="email" value={data.email} />
      <input type="hidden" name="phone" value={data.phone} />
      <input type="hidden" name="addressLine1" value={data.addressLine1} />
      <input type="hidden" name="addressLine2" value={data.addressLine2 ?? ""} />
      <input type="hidden" name="postalCode" value={data.postalCode} />
      <input type="hidden" name="city" value={data.city} />
      <input type="hidden" name="countryOfResidence" value={data.countryOfResidence} />
      <input
        type="hidden"
        name="licenceIssuingCountry"
        value={data.licenceIssuingCountry}
      />
      <input type="hidden" name="licenceNumber" value={data.licenceNumber} />
      <input type="hidden" name="licenceIssueDate" value={data.licenceIssueDate} />
      <input
        type="hidden"
        name="licenceExpiryDate"
        value={data.licenceExpiryDate ?? ""}
      />
      {data.licenceCategories.map((category) => (
        <input key={category} type="hidden" name="licenceCategories" value={category} />
      ))}
      <input type="hidden" name="destinationCountry" value={data.destinationCountry} />
      <input type="hidden" name="procedureType" value={data.procedureType} />
      <input type="hidden" name="documents" value={JSON.stringify(data.documents)} />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">{t("identitySection")}</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <ReviewRow label={t("fullName")} value={`${data.firstName} ${data.lastName}`} />
          <ReviewRow label={t("email")} value={data.email} />
          <ReviewRow label={t("phone")} value={data.phone} />
          <ReviewRow
            label={t("address")}
            value={`${data.addressLine1}, ${data.postalCode} ${data.city}`}
          />
          <ReviewRow
            label={t("residenceCountry")}
            value={getCountryName(data.countryOfResidence)}
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">{t("licenceSection")}</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <ReviewRow
            label={t("issuingCountry")}
            value={getCountryName(data.licenceIssuingCountry)}
          />
          <ReviewRow label={t("licenceNumber")} value={data.licenceNumber} />
          <ReviewRow label={t("categories")} value={data.licenceCategories.join(", ")} />
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">{t("destinationSection")}</h3>
        <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <ReviewRow
            label={t("destinationCountry")}
            value={getCountryName(data.destinationCountry)}
          />
          <ReviewRow
            label={t("procedure")}
            value={
              data.procedureType === "EU_EEA_EXCHANGE"
                ? tCommon("euExchange")
                : tCommon("nonEuConversion")
            }
          />
        </dl>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground">{t("documentsSection")}</h3>
        <ul className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
          {data.documents.map((doc) => (
            <li key={doc.publicId}>
              {documentLabels[doc.type]} — {doc.fileName}
            </li>
          ))}
        </ul>
      </section>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 size-4 rounded border-input"
          />
          {t("consent")}
        </label>
        <FieldError messages={state.errors?.consent} />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          {t("back")}
        </button>
        <SubmitButton pendingLabel={t("submitting")}>{t("submit")}</SubmitButton>
      </div>
    </form>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
