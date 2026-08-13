"use client";

import { cn } from "@/lib/utils";

export function YesNoField({
  name,
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  yesLabel: string;
  noLabel: string;
}) {
  const options = [
    { value: "true", label: yesLabel },
    { value: "false", label: noLabel },
  ];

  return (
    <fieldset>
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "cursor-pointer rounded-lg border px-4 py-2.5 text-center text-sm font-medium transition-colors",
              value === option.value
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border text-foreground hover:bg-muted",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
