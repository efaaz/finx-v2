import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { currencies } from "@/types/currency";
import TodaySummary from "@/components/dasboard/transaction/todaySummary";
import TransactionHistory from "@/components/dasboard/transaction/transactionHistory";
import MonthlyTransactionHistory from "@/components/dasboard/transaction/monthlyTransactionHistory";
import QuickTransection from "@/components/dasboard/transaction/quickTransection";

export default function TransactionsPage() {
  const user = {
    id: "string",
    name: "efaz",
    email: "string",
    avatar: "string",
    defaultCurrency: "BDT",
  };
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl">Transactions</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Record and review your income and spending.
          </p>
        </div>

        <Button className="gap-2">
          <Plus className="size-4" />
          Add Transaction
        </Button>
      </section>

      {/* =====================================================
          QUICK ADD
      ===================================================== */}
      <QuickTransection />

      {/* =====================================================
          TODAY SUMMARY
      ===================================================== */}

      {/* =====================================================
          TODAY'S TRANSACTIONS
          ===================================================== */}
      <TodaySummary />

      {/* =====================================================
          HISTORY
      ===================================================== */}
      <TransactionHistory />

      {/* =====================================================
          SERIOUS / ANALYTICAL SECTION
      ===================================================== */}
      <MonthlyTransactionHistory />
    </div>
  );
}
