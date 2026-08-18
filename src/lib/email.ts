import { Resend } from "resend";

const FROM = process.env.RESEND_FROM ?? "Conversione patente straniera <contatto@conversionepatente.it>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER; // format: indicatif+numéro, sans "+" ni espaces
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Lien "wa.me" pré-rempli : pas d'API WhatsApp Business configurée, donc la
 * "notification WhatsApp" est un lien à un clic que l'équipe ouvre elle-même
 * depuis l'email ou le dashboard, plutôt qu'un envoi automatique.
 */
function buildWhatsAppLink(message: string) {
  if (!ADMIN_WHATSAPP_NUMBER) return null;
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Instancié à la demande plutôt qu'au chargement du module : `new Resend()`
 * jette immédiatement si RESEND_API_KEY est absente, ce qui ferait planter
 * tout fichier qui importe ce module (y compris des Server Actions sans
 * aucun rapport avec l'email) si c'était fait au niveau module.
 */
let resendClient: Resend | null = null;
function getResendClient() {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

/**
 * Le SDK Resend ne rejette jamais : il résout vers { data, error }. Sans cette
 * inspection, un envoi refusé (domaine non vérifié, clé absente) passerait
 * pour un succès.
 */
async function send(payload: { to: string; subject: string; html: string }) {
  const { error } = await getResendClient().emails.send({
    from: FROM,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  if (error) {
    const detail = [error.name, error.message].filter(Boolean).join(" — ");
    console.error("[email] Envoi refusé par Resend :", error);
    throw new Error(`Envoi de l'email impossible : ${detail}`);
  }
}

export async function sendNewSubmissionEmail({
  requestId,
  firstName,
  lastName,
  email,
  destinationCountryName,
  procedureLabel,
}: {
  requestId: string;
  firstName: string;
  lastName: string;
  email: string;
  destinationCountryName: string;
  procedureLabel: string;
}) {
  if (!ADMIN_EMAIL) {
    console.warn("[email] ADMIN_NOTIFICATION_EMAIL non défini, notification non envoyée.");
    return;
  }

  await send({
    to: ADMIN_EMAIL,
    subject: `Nouvelle demande — ${firstName} ${lastName}`,
    html: newSubmissionHtml({
      requestId,
      firstName,
      lastName,
      email,
      destinationCountryName,
      procedureLabel,
    }),
  });
}

export async function sendNewPreQualificationEmail({
  id,
  firstName,
  lastName,
  email,
  phone,
  licenceIssuingCountryName,
}: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenceIssuingCountryName: string;
}) {
  if (!ADMIN_EMAIL) {
    console.warn("[email] ADMIN_NOTIFICATION_EMAIL non défini, notification non envoyée.");
    return;
  }

  const detailUrl = `${APP_URL}/admin/questionnaire/${id}`;
  const whatsappMessage = `Nouveau questionnaire — ${firstName} ${lastName} (${phone}), permis ${licenceIssuingCountryName}. Dossier : ${detailUrl}`;
  const whatsappLink = buildWhatsAppLink(whatsappMessage);

  await send({
    to: ADMIN_EMAIL,
    subject: `Nouveau questionnaire — ${firstName} ${lastName}`,
    html: newPreQualificationHtml({
      firstName,
      lastName,
      email,
      phone,
      licenceIssuingCountryName,
      detailUrl,
      whatsappLink,
    }),
  });
}

export async function sendEligibilityInviteEmail({
  to,
  firstName,
  demandeUrl,
}: {
  to: string;
  firstName: string;
  demandeUrl: string;
}) {
  await send({
    to,
    subject: "Vous pouvez continuer votre demande",
    html: eligibilityInviteHtml({ firstName, demandeUrl }),
  });
}

function newPreQualificationHtml({
  firstName,
  lastName,
  email,
  phone,
  licenceIssuingCountryName,
  detailUrl,
  whatsappLink,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenceIssuingCountryName: string;
  detailUrl: string;
  whatsappLink: string | null;
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EFF6FF;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:48px 40px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <tr><td style="padding-bottom:32px;border-bottom:1px solid #E9EFF5;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#1E3A8A;">Permis-Exchange</p>
        </td></tr>
        <tr><td style="padding-top:32px;">
          <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#1E3A8A;">Nouveau questionnaire reçu</p>
          <p style="margin:0 0 28px;font-size:15px;color:#47597A;line-height:1.6;">
            ${firstName} ${lastName} vient de répondre au questionnaire de préqualification.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:20px;margin-bottom:28px;">
            <tr><td style="padding-bottom:12px;">
              <p style="margin:0 0 4px;font-size:12px;color:#47597A;text-transform:uppercase;letter-spacing:.5px;">Contact</p>
              <p style="margin:0;font-size:15px;color:#1E3A8A;font-weight:600;">${email} — ${phone}</p>
            </td></tr>
            <tr><td>
              <p style="margin:0 0 4px;font-size:12px;color:#47597A;text-transform:uppercase;letter-spacing:.5px;">Permis émis en</p>
              <p style="margin:0;font-size:15px;color:#1E3A8A;font-weight:600;">${licenceIssuingCountryName}</p>
            </td></tr>
          </table>

          <a href="${detailUrl}" style="display:inline-block;background:#1E40AF;color:#fff;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:15px;font-weight:600;margin-right:10px;">Voir le questionnaire →</a>
          ${
            whatsappLink
              ? `<a href="${whatsappLink}" style="display:inline-block;background:#16A34A;color:#fff;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:15px;font-weight:600;">Ouvrir dans WhatsApp</a>`
              : ""
          }
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function eligibilityInviteHtml({
  firstName,
  demandeUrl,
}: {
  firstName: string;
  demandeUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EFF6FF;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:48px 40px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <tr><td style="padding-bottom:32px;border-bottom:1px solid #E9EFF5;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#1E3A8A;">Permis-Exchange</p>
        </td></tr>
        <tr><td style="padding-top:32px;">
          <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#1E3A8A;">Bonjour ${firstName},</p>
          <p style="margin:0 0 28px;font-size:15px;color:#47597A;line-height:1.6;">
            Bonne nouvelle : après analyse de vos réponses, votre situation est éligible à la conversion de votre permis de conduire. Vous pouvez maintenant constituer votre dossier complet en cliquant ci-dessous.
          </p>

          <a href="${demandeUrl}" style="display:inline-block;background:#1E40AF;color:#fff;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:15px;font-weight:600;">Continuer ma demande →</a>

          <p style="margin:28px 0 0;font-size:13px;color:#94A3B8;line-height:1.6;">
            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>${demandeUrl}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function newSubmissionHtml({
  requestId,
  firstName,
  lastName,
  email,
  destinationCountryName,
  procedureLabel,
}: {
  requestId: string;
  firstName: string;
  lastName: string;
  email: string;
  destinationCountryName: string;
  procedureLabel: string;
}) {
  const detailUrl = `${APP_URL}/admin/submissions/${requestId}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#EFF6FF;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;padding:48px 40px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <tr><td style="padding-bottom:32px;border-bottom:1px solid #E9EFF5;">
          <p style="margin:0;font-size:22px;font-weight:700;color:#1E3A8A;">Permis-Exchange</p>
        </td></tr>
        <tr><td style="padding-top:32px;">
          <p style="margin:0 0 8px;font-size:18px;font-weight:600;color:#1E3A8A;">Nouvelle demande reçue</p>
          <p style="margin:0 0 28px;font-size:15px;color:#47597A;line-height:1.6;">
            ${firstName} ${lastName} vient de soumettre une demande.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:20px;margin-bottom:28px;">
            <tr><td style="padding-bottom:12px;">
              <p style="margin:0 0 4px;font-size:12px;color:#47597A;text-transform:uppercase;letter-spacing:.5px;">Email</p>
              <p style="margin:0;font-size:15px;color:#1E3A8A;font-weight:600;">${email}</p>
            </td></tr>
            <tr><td style="padding-bottom:12px;">
              <p style="margin:0 0 4px;font-size:12px;color:#47597A;text-transform:uppercase;letter-spacing:.5px;">Destination</p>
              <p style="margin:0;font-size:15px;color:#1E3A8A;font-weight:600;">${destinationCountryName}</p>
            </td></tr>
            <tr><td>
              <p style="margin:0 0 4px;font-size:12px;color:#47597A;text-transform:uppercase;letter-spacing:.5px;">Type de démarche</p>
              <p style="margin:0;font-size:15px;color:#1E3A8A;font-weight:600;">${procedureLabel}</p>
            </td></tr>
          </table>

          <a href="${detailUrl}" style="display:inline-block;background:#1E40AF;color:#fff;text-decoration:none;padding:13px 28px;border-radius:999px;font-size:15px;font-weight:600;">Voir le dossier →</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
