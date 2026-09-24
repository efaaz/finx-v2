"use client";
import { Button } from "@/components/ui/button";
import { useTodayTransactions } from "@/hooks/useTransections";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import {
  ArrowDownLeft,
  ArrowUpRight,
  MoreHorizontal,
  Wallet,
  ChevronRight,
} from "lucide-react";
import { formatTransactionDate } from "@/lib/formateHelper";

const TodaySummary = () => {
  const { data, isLoading, isError, error } = useTodayTransactions();

  if (isLoading) {
    return (
      <>
        <div>
          <h2 className="font-sans text-lg font-semibold">Today</h2>

          <p className="text-sm text-muted-foreground">September 24, 2026</p>
        </div>
        Loading...
      </>
    );
  }

  //   if (isError) {
  //     return <div>{error.message}</div>;
  //   }

  const transactions = data?.data.transactions ?? [];
  const totalIncome = data?.data.totalIncome ?? 0;
  const totalSpending = data?.data.totalSpending ?? 0;
  const netIncome = data?.data.netIncome ?? 0;
  return (
    <>
      <section className="space-y-4">
        <div>
          <h2 className="font-sans text-lg font-semibold">Today</h2>

          <p className="text-sm text-muted-foreground">September 24, 2026</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Income */}
          <Card className="border-border/80 bg-card">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Income</p>

                <p className="mt-1 font-sans text-2xl font-semibold tabular-nums">
                  {formatCurrency(totalIncome, "BDT")}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                <ArrowDownLeft className="size-5 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          {/* Spending */}
          <Card className="border-border/80 bg-card">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Spending</p>

                <p className="mt-1 font-sans text-2xl font-semibold tabular-nums">
                  {formatCurrency(totalSpending, "BDT")}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10">
                <ArrowUpRight className="size-5 text-red-400" />
              </div>
            </CardContent>
          </Card>

          {/* Net */}
          <Card className="border-border/80 bg-card">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">Net</p>

                <p className="mt-1 font-sans text-2xl font-semibold tabular-nums">
                  {formatCurrency(netIncome, "BDT")}
                </p>
              </div>

              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                <Wallet className="size-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Card className="border-border/80 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-sans text-lg">
              Recent transactions
            </CardTitle>

            <CardDescription>Your latest activity today.</CardDescription>
          </div>

          <Button variant="ghost" size="sm">
            View all
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-border">
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <div
                    key={transaction._id}
                    className="flex items-center gap-4 py-4"
                  >
                    {/* Transaction icon */}
                    <div
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                        isIncome ? "bg-emerald-500/10" : "bg-red-500/10"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowDownLeft className="size-4 text-emerald-400" />
                      ) : (
                        <ArrowUpRight className="size-4 text-red-400" />
                      )}
                    </div>

                    {/* Transaction info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {transaction.categoryId.categoryName ||
                          transaction.note}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {transaction.note} ·{" "}
                        {formatTransactionDate(transaction.date)}
                      </p>
                    </div>

                    {/* Amount */}
                    <p
                      className={`font-sans font-semibold tabular-nums ${
                        isIncome ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </p>

                    {/* Action */}
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No transactions today.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TodaySummary;
