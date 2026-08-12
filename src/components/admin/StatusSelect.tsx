"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/admin-labels";
import { updateRequestStatus } from "@/app/admin/(dashboard)/submissions/[id]/actions";
import type { RequestStatus } from "@prisma/client";

export function StatusSelect({
  requestId,
  status,
}: {
  requestId: string;
  status: RequestStatus;
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
            await updateRequestStatus(requestId, next);
            toast.success("Statut mis à jour.");
          } catch {
            toast.error("Impossible de mettre à jour le statut.");
          }
        });
      }}
      className="h-9 cursor-pointer rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
    >
      {ALL_STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
