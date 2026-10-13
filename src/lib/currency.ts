import type { CurrencyCode } from "@/types/currency";
import { currencies } from "@/types/currency";
import { error } from "console";

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const currencyData = currencies.find((item) => item.code === currency);

  if (!currencyData) {
    throw new Error(`Currency ${currency} not found`);
  }

  return `${currencyData.symbol}${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(amount)}`;
}

export function money(value: number, currency = "BDT") {
  const formatted = new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

  if (currency === "BDT") return `৳${formatted}`;

  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);
  } catch {
    return `${currency} ${formatted}`;
  }
}

export function compactMoney(value: number, currency = "BDT") {
  const formatted = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number.isFinite(value) ? value : 0);

  return currency === "BDT" ? `৳${formatted}` : `${currency} ${formatted}`;
}

export function percentage(value: number) {
  return `${(Number.isFinite(value) ? value : 0).toFixed(1)}%`;
}

export function getApiErrorMessage(error: unknown) {
  const maybeAxiosError = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };

  return (
    maybeAxiosError?.response?.data?.message ||
    maybeAxiosError?.message ||
    "We couldn't load your financial reports. Please try again."
  );
}
