import { notFound } from "next/navigation";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getCountryName } from "@/lib/constants/countries";
import { LICENCE_TIMING_LABELS } from "@/lib/admin-labels";
import { PreQualificationStatusSelect } from "@/components/admin/PreQualificationStatusSelect";
import { EligibilityInviteButton } from "@/components/admin/EligibilityInviteButton";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default async function QuestionnaireDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.preQualification.findUnique({ where: { id } });

  if (!item) {
    notFound();
  }

  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {item.firstName} {item.lastName}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconMail className="size-3.5" aria-hidden /> {item.email}
            </span>
            <span className="flex items-center gap-1.5">
              <IconPhone className="size-3.5" aria-hidden /> {item.phone}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PreQualificationStatusSelect id={item.id} status={item.status} />
          <EligibilityInviteButton id={item.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Permis de conduire actuel</h2>
          <dl className="mt-4 flex flex-col gap-3">
            <InfoRow
              label="Pays émetteur"
              value={getCountryName(item.licenceIssuingCountry)}
            />
            <InfoRow
              label="Toujours valide"
              value={item.licenceStillValid ? "Oui" : "Non"}
            />
            <InfoRow
              label="Catégories"
              value={item.licenceCategories.join(", ") || "—"}
            />
            <InfoRow
              label="Obtenu par échange"
              value={item.licenceObtainedByExchange ? "Oui" : "Non"}
            />
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Résidence & historique</h2>
          <dl className="mt-4 flex flex-col gap-3">
            <InfoRow
              label="Résidence italienne"
              value={item.hasItalianResidency ? "Oui" : "Non"}
            />
            {item.italianResidencySince && (
              <InfoRow
                label="Résident depuis"
                value={dateFormatter.format(item.italianResidencySince)}
              />
            )}
            <InfoRow
              label="Permis de conduire obtenu"
              value={LICENCE_TIMING_LABELS[item.licenceTiming]}
            />
            <InfoRow
              label="Tentative de conversion antérieure"
              value={item.previousConversionAttempt ? "Oui" : "Non"}
            />
            {item.previousConversionResult && (
              <InfoRow
                label="Résultat de la tentative"
                value={item.previousConversionResult}
              />
            )}
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">Suivi</h2>
        <dl className="mt-4 flex flex-col gap-3">
          <InfoRow label="Reçu le" value={dateFormatter.format(item.createdAt)} />
          <InfoRow label="Langue" value={item.locale.toUpperCase()} />
        </dl>
        {item.reviewNotes && (
          <p className="mt-4 text-sm text-muted-foreground">{item.reviewNotes}</p>
        )}
      </section>
    </div>
  );
}
