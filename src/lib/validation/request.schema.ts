import { z } from "zod";
import { identitySchema } from "./identity.schema";
import { licenceSchema } from "./licence.schema";
import { destinationSchema } from "./destination.schema";
import { documentsSchema } from "./documents.schema";

export const consentSchema = z.object({
  consent: z
    .boolean()
    .refine((v) => v === true, "Vous devez accepter pour continuer"),
});

export const requestSchema = identitySchema
  .extend(licenceSchema.shape)
  .extend(destinationSchema.shape)
  .extend(documentsSchema.shape)
  .extend(consentSchema.shape);

export type RequestData = z.infer<typeof requestSchema>;
