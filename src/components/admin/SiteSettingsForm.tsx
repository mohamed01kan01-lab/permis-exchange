"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { updateSiteSettings } from "@/app/admin/(dashboard)/settings/actions";

export function SiteSettingsForm({
  defaultValues,
}: {
  defaultValues: { contactEmail: string; contactPhone: string; contactAddress: string };
}) {
  const [contactEmail, setContactEmail] = useState(defaultValues.contactEmail);
  const [contactPhone, setContactPhone] = useState(defaultValues.contactPhone);
  const [contactAddress, setContactAddress] = useState(defaultValues.contactAddress);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await updateSiteSettings({ contactEmail, contactPhone, contactAddress });
        toast.success("Coordonnées mises à jour.");
      } catch {
        toast.error("Impossible d'enregistrer les coordonnées.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="contactEmail" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div>
        <label htmlFor="contactPhone" className="text-sm font-medium text-foreground">
          Téléphone
        </label>
        <input
          id="contactPhone"
          type="tel"
          placeholder="+39 000 000 0000"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div>
        <label htmlFor="contactAddress" className="text-sm font-medium text-foreground">
          Adresse
        </label>
        <input
          id="contactAddress"
          type="text"
          value={contactAddress}
          onChange={(e) => setContactAddress(e.target.value)}
          className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
