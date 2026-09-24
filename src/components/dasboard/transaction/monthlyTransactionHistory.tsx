"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useThisMonthSummary } from "@/hooks/useTransections";
import { formatCurrency } from "@/lib/currency";

const MonthlyTransactionHistory = () => {
  const { data, isLoading, isError, error } = useThisMonthSummary();
  const currencyCode = "BDT";
  const transactions = data?.data.spendingByCategory ?? [];
  const totalIncome = data?.data.summary.totalIncome ?? 0;
  const totalSpending = data?.data.summary.totalSpending ?? 0;
  const netIncome = data?.data.summary.netIncome ?? 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (isError) {
  //   return <div>{error.message}</div>;
  // }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="font-sans text-lg">
            Spending this month
          </CardTitle>

          <CardDescription>Where your money has been going.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {transactions.length > 0 ? transactions.map((transaction) => (
              <div key={transaction.categoryId} className="flex items-center border-b justify-between">
                <span className="text-sm md:text-lg">{transaction.categoryName}</span>

                <span className="font-semibold text-sm md:text-lg tabular-nums">
                  {formatCurrency(transaction.totalSpending, currencyCode)}
                </span>
              </div>
            )) : <p className="text-sm md:text-lg">You have no spending this month.</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="font-sans text-lg">Monthly activity</CardTitle>

          <CardDescription>
            A quick look at your income and spending.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Income</span>

                <span className="font-semibold text-sm md:text-lg">
                  {formatCurrency(totalIncome, currencyCode)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[75%] rounded-full bg-emerald-400" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Spending</span>

                <span className="font-semibold text-sm md:text-lg">
                  {formatCurrency(totalSpending, currencyCode)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[42%] rounded-full bg-primary" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Net this month</p>

              <p className="mt-1 font-sans text-2xl font-semibold tabular-nums">
               +{formatCurrency(netIncome, currencyCode)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default MonthlyTransactionHistory;
