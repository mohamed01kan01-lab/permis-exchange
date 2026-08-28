"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {
  IconLoader2,
  IconEye,
  IconEyeOff,
  IconAlertCircle,
  IconArrowLeft,
} from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const { error: signInError } = await authClient.signIn.email({ email, password });

    setPending(false);

    if (signInError) {
      setError("Email ou mot de passe incorrect.");

      if (cardRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.fromTo(
          cardRef.current,
          { x: 0 },
          { x: 8, duration: 0.06, ease: "power1.inOut", repeat: 5, yoyo: true, clearProps: "x" },
        );
      }

      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-full items-center justify-center bg-muted/40 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-11 overflow-hidden rounded-xl">
            <Image src="/logo.png" alt="" width={44} height={44} className="size-full object-cover" />
          </span>
          <h1 className="mt-4 text-xl font-bold text-foreground">Administration</h1>
          <p className="mt-1 text-sm text-muted-foreground">Permis-Exchange</p>
        </div>

        <div
          ref={cardRef}
          className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={!!error}
                aria-describedby={error ? "login-error" : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Mot de passe
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  aria-invalid={!!error}
                  aria-describedby={error ? "login-error" : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-transparent px-3 pr-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-10 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <IconEyeOff className="size-4" stroke={1.75} aria-hidden />
                  ) : (
                    <IconEye className="size-4" stroke={1.75} aria-hidden />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                ref={errorRef}
                id="login-error"
                role="alert"
                tabIndex={-1}
                className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive outline-none"
              >
                <IconAlertCircle className="mt-0.5 size-4 shrink-0" stroke={1.75} aria-hidden />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && <IconLoader2 className="size-4 animate-spin" aria-hidden />}
              Se connecter
            </button>
          </form>
        </div>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft className="size-3.5" stroke={1.75} aria-hidden />
          Retour au site
        </Link>
      </div>
    </main>
  );
}
