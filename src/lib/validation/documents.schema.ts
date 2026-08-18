import { z } from "zod";

export const documentTypes = ["LICENSE_FRONT", "LICENSE_BACK"] as const;

export const REQUIRED_DOCUMENT_TYPES = ["LICENSE_FRONT", "LICENSE_BACK"] as const;

export const uploadedDocumentSchema = z.object({
  type: z.enum(documentTypes),
  publicId: z.string().min(1),
  url: z.string().url(),
  format: z.string().optional(),
  fileName: z.string().min(1),
});

export const documentsSchema = z.object({
  documents: z
    .array(uploadedDocumentSchema)
    .refine(
      (docs) =>
        REQUIRED_DOCUMENT_TYPES.every((required) =>
          docs.some((doc) => doc.type === required),
        ),
      "allDocumentsRequired",
    ),
});

export type UploadedDocument = z.infer<typeof uploadedDocumentSchema>;
export type DocumentsData = z.infer<typeof documentsSchema>;
