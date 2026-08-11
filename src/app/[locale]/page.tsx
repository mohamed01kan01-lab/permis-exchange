import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { TrustSignals } from "@/components/home/TrustSignals";
import { ServiceScope } from "@/components/home/ServiceScope";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProcessTimeline />
        <TrustSignals />
        <ServiceScope />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
