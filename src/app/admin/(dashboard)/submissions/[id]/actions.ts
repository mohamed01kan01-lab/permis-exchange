"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALL_STATUSES } from "@/lib/admin-labels";
import type { RequestStatus } from "@prisma/client";

export async function updateRequestStatus(requestId: string, status: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Non authentifié.");
  }

  if (!ALL_STATUSES.includes(status as RequestStatus)) {
    throw new Error("Statut invalide.");
  }

  await prisma.licenseExchangeRequest.update({
    where: { id: requestId },
    data: { status: status as RequestStatus },
  });

  revalidatePath(`/admin/submissions/${requestId}`);
  revalidatePath("/admin");
}
