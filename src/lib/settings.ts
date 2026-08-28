import { prisma } from "@/lib/prisma";

/**
 * Lue par le layout racine sur chaque page publique. Si la table n'existe
 * pas encore (schéma pas encore poussé) ou si la base est injoignable, on
 * dégrade en silence plutôt que de faire échouer le build/rendu de tout le
 * site : chaque composant appelant traite déjà `settings` comme nullable
 * et masque les infos de contact absentes.
 */
export async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  } catch (err) {
    console.error("[settings] Impossible de lire SiteSettings :", err);
    return null;
  }
}
