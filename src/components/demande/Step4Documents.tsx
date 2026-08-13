"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  validateDocumentsStep,
  type StepState,
} from "@/app/[locale]/demande/actions";
import type { DocumentsData, UploadedDocument } from "@/lib/validation/documents.schema";
import { DocumentUploadField } from "./DocumentUploadField";
import { FieldError } from "./FieldError";
import { SubmitButton } from "./SubmitButton";
import { useShakeOnError } from "@/hooks/useShakeOnError";

const initialState: StepState<DocumentsData> = { success: false };

export function Step4Documents({
  defaultValues,
  onComplete,
  onBack,
}: {
  defaultValues?: UploadedDocument[];
  onComplete: (documents: UploadedDocument[]) => void;
  onBack: () => void;
}) {
  const t = useTranslations("demande.documents");
  const tCommon = useTranslations("demande.common");
  const [state, formAction] = useActionState(validateDocumentsStep, initialState);
  const [documents, setDocuments] = useState<UploadedDocument[]>(defaultValues ?? []);

  useEffect(() => {
    if (state.success && state.values) onComplete(state.values.documents);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function upsert(doc: UploadedDocument | undefined, type: UploadedDocument["type"]) {
    setDocuments((prev) => {
      const withoutType = prev.filter((d) => d.type !== type);
      return doc ? [...withoutType, doc] : withoutType;
    });
  }

  const errors = state.errors ?? {};
  const formRef = useShakeOnError<HTMLFormElement>(state.errors);
  const find = (type: UploadedDocument["type"]) =>
    documents.find((d) => d.type === type);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="documents" value={JSON.stringify(documents)} />

      <DocumentUploadField
        type="LICENSE_FRONT"
        label={t("licenseFront")}
        hint={t("hint")}
        required
        value={find("LICENSE_FRONT")}
        onChange={(doc) => upsert(doc, "LICENSE_FRONT")}
      />
      <DocumentUploadField
        type="LICENSE_BACK"
        label={t("licenseBack")}
        hint={t("hint")}
        required
        value={find("LICENSE_BACK")}
        onChange={(doc) => upsert(doc, "LICENSE_BACK")}
      />

      <FieldError messages={errors.documents} />

      <div className="flex justify-between pt-2">
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
