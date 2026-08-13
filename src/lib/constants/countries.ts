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

// Reste du monde — liste quasi complète (ISO 3166-1), pour couvrir toutes
// les origines possibles des demandeurs.
const NON_EU: Country[] = [
  { code: "CH", name: "Suisse", euEea: false },
  { code: "GB", name: "Royaume-Uni", euEea: false },

  // Amérique du Nord & Centrale
  { code: "US", name: "États-Unis", euEea: false },
  { code: "CA", name: "Canada", euEea: false },
  { code: "MX", name: "Mexique", euEea: false },
  { code: "GT", name: "Guatemala", euEea: false },
  { code: "BZ", name: "Belize", euEea: false },
  { code: "HN", name: "Honduras", euEea: false },
  { code: "SV", name: "Salvador", euEea: false },
  { code: "NI", name: "Nicaragua", euEea: false },
  { code: "CR", name: "Costa Rica", euEea: false },
  { code: "PA", name: "Panama", euEea: false },
  { code: "CU", name: "Cuba", euEea: false },
  { code: "JM", name: "Jamaïque", euEea: false },
  { code: "HT", name: "Haïti", euEea: false },
  { code: "DO", name: "République dominicaine", euEea: false },
  { code: "TT", name: "Trinité-et-Tobago", euEea: false },

  // Amérique du Sud
  { code: "BR", name: "Brésil", euEea: false },
  { code: "AR", name: "Argentine", euEea: false },
  { code: "CL", name: "Chili", euEea: false },
  { code: "CO", name: "Colombie", euEea: false },
  { code: "PE", name: "Pérou", euEea: false },
  { code: "VE", name: "Venezuela", euEea: false },
  { code: "EC", name: "Équateur", euEea: false },
  { code: "BO", name: "Bolivie", euEea: false },
  { code: "PY", name: "Paraguay", euEea: false },
  { code: "UY", name: "Uruguay", euEea: false },
  { code: "GY", name: "Guyana", euEea: false },
  { code: "SR", name: "Suriname", euEea: false },

  // Afrique du Nord & Moyen-Orient
  { code: "MA", name: "Maroc", euEea: false },
  { code: "DZ", name: "Algérie", euEea: false },
  { code: "TN", name: "Tunisie", euEea: false },
  { code: "LY", name: "Libye", euEea: false },
  { code: "EG", name: "Égypte", euEea: false },
  { code: "TR", name: "Türkiye", euEea: false },
  { code: "LB", name: "Liban", euEea: false },
  { code: "SY", name: "Syrie", euEea: false },
  { code: "JO", name: "Jordanie", euEea: false },
  { code: "IQ", name: "Irak", euEea: false },
  { code: "IR", name: "Iran", euEea: false },
  { code: "IL", name: "Israël", euEea: false },
  { code: "PS", name: "Palestine", euEea: false },
  { code: "SA", name: "Arabie saoudite", euEea: false },
  { code: "YE", name: "Yémen", euEea: false },
  { code: "OM", name: "Oman", euEea: false },
  { code: "AE", name: "Émirats arabes unis", euEea: false },
  { code: "QA", name: "Qatar", euEea: false },
  { code: "KW", name: "Koweït", euEea: false },
  { code: "BH", name: "Bahreïn", euEea: false },

  // Afrique de l'Ouest
  { code: "SN", name: "Sénégal", euEea: false },
  { code: "CI", name: "Côte d'Ivoire", euEea: false },
  { code: "ML", name: "Mali", euEea: false },
  { code: "BF", name: "Burkina Faso", euEea: false },
  { code: "NE", name: "Niger", euEea: false },
  { code: "GN", name: "Guinée", euEea: false },
  { code: "GW", name: "Guinée-Bissau", euEea: false },
  { code: "GM", name: "Gambie", euEea: false },
  { code: "GH", name: "Ghana", euEea: false },
  { code: "TG", name: "Togo", euEea: false },
  { code: "BJ", name: "Bénin", euEea: false },
  { code: "NG", name: "Nigeria", euEea: false },
  { code: "SL", name: "Sierra Leone", euEea: false },
  { code: "LR", name: "Libéria", euEea: false },
  { code: "MR", name: "Mauritanie", euEea: false },
  { code: "CV", name: "Cap-Vert", euEea: false },

  // Afrique centrale
  { code: "CM", name: "Cameroun", euEea: false },
  { code: "GA", name: "Gabon", euEea: false },
  { code: "CG", name: "Congo", euEea: false },
  { code: "CD", name: "RD Congo", euEea: false },
  { code: "CF", name: "République centrafricaine", euEea: false },
  { code: "TD", name: "Tchad", euEea: false },
  { code: "GQ", name: "Guinée équatoriale", euEea: false },
  { code: "ST", name: "Sao Tomé-et-Principe", euEea: false },

  // Afrique de l'Est
  { code: "ET", name: "Éthiopie", euEea: false },
  { code: "ER", name: "Érythrée", euEea: false },
  { code: "DJ", name: "Djibouti", euEea: false },
  { code: "SO", name: "Somalie", euEea: false },
  { code: "KE", name: "Kenya", euEea: false },
  { code: "UG", name: "Ouganda", euEea: false },
  { code: "TZ", name: "Tanzanie", euEea: false },
  { code: "RW", name: "Rwanda", euEea: false },
  { code: "BI", name: "Burundi", euEea: false },
  { code: "SS", name: "Soudan du Sud", euEea: false },
  { code: "SD", name: "Soudan", euEea: false },
  { code: "MG", name: "Madagascar", euEea: false },
  { code: "MU", name: "Maurice", euEea: false },
  { code: "KM", name: "Comores", euEea: false },
  { code: "SC", name: "Seychelles", euEea: false },

  // Afrique australe
  { code: "ZA", name: "Afrique du Sud", euEea: false },
  { code: "ZW", name: "Zimbabwe", euEea: false },
  { code: "ZM", name: "Zambie", euEea: false },
  { code: "MW", name: "Malawi", euEea: false },
  { code: "MZ", name: "Mozambique", euEea: false },
  { code: "NA", name: "Namibie", euEea: false },
  { code: "BW", name: "Botswana", euEea: false },
  { code: "LS", name: "Lesotho", euEea: false },
  { code: "SZ", name: "Eswatini", euEea: false },
  { code: "AO", name: "Angola", euEea: false },

  // Asie centrale & du Sud
  { code: "RU", name: "Russie", euEea: false },
  { code: "UA", name: "Ukraine", euEea: false },
  { code: "BY", name: "Biélorussie", euEea: false },
  { code: "MD", name: "Moldavie", euEea: false },
  { code: "GE", name: "Géorgie", euEea: false },
  { code: "AM", name: "Arménie", euEea: false },
  { code: "AZ", name: "Azerbaïdjan", euEea: false },
  { code: "KZ", name: "Kazakhstan", euEea: false },
  { code: "UZ", name: "Ouzbékistan", euEea: false },
  { code: "TM", name: "Turkménistan", euEea: false },
  { code: "TJ", name: "Tadjikistan", euEea: false },
  { code: "KG", name: "Kirghizistan", euEea: false },
  { code: "AF", name: "Afghanistan", euEea: false },
  { code: "PK", name: "Pakistan", euEea: false },
  { code: "IN", name: "Inde", euEea: false },
  { code: "NP", name: "Népal", euEea: false },
  { code: "BT", name: "Bhoutan", euEea: false },
  { code: "BD", name: "Bangladesh", euEea: false },
  { code: "LK", name: "Sri Lanka", euEea: false },
  { code: "MV", name: "Maldives", euEea: false },

  // Asie de l'Est & du Sud-Est
  { code: "CN", name: "Chine", euEea: false },
  { code: "JP", name: "Japon", euEea: false },
  { code: "KR", name: "Corée du Sud", euEea: false },
  { code: "KP", name: "Corée du Nord", euEea: false },
  { code: "MN", name: "Mongolie", euEea: false },
  { code: "TW", name: "Taïwan", euEea: false },
  { code: "HK", name: "Hong Kong", euEea: false },
  { code: "VN", name: "Vietnam", euEea: false },
  { code: "TH", name: "Thaïlande", euEea: false },
  { code: "MM", name: "Myanmar", euEea: false },
  { code: "LA", name: "Laos", euEea: false },
  { code: "KH", name: "Cambodge", euEea: false },
  { code: "MY", name: "Malaisie", euEea: false },
  { code: "SG", name: "Singapour", euEea: false },
  { code: "ID", name: "Indonésie", euEea: false },
  { code: "PH", name: "Philippines", euEea: false },
  { code: "BN", name: "Brunei", euEea: false },
  { code: "TL", name: "Timor oriental", euEea: false },

  // Océanie
  { code: "AU", name: "Australie", euEea: false },
  { code: "NZ", name: "Nouvelle-Zélande", euEea: false },
  { code: "FJ", name: "Fidji", euEea: false },
  { code: "PG", name: "Papouasie-Nouvelle-Guinée", euEea: false },

  // Balkans / Europe hors UE
  { code: "AL", name: "Albanie", euEea: false },
  { code: "RS", name: "Serbie", euEea: false },
  { code: "ME", name: "Monténégro", euEea: false },
  { code: "MK", name: "Macédoine du Nord", euEea: false },
  { code: "BA", name: "Bosnie-Herzégovine", euEea: false },
  { code: "XK", name: "Kosovo", euEea: false },
  { code: "AD", name: "Andorre", euEea: false },
  { code: "MC", name: "Monaco", euEea: false },
  { code: "SM", name: "Saint-Marin", euEea: false },
  { code: "VA", name: "Vatican", euEea: false },
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
