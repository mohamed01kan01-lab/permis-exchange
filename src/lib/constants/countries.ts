export type Country = {
  code: string;
  name: string;
  euEea: boolean;
};

// UE (27) + EEE (Islande, Liechtenstein, Norvège)
const EU_EEA: Country[] = [
  { code: "AT", name: "Autriche", euEea: true },
  { code: "BE", name: "Belgique", euEea: true },
  { code: "BG", name: "Bulgarie", euEea: true },
  { code: "HR", name: "Croatie", euEea: true },
  { code: "CY", name: "Chypre", euEea: true },
  { code: "CZ", name: "Tchéquie", euEea: true },
  { code: "DK", name: "Danemark", euEea: true },
  { code: "EE", name: "Estonie", euEea: true },
  { code: "FI", name: "Finlande", euEea: true },
  { code: "FR", name: "France", euEea: true },
  { code: "DE", name: "Allemagne", euEea: true },
  { code: "GR", name: "Grèce", euEea: true },
  { code: "HU", name: "Hongrie", euEea: true },
  { code: "IE", name: "Irlande", euEea: true },
  { code: "IS", name: "Islande", euEea: true },
  { code: "IT", name: "Italie", euEea: true },
  { code: "LV", name: "Lettonie", euEea: true },
  { code: "LI", name: "Liechtenstein", euEea: true },
  { code: "LT", name: "Lituanie", euEea: true },
  { code: "LU", name: "Luxembourg", euEea: true },
  { code: "MT", name: "Malte", euEea: true },
  { code: "NL", name: "Pays-Bas", euEea: true },
  { code: "NO", name: "Norvège", euEea: true },
  { code: "PL", name: "Pologne", euEea: true },
  { code: "PT", name: "Portugal", euEea: true },
  { code: "RO", name: "Roumanie", euEea: true },
  { code: "SK", name: "Slovaquie", euEea: true },
  { code: "SI", name: "Slovénie", euEea: true },
  { code: "ES", name: "Espagne", euEea: true },
  { code: "SE", name: "Suède", euEea: true },
];

// Pays hors UE/EEE les plus fréquents pour ce type de démarche — liste non exhaustive,
// à compléter si besoin (couvre la majorité des demandes réelles observées).
const NON_EU: Country[] = [
  { code: "CH", name: "Suisse", euEea: false },
  { code: "GB", name: "Royaume-Uni", euEea: false },
  { code: "US", name: "États-Unis", euEea: false },
  { code: "CA", name: "Canada", euEea: false },
  { code: "MA", name: "Maroc", euEea: false },
  { code: "DZ", name: "Algérie", euEea: false },
  { code: "TN", name: "Tunisie", euEea: false },
  { code: "SN", name: "Sénégal", euEea: false },
  { code: "CI", name: "Côte d'Ivoire", euEea: false },
  { code: "CM", name: "Cameroun", euEea: false },
  { code: "BJ", name: "Bénin", euEea: false },
  { code: "TG", name: "Togo", euEea: false },
  { code: "ML", name: "Mali", euEea: false },
  { code: "BF", name: "Burkina Faso", euEea: false },
  { code: "NE", name: "Niger", euEea: false },
  { code: "GN", name: "Guinée", euEea: false },
  { code: "CD", name: "RD Congo", euEea: false },
  { code: "CG", name: "Congo", euEea: false },
  { code: "GA", name: "Gabon", euEea: false },
  { code: "MG", name: "Madagascar", euEea: false },
  { code: "TR", name: "Türkiye", euEea: false },
  { code: "RU", name: "Russie", euEea: false },
  { code: "CN", name: "Chine", euEea: false },
  { code: "IN", name: "Inde", euEea: false },
  { code: "BR", name: "Brésil", euEea: false },
  { code: "AU", name: "Australie", euEea: false },
  { code: "JP", name: "Japon", euEea: false },
  { code: "KR", name: "Corée du Sud", euEea: false },
  { code: "ZA", name: "Afrique du Sud", euEea: false },
  { code: "EG", name: "Égypte", euEea: false },
  { code: "NG", name: "Nigeria", euEea: false },
  { code: "GH", name: "Ghana", euEea: false },
  { code: "LB", name: "Liban", euEea: false },
];

export const COUNTRIES: Country[] = [...EU_EEA, ...NON_EU].sort((a, b) =>
  a.name.localeCompare(b.name, "fr"),
);

export const EU_EEA_CODES = new Set(EU_EEA.map((c) => c.code));

export function isEuEeaCountry(code: string): boolean {
  return EU_EEA_CODES.has(code);
}

export function getCountryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? code;
}
