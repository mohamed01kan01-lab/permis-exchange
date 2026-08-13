"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCountryName } from "@/lib/constants/countries";
import { sendNewPreQualificationEmail } from "@/lib/email";
import {
  licenceStep,
  residencyStep,
  historyStep,
  contactStep,
  preQualificationSchema,
  type LicenceStepData,
  type ResidencyStepData,
  type HistoryStepData,
  type ContactStepData,
} from "@/lib/validation/prequalification.schema";

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

export async function validateLicenceStep(
  _prevState: StepState<LicenceStepData>,
  formData: FormData,
): Promise<StepState<LicenceStepData>> {
  const raw = {
    ...Object.fromEntries(formData.entries()),
    licenceCategories: formData.getAll("licenceCategories"),
  };
  return toStepState(licenceStep.safeParse(raw));
}

export async function validateResidencyStep(
  _prevState: StepState<ResidencyStepData>,
  formData: FormData,
): Promise<StepState<ResidencyStepData>> {
  const raw = Object.fromEntries(formData.entries());
  return toStepState(residencyStep.safeParse(raw));
}

export async function validateHistoryStep(
  _prevState: StepState<HistoryStepData>,
  formData: FormData,
): Promise<StepState<HistoryStepData>> {
  const raw = Object.fromEntries(formData.entries());
  return toStepState(historyStep.safeParse(raw));
}

export async function validateContactStep(
  _prevState: StepState<ContactStepData>,
  formData: FormData,
): Promise<StepState<ContactStepData>> {
  const raw = Object.fromEntries(formData.entries());
  return toStepState(contactStep.safeParse(raw));
}

export type SubmitState = {
  success: boolean;
  errors?: Record<string, string[]>;
  id?: string;
};

export async function submitPreQualification(
  _prevState: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const raw = {
    licenceIssuingCountry: formData.get("licenceIssuingCountry") ?? "",
    licenceStillValid: formData.get("licenceStillValid") ?? "",
    licenceCategories: formData.getAll("licenceCategories"),
    hasItalianResidency: formData.get("hasItalianResidency") ?? "",
    italianResidencySince: formData.get("italianResidencySince") ?? "",
    licenceTiming: formData.get("licenceTiming") ?? "",
    licenceObtainedByExchange: formData.get("licenceObtainedByExchange") ?? "",
    previousConversionAttempt: formData.get("previousConversionAttempt") ?? "",
    previousConversionResult: formData.get("previousConversionResult") ?? "",
    firstName: formData.get("firstName") ?? "",
    lastName: formData.get("lastName") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
  };

  const result = preQualificationSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors as Record<string, string[]>,
    };
  }

  const data = result.data;
  const locale = (formData.get("locale") as string) || "fr";

  const created = await prisma.preQualification.create({
    data: {
      locale,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      licenceIssuingCountry: data.licenceIssuingCountry,
      licenceStillValid: data.licenceStillValid === "true",
      licenceCategories: data.licenceCategories,
      hasItalianResidency: data.hasItalianResidency === "true",
      italianResidencySince: new Date(data.italianResidencySince),
      licenceTiming: data.licenceTiming,
      licenceObtainedByExchange: data.licenceObtainedByExchange === "true",
      previousConversionAttempt: data.previousConversionAttempt === "true",
      previousConversionResult: data.previousConversionResult || null,
    },
  });

  try {
    await sendNewPreQualificationEmail({
      id: created.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      licenceIssuingCountryName: getCountryName(data.licenceIssuingCountry),
    });
  } catch (err) {
    console.error("[submitPreQualification] Notification email échouée :", err);
  }

  return { success: true, id: created.id };
}
