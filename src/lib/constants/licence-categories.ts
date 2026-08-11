export const LICENCE_CATEGORIES = [
  "AM",
  "A1",
  "A2",
  "A",
  "B1",
  "B",
  "BE",
  "C1",
  "C1E",
  "C",
  "CE",
  "D1",
  "D1E",
  "D",
  "DE",
] as const;

export type LicenceCategory = (typeof LICENCE_CATEGORIES)[number];
