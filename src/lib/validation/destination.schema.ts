import { z } from "zod";

export const procedureTypes = ["EU_EEA_EXCHANGE", "NON_EU_CONVERSION"] as const;

export const destinationSchema = z.object({
  procedureType: z.enum(procedureTypes, {
    message: "Sélectionnez un type de démarche",
  }),
});

export type DestinationData = z.infer<typeof destinationSchema>;
