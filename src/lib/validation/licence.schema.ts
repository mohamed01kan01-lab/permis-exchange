import { z } from "zod";

export const licenceSchema = z.object({
  licenceIssuingCountry: z.string().length(2, "selectCountry"),
  licenceCategories: z
    .array(z.string())
    .min(1, "selectCategory"),
});

export type LicenceData = z.infer<typeof licenceSchema>;
