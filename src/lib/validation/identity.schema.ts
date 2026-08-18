import { z } from "zod";

export const identitySchema = z.object({
  firstName: z.string().trim().min(1, "required").max(80),
  lastName: z.string().trim().min(1, "required").max(80),
  dateOfBirth: z
    .string()
    .min(1, "required")
    .refine((v) => !Number.isNaN(Date.parse(v)), "invalidDate"),
  email: z.string().trim().min(1, "required").email("invalidEmail"),
  phone: z.string().trim().min(6, "invalidPhone").max(30),
  addressLine1: z.string().trim().min(1, "required").max(160),
  addressLine2: z.string().trim().max(160).optional().or(z.literal("")),
  postalCode: z.string().trim().min(1, "required").max(20),
  city: z.string().trim().min(1, "required").max(80),
  countryOfResidence: z.string().length(2, "selectCountry"),
});

export type IdentityData = z.infer<typeof identitySchema>;
