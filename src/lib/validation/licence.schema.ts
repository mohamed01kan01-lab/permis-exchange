import { z } from "zod";

export const licenceSchema = z.object({
  licenceIssuingCountry: z.string().length(2, "Sélectionnez un pays"),
  licenceNumber: z.string().trim().min(1, "Le numéro de permis est requis").max(40),
  licenceIssueDate: z
    .string()
    .min(1, "La date de délivrance est requise")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Date invalide"),
  licenceExpiryDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Date invalide"),
  licenceCategories: z
    .array(z.string())
    .min(1, "Sélectionnez au moins une catégorie"),
});

export type LicenceData = z.infer<typeof licenceSchema>;
