import { z } from "zod";

export const licenceTimings = ["BEFORE_RESIDENCY", "AFTER_RESIDENCY"] as const;

export const licenceStep = z.object({
  licenceIssuingCountry: z.string().length(2, "selectCountry"),
  licenceStillValid: z.enum(["true", "false"], { message: "pleaseAnswer" }),
  licenceCategories: z.array(z.string()).min(1, "selectCategory"),
});
export type LicenceStepData = z.infer<typeof licenceStep>;

export const residencyStep = z.object({
  hasItalianResidency: z.enum(["true", "false"], { message: "pleaseAnswer" }),
  italianResidencySince: z
    .string()
    .min(1, "required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "invalidDate"),
});
export type ResidencyStepData = z.infer<typeof residencyStep>;

export const historyStep = z.object({
  licenceTiming: z.enum(licenceTimings, { message: "pleaseAnswer" }),
  licenceObtainedByExchange: z.enum(["true", "false"], { message: "pleaseAnswer" }),
  previousConversionAttempt: z.enum(["true", "false"], { message: "pleaseAnswer" }),
  previousConversionResult: z.string().trim().max(500).optional().or(z.literal("")),
});
export type HistoryStepData = z.infer<typeof historyStep>;

export const contactStep = z.object({
  firstName: z.string().trim().min(1, "required").max(80),
  lastName: z.string().trim().min(1, "required").max(80),
  email: z.string().trim().min(1, "required").email("invalidEmail"),
  phone: z.string().trim().min(6, "invalidPhone").max(30),
});
export type ContactStepData = z.infer<typeof contactStep>;

export const preQualificationSchema = licenceStep
  .extend(residencyStep.shape)
  .extend(historyStep.shape)
  .extend(contactStep.shape);

export type PreQualificationData = z.infer<typeof preQualificationSchema>;
