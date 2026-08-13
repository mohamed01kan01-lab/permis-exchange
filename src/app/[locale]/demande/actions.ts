"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { identitySchema, type IdentityData } from "@/lib/validation/identity.schema";
import { licenceSchema, type LicenceData } from "@/lib/validation/licence.schema";
import {
  destinationSchema,
  type DestinationData,
} from "@/lib/validation/destination.schema";
import { documentsSchema, type DocumentsData } from "@/lib/validation/documents.schema";
import { requestSchema } from "@/lib/validation/request.schema";
import { getCountryName } from "@/lib/constants/countries";
import { sendNewSubmissionEmail } from "@/lib/email";

export type StepState<T> = {
  success: boolean;
  errors?: Record<string, string[]>;
  values?: T;
};

function toStepState<T>(result: z.ZodSafeParseResult<T>): StepState<T> {
  if (result.success) {
    return { success: true, values: result.data };
  }
  return {
    success: false,
    errors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
  };
}

export async function validateIdentityStep(
  _prevState: StepState<IdentityData>,
  formData: FormData,
): Promise<StepState<IdentityData>> {
  const raw = Object.fromEntries(formData.entries());
  return toStepState(identitySchema.safeParse(raw));
}

export async function validateLicenceStep(
  _prevState: StepState<LicenceData>,
  formData: FormData,
): Promise<StepState<LicenceData>> {
  const raw = {
    ...Object.fromEntries(formData.entries()),
    licenceCategories: formData.getAll("licenceCategories"),
  };
  return toStepState(licenceSchema.safeParse(raw));
}

export async function validateDestinationStep(
  _prevState: StepState<DestinationData>,
  formData: FormData,
): Promise<StepState<DestinationData>> {
  const raw = Object.fromEntries(formData.entries());
  return toStepState(destinationSchema.safeParse(raw));
}

export async function validateDocumentsStep(
  _prevState: StepState<DocumentsData>,
  formData: FormData,
): Promise<StepState<DocumentsData>> {
  const raw = {
    documents: JSON.parse((formData.get("documents") as string) ?? "[]"),
  };
  return toStepState(documentsSchema.safeParse(raw));
}

export type SubmitState = {
  success: boolean;
  errors?: Record<string, string[]>;
  requestId?: string;
};

export async function submitRequest(
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const raw = {
    firstName: formData.get("firstName") ?? "",
    lastName: formData.get("lastName") ?? "",
    dateOfBirth: formData.get("dateOfBirth") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    addressLine1: formData.get("addressLine1") ?? "",
    addressLine2: formData.get("addressLine2") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    city: formData.get("city") ?? "",
    countryOfResidence: formData.get("countryOfResidence") ?? "",
    licenceIssuingCountry: formData.get("licenceIssuingCountry") ?? "",
    licenceNumber: formData.get("licenceNumber") ?? "",
    licenceIssueDate: formData.get("licenceIssueDate") ?? "",
    licenceExpiryDate: formData.get("licenceExpiryDate") ?? "",
    licenceCategories: formData.getAll("licenceCategories"),
    procedureType: formData.get("procedureType") ?? "",
    documents: JSON.parse((formData.get("documents") as string) ?? "[]"),
    consent: formData.get("consent") === "on",
  };

  const result = requestSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;
  const locale = (formData.get("locale") as string) || "fr";

  const created = await prisma.licenseExchangeRequest.create({
    data: {
      locale,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: new Date(data.dateOfBirth),
      email: data.email,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || null,
      postalCode: data.postalCode,
      city: data.city,
      countryOfResidence: data.countryOfResidence,
      licenceIssuingCountry: data.licenceIssuingCountry,
      licenceNumber: data.licenceNumber,
      licenceIssueDate: new Date(data.licenceIssueDate),
      licenceExpiryDate: data.licenceExpiryDate
        ? new Date(data.licenceExpiryDate)
        : null,
      licenceCategories: data.licenceCategories,
      destinationCountry: "IT",
      procedureType: data.procedureType,
      consentAt: new Date(),
      documents: {
        create: data.documents.map((doc) => ({
          type: doc.type,
          publicId: doc.publicId,
          url: doc.url,
          format: doc.format,
          fileName: doc.fileName,
        })),
      },
    },
  });

  // La notification par email ne doit jamais faire échouer la soumission du
  // client : son échec est journalisé mais n'empêche pas la réponse succès.
  try {
    await sendNewSubmissionEmail({
      requestId: created.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      destinationCountryName: getCountryName("IT"),
      procedureLabel:
        data.procedureType === "EU_EEA_EXCHANGE"
          ? "Échange UE / EEE"
          : "Conversion hors UE",
    });
  } catch (err) {
    console.error("[submitRequest] Notification email échouée :", err);
  }

  return { success: true, requestId: created.id };
}
