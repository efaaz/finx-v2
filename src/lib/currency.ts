import type { CurrencyCode } from "@/types/currency";
import { currencies } from "@/types/currency";

export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
): string {
  const currencyData = currencies.find(
    (item) => item.code === currency
  );

  if (!currencyData) {
    throw new Error(`Currency ${currency} not found`);
  }

  return `${currencyData.symbol}${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(amount)}`;
}