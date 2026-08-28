import { notFound } from "next/navigation";
import { IconFileTypePdf, IconExternalLink, IconMail, IconPhone } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getCountryName } from "@/lib/constants/countries";
import { PROCEDURE_LABELS, DOCUMENT_TYPE_LABELS } from "@/lib/admin-labels";
import { StatusSelect } from "@/components/admin/StatusSelect";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request = await prisma.licenseExchangeRequest.findUnique({
    where: { id },
    include: { documents: true },
  });

  if (!request) {
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
            {request.firstName} {request.lastName}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <IconMail className="size-3.5" aria-hidden /> {request.email}
            </span>
            <span className="flex items-center gap-1.5">
              <IconPhone className="size-3.5" aria-hidden /> {request.phone}
            </span>
          </div>
        </div>
        <StatusSelect requestId={request.id} status={request.status} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Identité</h2>
          <dl className="mt-4 flex flex-col gap-3">
            <InfoRow
              label="Date de naissance"
              value={dateFormatter.format(request.dateOfBirth)}
            />
            <InfoRow
              label="Adresse"
              value={`${request.addressLine1}${request.addressLine2 ? ", " + request.addressLine2 : ""}, ${request.postalCode} ${request.city}`}
            />
            <InfoRow
              label="Pays de résidence"
              value={getCountryName(request.countryOfResidence)}
            />
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Permis de conduire actuel</h2>
          <dl className="mt-4 flex flex-col gap-3">
            <InfoRow
              label="Pays émetteur"
              value={getCountryName(request.licenceIssuingCountry)}
            />
            <InfoRow label="Numéro" value={request.licenceNumber} />
            <InfoRow
              label="Date de délivrance"
              value={dateFormatter.format(request.licenceIssueDate)}
            />
            <InfoRow
              label="Catégories"
              value={request.licenceCategories.join(", ") || "—"}
            />
          </dl>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Destination</h2>
          <dl className="mt-4 flex flex-col gap-3">
            <InfoRow
              label="Pays de destination"
              value={getCountryName(request.destinationCountry)}
            />
            <InfoRow
              label="Type de démarche"
              value={PROCEDURE_LABELS[request.procedureType]}
            />
            <InfoRow
              label="Reçue le"
              value={dateFormatter.format(request.createdAt)}
            />
          </dl>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold text-foreground">
          Documents ({request.documents.length})
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {request.documents.map((doc) => {
            const isPdf = doc.format === "pdf";
            return (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-xl border border-border transition-colors hover:border-primary/40"
              >
                <div className="flex aspect-square items-center justify-center bg-muted">
                  {isPdf ? (
                    <IconFileTypePdf className="size-10 text-muted-foreground" aria-hidden />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doc.url}
                      alt={DOCUMENT_TYPE_LABELS[doc.type]}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 p-2.5">
                  <span className="truncate text-xs font-medium text-foreground">
                    {DOCUMENT_TYPE_LABELS[doc.type]}
                  </span>
                  <IconExternalLink
                    className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary"
                    aria-hidden
                  />
                </div>
              </a>
            );
          })}

          {request.documents.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground">
              Aucun document téléversé.
            </p>
          )}
        </div>
      </section>

      {request.internalNotes && (
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">Notes internes</h2>
          <p className="mt-2 text-sm text-muted-foreground">{request.internalNotes}</p>
        </section>
      )}
    </div>
  );
}
