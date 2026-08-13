import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getCountryName } from "@/lib/constants/countries";
import {
  PRE_QUALIFICATION_STATUS_LABELS,
  PRE_QUALIFICATION_STATUS_STYLES,
} from "@/lib/admin-labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminQuestionnairePage() {
  const preQualifications = await prisma.preQualification.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Questionnaires</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {preQualifications.length} réponse{preQualifications.length > 1 ? "s" : ""} au total.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Permis émis en</TableHead>
              <TableHead>Résidence IT</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Reçu le</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {preQualifications.map((item) => (
              <TableRow key={item.id} className="group">
                <TableCell>
                  <Link href={`/admin/questionnaire/${item.id}`} className="block">
                    <span className="font-medium text-foreground group-hover:underline">
                      {item.firstName} {item.lastName}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {item.email}
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-foreground">
                  {getCountryName(item.licenceIssuingCountry)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.hasItalianResidency ? "Oui" : "Non"}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${PRE_QUALIFICATION_STATUS_STYLES[item.status]}`}
                  >
                    {PRE_QUALIFICATION_STATUS_LABELS[item.status]}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(item.createdAt)}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/questionnaire/${item.id}`}>
                    <IconChevronRight
                      className="size-4 text-muted-foreground"
                      aria-hidden
                    />
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            {preQualifications.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                  Aucun questionnaire pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
