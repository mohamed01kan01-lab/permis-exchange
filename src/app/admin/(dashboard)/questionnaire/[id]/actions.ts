"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEligibilityInviteEmail } from "@/lib/email";
import { isEuEeaCountry } from "@/lib/constants/countries";
import { ALL_PRE_QUALIFICATION_STATUSES } from "@/lib/admin-labels";
import type { PreQualificationStatus } from "@prisma/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Non authentifié.");
  }
}

export async function updatePreQualificationStatus(id: string, status: string) {
  await requireSession();

  if (!ALL_PRE_QUALIFICATION_STATUSES.includes(status as PreQualificationStatus)) {
    throw new Error("Statut invalide.");
  }

  await prisma.preQualification.update({
    where: { id },
    data: { status: status as PreQualificationStatus },
  });

  revalidatePath(`/admin/questionnaire/${id}`);
  revalidatePath("/admin/questionnaire");
}

export async function sendEligibilityInvite(id: string) {
  await requireSession();

  const preQualification = await prisma.preQualification.findUnique({ where: { id } });
  if (!preQualification) {
    throw new Error("Questionnaire introuvable.");
  }

  const procedureType = isEuEeaCountry(preQualification.licenceIssuingCountry)
    ? "EU_EEA_EXCHANGE"
    : "NON_EU_CONVERSION";

  const demandeUrl = `${APP_URL}/${preQualification.locale}/demande?licenceCountry=${preQualification.licenceIssuingCountry}&procedureType=${procedureType}`;

  await sendEligibilityInviteEmail({
    to: preQualification.email,
    firstName: preQualification.firstName,
    demandeUrl,
  });

  await prisma.preQualification.update({
    where: { id },
    data: { status: "CONTACTED" },
  });

  revalidatePath(`/admin/questionnaire/${id}`);
  revalidatePath("/admin/questionnaire");
}
