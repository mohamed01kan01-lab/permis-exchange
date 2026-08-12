import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export function LegalPageLayout({
  title,
  lastUpdated,
  intro,
  children,
}: {
  title: string;
  lastUpdated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{lastUpdated}</p>
          {intro && <p className="mt-6 text-muted-foreground">{intro}</p>}
          <div className="mt-10 flex flex-col gap-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </section>
  );
}
