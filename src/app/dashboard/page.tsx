"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useThisMonthSummary } from "@/hooks/useTransections";
import { logout } from "@/lib/api/auth";

import {
  ArrowDown,
  ArrowUp,
  CircleDollarSign,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/currency";

function DashboardSkeleton() {
  return (
    <main className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-2 h-8 w-36" />
            </CardHeader>

            <CardFooter className="flex-col items-start gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Category spending */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-4 w-64" />
        </CardHeader>

        <CardContent className="space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>

              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const {
    data: user,
    isPending: isUserPending,
    isError: isUserError,
  } = useCurrentUser();

  const {
    data,
    isPending: isSummaryPending,
    isError: isSummaryError,
    refetch,
    isFetching,
  } = useThisMonthSummary();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  /*
   * Depending on how your API function is written,
   * `data` may already be the summary object or it may
   * be inside `data.data`.
   */

  const summary = data?.data;
  const totalIncome = data?.data.summary.totalIncome ?? 0;
  const totalSpending = data?.data.summary.totalSpending ?? 0;
  const netIncome = data?.data.summary.netIncome ?? 0;

  const savingsRate = useMemo(() => {
    if (totalIncome <= 0) return 0;

    return (netIncome / totalIncome) * 100;
  }, [totalIncome, netIncome]);

  const categories = useMemo(() => {
    return [...(summary?.spendingByCategory ?? [])]
      .filter((category) => category.totalSpending > 0)
      .sort((a, b) => b.totalSpending - a.totalSpending);
  }, [summary?.spendingByCategory]);

  const maxCategorySpending = categories[0]?.totalSpending ?? 1;

  if (isUserPending || isSummaryPending) {
    return <DashboardSkeleton />;
  }

  if (isUserError || isSummaryError) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unable to load dashboard</CardTitle>
            <CardDescription>
              Something went wrong while loading your financial summary.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Retrying..." : "Try Again"}
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="space-y-6 p-4 md:p-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Welcome, {user?.name ?? "User"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s your financial overview for this month.
          </p>
        </div>

        <Button variant="destructive" onClick={handleLogout} className="w-fit">
          Logout
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Income */}
        <Card className="border-border/80 transition-colors hover:border-primary/30">
          <CardHeader>
            <CardDescription>This Month&apos;s Income</CardDescription>

            <CardTitle className="font-sans text-2xl font-semibold tabular-nums">
              {formatCurrency(totalIncome, "BDT")}
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex-col bg-black items-start gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowUp className="size-4 text-emerald-500" />
              Money received this month
            </div>

            <div className="text-sm text-muted-foreground">
              Total recorded income
            </div>
          </CardFooter>
        </Card>

        {/* Spending */}
        <Card className="border-border/80 transition-colors hover:border-primary/30">
          <CardHeader>
            <CardDescription>This Month&apos;s Spending</CardDescription>

            <CardTitle className="font-sans text-2xl text-rose-500 font-semibold tabular-nums">
              {formatCurrency(totalSpending, "BDT")}
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex-col bg-black items-start gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ArrowDown className="size-4 text-rose-500" />
              Money spent this month
            </div>

            <div className="text-sm text-muted-foreground">
              Total recorded expenses
            </div>
          </CardFooter>
        </Card>

        {/* Net Income */}
        <Card className="border-border/80 transition-colors hover:border-primary/30">
          <CardHeader>
            <CardDescription>Net Income</CardDescription>

            <CardTitle
              className={`font-sans text-2xl font-semibold tabular-nums ${
                netIncome >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {formatCurrency(netIncome, "BDT")}
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex-col bg-black items-start gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              {netIncome >= 0 ? (
                <>
                  <TrendingUp className="size-4 text-emerald-500" />
                  Positive cash flow
                </>
              ) : (
                <>
                  <TrendingDown className="size-4 text-rose-500" />
                  Negative cash flow
                </>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              Income minus spending
            </div>
          </CardFooter>
        </Card>

        {/* Savings Rate */}
        <Card className="border-border/80 transition-colors hover:border-primary/30">
          <CardHeader>
            <CardDescription>Savings Rate</CardDescription>

            <CardTitle className="font-sans text-2xl font-semibold tabular-nums">
              {savingsRate.toFixed(1)}%
            </CardTitle>
          </CardHeader>

          <CardFooter className="flex-col bg-black items-start gap-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wallet className="size-4 text-primary" />
              Income retained
            </div>

            <div className="text-sm text-muted-foreground">
              Net income as a percentage of income
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Spending by Category */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Spending by Category</CardTitle>

              <CardDescription className="mt-1">
                See where your money went this month.
              </CardDescription>
            </div>

            <Badge variant="outline" className="gap-1">
              <CircleDollarSign className="size-3.5" />
              {categories.length} categories
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          {categories.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              No spending recorded this month.
            </div>
          ) : (
            <div className="space-y-5">
              {categories.map((category) => {
                const percentageOfTopCategory =
                  (category.totalSpending / maxCategorySpending) * 100;

                const percentageOfTotal =
                  totalSpending > 0
                    ? (category.totalSpending / totalSpending) * 100
                    : 0;

                return (
                  <div key={category.categoryId} className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {category.categoryName}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {percentageOfTotal.toFixed(1)}% of total spending
                        </p>
                      </div>

                      <span className="shrink-0 text-rose-500 text-sm font-medium tabular-nums">
                        {formatCurrency(category.totalSpending, "BDT")}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${percentageOfTopCategory}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Monthly Spending</CardDescription>

            <CardTitle className="text-xl text-red-500">
              {formatCurrency(totalSpending, "BDT")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your total recorded expenses for the current month.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Monthly Net</CardDescription>

            <CardTitle
              className={`text-xl ${
                netIncome >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {formatCurrency(netIncome, "BDT")}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              The amount remaining after subtracting spending from income.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
