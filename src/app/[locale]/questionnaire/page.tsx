import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { QuestionnaireShell } from "@/components/prequalification/QuestionnaireShell";

export default function QuestionnairePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <QuestionnaireShell />
      </main>
      <Footer />
    </>
  );
}
