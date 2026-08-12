import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function useShakeOnError<T extends HTMLElement>(
  errors: Record<string, string[] | undefined> | undefined,
) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const hasErrors = !!errors && Object.keys(errors).length > 0;
      if (!hasErrors || !ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ref.current,
        { x: 0 },
        {
          x: 8,
          duration: 0.06,
          ease: "power1.inOut",
          repeat: 5,
          yoyo: true,
          clearProps: "x",
        },
      );
    },
    // errors is a fresh object reference on every action call, so this fires on every submit attempt
    { dependencies: [errors] },
  );

  return ref;
}
