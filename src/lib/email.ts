import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Permis-Exchange <notifications@permis-exchange.example>";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Le SDK Resend ne rejette jamais : il résout vers { data, error }. Sans cette
 * inspection, un envoi refusé (domaine non vérifié, clé absente) passerait
 * pour un succès.
 */
async function send(payload: { to: string; subject: string; html: string }) {
  const { error } = await resend.emails.send({
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
