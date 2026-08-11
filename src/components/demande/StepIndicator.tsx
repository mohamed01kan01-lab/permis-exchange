"use client";

import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function StepIndicator({
  steps,
  current,
  onNavigate,
}: {
  steps: string[];
  current: number;
  onNavigate: (step: number) => void;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((label, index) => {
        const step = index + 1;
        const isCompleted = step < current;
        const isCurrent = step === current;

        return (
          <li key={label} className="flex items-center gap-2">
            <button
              type="button"
              disabled={!isCompleted}
              onClick={() => isCompleted && onNavigate(step)}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                isCurrent && "bg-primary text-primary-foreground",
                isCompleted &&
                  !isCurrent &&
                  "cursor-pointer bg-accent/10 text-accent hover:bg-accent/20",
                !isCompleted && !isCurrent && "cursor-default text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border text-[0.7rem]",
                  isCurrent && "border-primary-foreground",
                  isCompleted && !isCurrent && "border-accent bg-accent text-accent-foreground",
                  !isCompleted && !isCurrent && "border-muted-foreground/40",
                )}
              >
                {isCompleted && !isCurrent ? (
                  <IconCheck className="size-3" aria-hidden />
                ) : (
                  step
                )}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {step < steps.length && (
              <span aria-hidden className="h-px w-4 bg-border sm:w-8" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
