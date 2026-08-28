"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Non authentifié.");
  }
}

export async function updateSiteSettings(data: {
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}) {
  await requireSession();

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  revalidatePath("/admin/settings");
  // Ces infos apparaissent sur /contact, le footer et le widget flottant, sur toutes les locales.
  revalidatePath("/", "layout");
}
