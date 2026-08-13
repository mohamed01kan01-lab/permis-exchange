import { z } from "zod";

export const licenceTimings = ["BEFORE_RESIDENCY", "AFTER_RESIDENCY"] as const;

export const licenceStep = z.object({
  licenceIssuingCountry: z.string().length(2, "Sélectionnez un pays"),
  licenceStillValid: z.enum(["true", "false"], { message: "Merci de répondre" }),
  licenceCategories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie"),
});
export type LicenceStepData = z.infer<typeof licenceStep>;

export const residencyStep = z.object({
  hasItalianResidency: z.enum(["true", "false"], { message: "Merci de répondre" }),
  italianResidencySince: z
    .string()
    .min(1, "Merci d'indiquer une date")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Date invalide"),
});
export type ResidencyStepData = z.infer<typeof residencyStep>;

export const historyStep = z.object({
  licenceTiming: z.enum(licenceTimings, { message: "Merci de répondre" }),
  licenceObtainedByExchange: z.enum(["true", "false"], { message: "Merci de répondre" }),
  previousConversionAttempt: z.enum(["true", "false"], { message: "Merci de répondre" }),
  previousConversionResult: z.string().trim().max(500).optional().or(z.literal("")),
});
export type HistoryStepData = z.infer<typeof historyStep>;

export const contactStep = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(80),
  lastName: z.string().trim().min(1, "Le nom est requis").max(80),
  email: z.string().trim().min(1, "L'email est requis").email("Adresse email invalide"),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide").max(30),
});
export type ContactStepData = z.infer<typeof contactStep>;

export const preQualificationSchema = licenceStep
  .extend(residencyStep.shape)
  .extend(historyStep.shape)
  .extend(contactStep.shape);

export type PreQualificationData = z.infer<typeof preQualificationSchema>;
