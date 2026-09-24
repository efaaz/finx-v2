export const SUPPORTED_CURRENCIES = [
  "BDT",
  "USD",
  "EUR",
  "GBP",
  "INR",
  "JPY",
  "AUD",
  "CAD",
  "AED",
  "SAR",
  "MYR",
  "SGD",
] as const;

export type CurrencyCode =
  (typeof SUPPORTED_CURRENCIES)[number];



export interface CurrencyOption {
  code: CurrencyCode;
  name: string;
  symbol: string;
}

export const currencies: CurrencyOption[] = [
  {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "৳",
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
  },
  {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ",
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "﷼",
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    symbol: "RM",
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
  },
];