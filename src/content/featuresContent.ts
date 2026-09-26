import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  Tags,
  WalletCards,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  screenshot: string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    title: "Financial Dashboard",
    description:
      "Get a clear picture of your finances from one place with income, spending, net cash flow, savings rate, and category-based insights.",
    screenshot: "/images/features/dashboard.png",
    icon: LayoutDashboard,
  },
  {
    title: "Transaction Management",
    description:
      "Record income and expenses with the details you need and keep your financial history organized in one place.",
    screenshot: "/images/features/transactions.png",
    icon: CreditCard,
  },
  {
    title: "Spending Analytics",
    description:
      "Understand where your money goes through category-based spending summaries and financial trends.",
    screenshot: "/images/features/analytics.png",
    icon: BarChart3,
  },
  {
    title: "Budget Management",
    description:
      "Set spending limits for different categories and compare your planned budget with your actual spending.",
    screenshot: "/images/features/budget.png",
    icon: PiggyBank,
  },
  {
    title: "Category Management",
    description:
      "Organize financial activity into meaningful categories so your records remain structured and easier to analyze.",
    screenshot: "/images/features/categories.png",
    icon: Tags,
  },
  {
    title: "Personal Finance Overview",
    description:
      "Keep your financial information structured over time and use your records to build a better understanding of your financial habits.",
    screenshot: "/images/features/overview.png",
    icon: WalletCards,
  },
];