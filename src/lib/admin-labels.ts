import type {
  DocumentType,
  LicenceTiming,
  PreQualificationStatus,
  ProcedureType,
  RequestStatus,
} from "@prisma/client";

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
  ID_DOCUMENT_FRONT: "Pièce d'identité (recto)",
  ID_DOCUMENT_BACK: "Pièce d'identité (verso)",
  ID_PHOTO: "Photo d'identité (4x4)",
  SIGNATURE_SPECIMEN: "Spécimen de signature",
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

export const PRE_QUALIFICATION_STATUS_LABELS: Record<PreQualificationStatus, string> = {
  PENDING: "À examiner",
  ELIGIBLE: "Éligible",
  NOT_ELIGIBLE: "Non éligible",
  CONTACTED: "Recontacté",
};

export const PRE_QUALIFICATION_STATUS_STYLES: Record<PreQualificationStatus, string> = {
  PENDING: "bg-primary/10 text-primary",
  ELIGIBLE: "bg-accent/10 text-accent",
  NOT_ELIGIBLE: "bg-destructive/10 text-destructive",
  CONTACTED: "bg-secondary/10 text-secondary",
};

export const ALL_PRE_QUALIFICATION_STATUSES: PreQualificationStatus[] = [
  "PENDING",
  "ELIGIBLE",
  "NOT_ELIGIBLE",
  "CONTACTED",
];

export const LICENCE_TIMING_LABELS: Record<LicenceTiming, string> = {
  BEFORE_RESIDENCY: "Avant la résidence en Italie",
  AFTER_RESIDENCY: "Après la résidence en Italie",
};
