import { z } from "zod";

export const identitySchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(80),
  lastName: z.string().trim().min(1, "Le nom est requis").max(80),
  dateOfBirth: z
    .string()
    .min(1, "La date de naissance est requise")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Date invalide"),
  email: z.string().trim().min(1, "L'email est requis").email("Adresse email invalide"),
  phone: z.string().trim().min(6, "Numéro de téléphone invalide").max(30),
  addressLine1: z.string().trim().min(1, "L'adresse est requise").max(160),
  addressLine2: z.string().trim().max(160).optional().or(z.literal("")),
  postalCode: z.string().trim().min(1, "Le code postal est requis").max(20),
  city: z.string().trim().min(1, "La ville est requise").max(80),
  countryOfResidence: z.string().length(2, "Sélectionnez un pays"),
});

export type IdentityData = z.infer<typeof identitySchema>;
