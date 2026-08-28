import { getSiteSettings } from "@/lib/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Coordonnées affichées sur la page Contact, le pied de page et le bouton de messagerie.
        </p>
      </div>

      <div className="max-w-lg rounded-2xl border border-border bg-card p-6">
        <SiteSettingsForm
          defaultValues={{
            contactEmail: settings?.contactEmail ?? "",
            contactPhone: settings?.contactPhone ?? "",
            contactAddress: settings?.contactAddress ?? "",
          }}
        />
      </div>
    </div>
  );
}
