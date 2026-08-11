import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { DemandeFormShell } from "@/components/demande/DemandeFormShell";

export default function DemandePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <DemandeFormShell />
      </main>
      <Footer />
    </>
  );
}
