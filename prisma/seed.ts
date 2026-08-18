import "dotenv/config";
import { auth } from "@/lib/auth";

/**
 * Crée le premier compte admin (dashboard /admin) via l'API better-auth,
 * pour que le hash du mot de passe reste compatible avec la connexion.
 * Email/mot de passe passés par variables d'env — jamais en dur ici.
 *
 * Usage : ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... pnpm admin:seed
 */
async function main() {
  const email = process.env.ADMIN_EMAIL ?? "contatto@conversionepatente.it";
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!password) {
    console.error("ADMIN_PASSWORD manquant. Usage : ADMIN_PASSWORD=... pnpm admin:seed");
    process.exit(1);
  }

  try {
    await auth.api.signUpEmail({ body: { email, password, name } });
    console.log(`Compte admin créé : ${email}`);
  } catch (err) {
    console.error("Échec de la création du compte admin :", err);
    process.exit(1);
  }
}

main();
