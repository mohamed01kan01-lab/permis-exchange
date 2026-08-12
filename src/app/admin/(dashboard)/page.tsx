import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getCountryName } from "@/lib/constants/countries";
import {
  STATUS_LABELS,
  STATUS_STYLES,
  PROCEDURE_LABELS,
} from "@/lib/admin-labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminSubmissionsPage() {
  const requests = await prisma.licenseExchangeRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { documents: true },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Demandes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {requests.length} dossier{requests.length > 1 ? "s" : ""} au total.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Démarche</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Reçue le</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id} className="group">
                <TableCell>
                  <Link
                    href={`/admin/submissions/${request.id}`}
                    className="block"
                  >
                    <span className="font-medium text-foreground group-hover:underline">
                      {request.firstName} {request.lastName}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {request.email}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-foreground">
                  {getCountryName(request.destinationCountry)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {PROCEDURE_LABELS[request.procedureType]}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {request.documents.length}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[request.status]}`}
                  >
                    {STATUS_LABELS[request.status]}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(request.createdAt)}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/submissions/${request.id}`}>
                    <IconChevronRight
                      className="size-4 text-muted-foreground"
                      aria-hidden
                    />
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  Aucune demande pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
