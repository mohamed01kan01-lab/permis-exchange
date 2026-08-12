"use client";

import { forwardRef, type ComponentProps, type MouseEvent } from "react";
import { Link, useRouter } from "@/i18n/navigation";

type LinkProps = ComponentProps<typeof Link>;

export const TransitionLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function TransitionLink({ href, onClick, ...props }, ref) {
    const router = useRouter();

    return (
      <Link
        ref={ref}
        href={href}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          ) {
            return;
          }
          if (typeof document === "undefined" || !("startViewTransition" in document)) {
            return;
          }
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
          }

          event.preventDefault();
          document.startViewTransition(() => {
            router.push(href as Parameters<typeof router.push>[0]);
          });
        }}
        {...props}
      />
    );
  },
);
