import dasboard from "@/assets/dashboard.png";
import transactions from "@/assets/transaction.png";
import budget from "@/assets/budget.png";
import categories from "@/assets/categories.png";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CreditCard,
  LayoutDashboard,
  PiggyBank,
  Tags,
  WalletCards,
} from "lucide-react";
import { StaticImageData } from "next/image";

export type Feature = {
  title: string;
  description: string;
  screenshot: StaticImageData | string;
  icon: LucideIcon;
};

export const features: Feature[] = [
  {
    title: "Financial Dashboard",
    description:
      "Get a clear picture of your finances from one place with income, spending, net cash flow, savings rate, and category-based insights.",
    screenshot: dasboard,
    icon: LayoutDashboard,
  },
  {
    title: "Transaction Management",
    description:
      "Record income and expenses with the details you need and keep your financial history organized in one place.",
    screenshot: transactions,
    icon: CreditCard,
  },
  {
    title: "Budget Management",
    description:
      "Set spending limits for different categories and compare your planned budget with your actual spending.",
    screenshot: budget,
    icon: PiggyBank,
  },
  {
    title: "Category Management",
    description:
      "Organize financial activity into meaningful categories so your records remain structured and easier to analyze.",
    screenshot: categories,
    icon: Tags,
  },
];