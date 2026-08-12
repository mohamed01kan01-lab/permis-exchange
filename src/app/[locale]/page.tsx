import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/home/Hero";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { EligibilityQuiz } from "@/components/home/EligibilityQuiz";
import { TrustSignals } from "@/components/home/TrustSignals";
import { ServiceScope } from "@/components/home/ServiceScope";
import { ComparisonTable } from "@/components/home/ComparisonTable";
import { Testimonials } from "@/components/home/Testimonials";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <ProcessTimeline />
        <EligibilityQuiz />
        <TrustSignals />
        <ServiceScope />
        <ComparisonTable />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
