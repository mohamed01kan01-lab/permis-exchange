"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { IconSend } from "@tabler/icons-react";
import { sendEligibilityInvite } from "@/app/admin/(dashboard)/questionnaire/[id]/actions";

export function EligibilityInviteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await sendEligibilityInvite(id);
            toast.success("Invitation envoyée au client.");
          } catch {
            toast.error("Impossible d'envoyer l'invitation.");
          }
        });
      }}
      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      <IconSend className="size-4" aria-hidden />
      {isPending ? "Envoi…" : "Inviter à compléter le dossier"}
    </button>
  );
}
