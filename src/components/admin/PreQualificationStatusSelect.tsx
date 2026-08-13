"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  ALL_PRE_QUALIFICATION_STATUSES,
  PRE_QUALIFICATION_STATUS_LABELS,
} from "@/lib/admin-labels";
import { updatePreQualificationStatus } from "@/app/admin/(dashboard)/questionnaire/[id]/actions";
import type { PreQualificationStatus } from "@prisma/client";

export function PreQualificationStatusSelect({
  id,
  status,
}: {
  id: string;
  status: PreQualificationStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(event) => {
        const next = event.target.value;
        startTransition(async () => {
          try {
            await updatePreQualificationStatus(id, next);
            toast.success("Statut mis à jour.");
          } catch {
            toast.error("Impossible de mettre à jour le statut.");
          }
        });
      }}
      className="h-9 cursor-pointer rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
    >
      {ALL_PRE_QUALIFICATION_STATUSES.map((s) => (
        <option key={s} value={s}>
          {PRE_QUALIFICATION_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
