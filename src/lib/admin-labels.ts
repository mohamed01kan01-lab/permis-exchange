import type { DocumentType, ProcedureType, RequestStatus } from "@prisma/client";

export const STATUS_LABELS: Record<RequestStatus, string> = {
  SUBMITTED: "Reçue",
  IN_REVIEW: "En vérification",
  AWAITING_DOCUMENTS: "Documents manquants",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  REJECTED: "Rejetée",
  CANCELLED: "Annulée",
};

export const STATUS_STYLES: Record<RequestStatus, string> = {
  SUBMITTED: "bg-primary/10 text-primary",
  IN_REVIEW: "bg-secondary/10 text-secondary",
  AWAITING_DOCUMENTS: "bg-destructive/10 text-destructive",
  IN_PROGRESS: "bg-accent/10 text-accent",
  COMPLETED: "bg-accent/10 text-accent",
  REJECTED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

export const PROCEDURE_LABELS: Record<ProcedureType, string> = {
  EU_EEA_EXCHANGE: "Échange UE/EEE",
  NON_EU_CONVERSION: "Conversion hors UE",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  LICENSE_FRONT: "Permis (recto)",
  LICENSE_BACK: "Permis (verso)",
  ID_DOCUMENT: "Pièce d'identité",
  PROOF_OF_ADDRESS: "Justificatif de domicile",
  SWORN_TRANSLATION: "Traduction assermentée",
  OTHER: "Autre document",
};

export const ALL_STATUSES: RequestStatus[] = [
  "SUBMITTED",
  "IN_REVIEW",
  "AWAITING_DOCUMENTS",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
];
