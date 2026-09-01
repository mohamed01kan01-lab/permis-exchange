"use client";

import { useRef, useState, type ChangeEvent, type KeyboardEvent, type RefObject } from "react";
import { useTranslations } from "next-intl";

function isoToParts(iso?: string) {
  const match = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return { day: "", month: "", year: "" };
  const [, year, month, day] = match;
  return { day, month, year };
}

function partsToIso(day: string, month: string, year: string) {
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) return "";
  const d = Number(day);
  const m = Number(month);
  if (d < 1 || d > 31 || m < 1 || m > 12) return "";
  return `${year}-${month}-${day}`;
}

function onlyDigits(raw: string, max: number) {
  return raw.replace(/\D/g, "").slice(0, max);
}

const SEGMENT_CLASS =
  "h-10 rounded-lg border border-input bg-transparent px-2 text-center text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

/**
 * Trois champs jour/mois/année à saisir directement au clavier numérique,
 * plutôt qu'un <input type="date"> dont le picker natif mobile (roue iOS,
 * calendrier Android) oblige à défiler longtemps pour une date de naissance
 * ou d'obtention de permis. La valeur ISO (yyyy-mm-dd) reconstruite est
 * soumise via un input caché portant le vrai `name`, donc les schémas de
 * validation existants (Date.parse) n'ont pas besoin de changer.
 */
export function DateField({
  id,
  name,
  defaultValue,
  ariaInvalid,
}: {
  id: string;
  name: string;
  defaultValue?: string;
  ariaInvalid?: boolean;
}) {
  const t = useTranslations("common.date");
  const initial = isoToParts(defaultValue);
  const [day, setDay] = useState(initial.day);
  const [month, setMonth] = useState(initial.month);
  const [year, setYear] = useState(initial.year);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  const iso = partsToIso(day, month, year);

  function focusPreviousOnBackspace(previous: RefObject<HTMLInputElement | null>) {
    return (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace" && event.currentTarget.value === "") {
        previous.current?.focus();
      }
    };
  }

  function handleDayChange(event: ChangeEvent<HTMLInputElement>) {
    const value = onlyDigits(event.target.value, 2);
    setDay(value);
    if (value.length === 2) monthRef.current?.focus();
  }

  function handleMonthChange(event: ChangeEvent<HTMLInputElement>) {
    const value = onlyDigits(event.target.value, 2);
    setMonth(value);
    if (value.length === 2) yearRef.current?.focus();
  }

  function handleYearChange(event: ChangeEvent<HTMLInputElement>) {
    setYear(onlyDigits(event.target.value, 4));
  }

  return (
    <div className="mt-1.5 flex items-center gap-2">
      <input
        ref={dayRef}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={t("day")}
        aria-invalid={ariaInvalid}
        aria-label={t("day")}
        value={day}
        onChange={handleDayChange}
        maxLength={2}
        className={`${SEGMENT_CLASS} w-14`}
      />
      <span aria-hidden className="text-muted-foreground">
        /
      </span>
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={t("month")}
        aria-invalid={ariaInvalid}
        aria-label={t("month")}
        value={month}
        onChange={handleMonthChange}
        onKeyDown={focusPreviousOnBackspace(dayRef)}
        maxLength={2}
        className={`${SEGMENT_CLASS} w-14`}
      />
      <span aria-hidden className="text-muted-foreground">
        /
      </span>
      <input
        ref={yearRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={t("year")}
        aria-invalid={ariaInvalid}
        aria-label={t("year")}
        value={year}
        onChange={handleYearChange}
        onKeyDown={focusPreviousOnBackspace(monthRef)}
        maxLength={4}
        className={`${SEGMENT_CLASS} w-20`}
      />
      <input type="hidden" name={name} value={iso} />
    </div>
  );
}
