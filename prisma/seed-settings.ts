import "dotenv/config";
import { prisma } from "@/lib/prisma";

/**
 * Pré-remplit les coordonnées de contact (SiteSettings) avec les vraies
 * valeurs connues, pour que /contact et le footer n'affichent rien de vide
 * avant le premier passage de l'admin dans /admin/settings. Séparé du seed
 * du compte admin : celui-ci échoue une fois le compte déjà créé, alors que
 * ce script peut être relancé sans risque (upsert).
 *
 * Usage : pnpm settings:seed
 */
async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      contactEmail: "contatto@conversionepatente.it",
      contactAddress: "Via delle Magnolie, 1, 70026 Modugno BA, Italia",
    },
  });
  console.log("Coordonnées de contact initiales enregistrées (téléphone à ajouter dans /admin/settings).");
}

main();
