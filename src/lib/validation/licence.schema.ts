import { z } from "zod";

export const licenceSchema = z.object({
  licenceIssuingCountry: z.string().length(2, "selectCountry"),
  licenceNumber: z.string().trim().min(1, "required").max(40),
  licenceIssueDate: z
    .string()
    .min(1, "required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "invalidDate"),
  licenceExpiryDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "invalidDate"),
  licenceCategories: z
    .array(z.string())
    .min(1, "selectCategory"),
});

export type LicenceData = z.infer<typeof licenceSchema>;
