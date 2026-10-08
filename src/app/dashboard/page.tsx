"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpRight,
  CircleDollarSign,
  RefreshCw,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Wallet,
  Plus,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import {
  type DashboardCategory,
  type recentTransaction,
} from "@/types/DashboardOverview";
import { formatCurrency } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const tend = [
  {
    date: "2026-10-01",
    income: 20000,
    spending: 3500,
    transactionCount: 3,
  },
  {
    date: "2026-10-02",
    income: 0,
    spending: 1800,
    transactionCount: 4,
  },
  {
    date: "2026-10-03",
    income: 5000,
    spending: 2750,
    transactionCount: 5,
  },
  {
    date: "2026-10-04",
    income: 0,
    spending: 1200,
    transactionCount: 2,
  },
  {
    date: "2026-10-05",
    income: 15000,
    spending: 4200,
    transactionCount: 6,
  },
  {
    date: "2026-10-06",
    income: 0,
    spending: 2300,
    transactionCount: 3,
  },
  {
    date: "2026-10-07",
    income: 7500,
    spending: 3100,
    transactionCount: 5,
  },
  {
    date: "2026-10-08",
    income: 0,
    spending: 1650,
    transactionCount: 3,
  },
  {
    date: "2026-10-09",
    income: 10000,
    spending: 3850,
    transactionCount: 5,
  },
  {
    date: "2026-10-10",
    income: 0,
    spending: 2900,
    transactionCount: 4,
  },
];
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function formatMonth(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(start)} – ${formatter.format(end)}`;
}

function DashboardSkeleton() {
  return (
    <main className="space-y-8 p-4 md:p-6">
      {/* Header */}

      <div>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-80" />
      </div>

      {/* Lifetime cards */}

      <section className="space-y-4">
        <Skeleton className="h-5 w-28" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-3 h-8 w-36" />
              </CardHeader>

              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Weekly cards */}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-3 h-8 w-36" />
              </CardHeader>

              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Main content */}

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <Card className="min-h-80">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>

          <CardContent>
            <Skeleton className="h-56 w-full" />
          </CardContent>
        </Card>

        <Card className="min-h-80">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-56" />
          </CardHeader>

          <CardContent className="space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// Summary card
type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  valueClassName?: string;
};

function SummaryCard({
  title,
  value,
  description,
  icon,
  valueClassName = "",
}: SummaryCardProps) {
  return (
    <Card className="border-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardDescription>{title}</CardDescription>

          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-black text-muted-foreground">
            {icon}
          </div>
        </div>

        <CardTitle
          className={`font-sans text-2xl font-semibold tabular-nums sm:text-3xl ${valueClassName}`}
        >
          {value}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

// Weekly metric card

type WeeklyCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  valueClassName?: string;
};

function WeeklyCard({
  title,
  value,
  description,
  icon,
  valueClassName = "",
}: WeeklyCardProps) {
  return (
    <Card className="border-border/80 bg-card transition-all duration-200 hover:border-violet-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardDescription>{title}</CardDescription>

          {icon}
        </div>

        <CardTitle
          className={`font-sans text-2xl font-semibold tabular-nums ${valueClassName}`}
        >
          {value}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-xs text-muted-foreground sm:text-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
// Spending category item

type CategoryItemProps = {
  category: DashboardCategory;
  totalSpending: number;
  isTop?: boolean;
};

function CategoryItem({
  category,
  totalSpending,
  isTop = false,
}: CategoryItemProps) {
  const percentageOfTotal =
    totalSpending > 0 ? (category.amount / totalSpending) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
            <ArrowDownLeft className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {category.categoryName}
            </p>

            <p className="text-xs text-muted-foreground">
              {percentageOfTotal.toFixed(1)}% of spending
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isTop && (
            <Badge
              variant="outline"
              className="hidden border-violet-500/20 bg-violet-500/5 text-[10px] text-violet-300 sm:inline-flex"
            >
              Highest
            </Badge>
          )}

          <span className="text-sm font-medium tabular-nums text-red-400">
            {formatCurrency(category.amount, "BDT")}
          </span>
        </div>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-red-500/70 transition-all duration-500"
          style={{
            width: `${Math.min(percentageOfTotal, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

// Trend chart
type TrendItem = {
  date: string;
  income: number;
  spending: number;
  transactionCount: number;
};

interface MonthlyTrendProps {
  trend: TrendItem[];
}

const chartConfig = {
  income: {
    label: "Income",
    color: "#10b981",
  },
  spending: {
    label: "Spending",
    color: "#ef4444",
  },
} satisfies ChartConfig;

function MonthlyTrend({ trend }: MonthlyTrendProps) {
  if (trend.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-border">
        <p className="text-sm text-muted-foreground">
          No financial activity this month.
        </p>
      </div>
    );
  }

  const chartData = trend.map((item) => ({
    ...item,
    date: item.date,
  }));

  return (
    <div className="space-y-5">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Income</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="text-muted-foreground">Spending</span>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-black p-4">
        <ChartContainer config={chartConfig} className="h-56 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 5,
              left: 5,
              bottom: 0,
            }}
            barGap={2}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-border/50"
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatDate(value)}
              className="text-[10px]"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}`}
              width={35}
              className="text-[10px]"
            />

            <ChartTooltip
              cursor={{
                fill: "hsl(var(--muted))",
                opacity: 0.15,
              }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(String(value))}
                  formatter={(value, name) => (
                    <div className="flex min-w-30 items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {name === "income" ? "Income" : "Spending"}
                      </span>

                      <span className="font-medium">
                        {formatCurrency(Number(value), "BDT")}
                      </span>
                    </div>
                  )}
                />
              }
            />

            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />

            <Bar
              dataKey="spending"
              fill="var(--color-spending)"
              radius={[4, 4, 0, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

// Recent transaction item

function RecentTransaction({
  transaction,
}: {
  transaction: recentTransaction;
}) {
  const isIncome = transaction.categoryId?.type === "income";

  const categoryName =
    transaction.categoryId?.categoryName ?? "Unknown category";

  const note = transaction.note?.trim() || "No note";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-black/30 px-3 py-3 transition hover:border-violet-500/20">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
            isIncome
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isIncome ? (
            <ArrowUpRight className="size-4" />
          ) : (
            <ArrowDownLeft className="size-4" />
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{categoryName}</p>

          <div className="mt-0.5 flex items-center gap-2">
            <span className="max-w-40 truncate text-xs text-muted-foreground">
              {note}
            </span>

            <span className="text-xs text-muted-foreground">·</span>

            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>
      </div>

      <span
        className={`shrink-0 text-sm font-semibold tabular-nums ${
          isIncome ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {isIncome ? "+" : "-"}
        {formatCurrency(transaction.amount, "BDT")}
      </span>
    </div>
  );
}

// Dashboard Page

export default function DashboardPage() {
  const {
    data: user,
    isPending: isUserPending,
    isError: isUserError,
  } = useCurrentUser();

  const {
    data,
    isPending: isDashboardPending,
    isError: isDashboardError,
    refetch,
    isFetching,
  } = useDashboardOverview();

  // Loading

  if (isUserPending || isDashboardPending) {
    return <DashboardSkeleton />;
  }

  // Error

  if (isUserError || isDashboardError || !data) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="w-full max-w-md border-border bg-card">
          <CardHeader>
            <CardTitle>Unable to load dashboard</CardTitle>

            <CardDescription>
              Something went wrong while loading your financial overview.
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

  // Data

  const {
    lifetime,
    weekly,
    monthly,
    topSpendingCategory,
    spendingByCategory,
    trend,
    recentTransactions,
  } = data;
  return (
    <main className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <section>
        <div className="flex items-center justify-between">
          <p className="mb-2 text-sm text-muted-foreground">
            Financial overview
          </p>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <CircleDollarSign className="size-4 text-violet-400" />
            BDT
          </span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-4xl">
              Welcome, {user?.name ?? "User"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              A quick look at your money, spending, and financial activity.
            </p>
          </div>
          <div className="flex md:justify-end justify-normal items-center gap-4">
            <div className="">
              <Link
                href="/dashboard/transactions"
                className="flex items-center gap-2"
              >
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Add Transaction
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lifetime Overview */}

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Overall</h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Across all transactions recorded in FinX.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Income"
            value={formatCurrency(lifetime.totalIncome, "BDT")}
            description="All recorded income"
            icon={<ArrowUp className="size-4 text-emerald-400" />}
            valueClassName="text-emerald-400"
          />

          <SummaryCard
            title="Total Spending"
            value={formatCurrency(lifetime.totalSpending, "BDT")}
            description="All recorded expenses"
            icon={<ArrowDown className="size-4 text-red-400" />}
            valueClassName="text-red-400"
          />

          <SummaryCard
            title="Net Income"
            value={formatCurrency(lifetime.netIncome, "BDT")}
            description="Income minus spending"
            icon={
              lifetime.netIncome >= 0 ? (
                <TrendingUp className="size-4 text-emerald-400" />
              ) : (
                <TrendingDown className="size-4 text-red-400" />
              )
            }
            valueClassName={
              lifetime.netIncome >= 0 ? "text-emerald-400" : "text-red-400"
            }
          />

          <SummaryCard
            title="Transactions"
            value={lifetime.transactionCount.toLocaleString()}
            description="All recorded transactions"
            icon={<ReceiptText className="size-4 text-violet-400" />}
          />
        </div>
      </section>

      {/* This Week */}

      <section className="space-y-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">This Week</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Sunday through Saturday, based on your local timezone.
            </p>
          </div>

          <span className="text-xs text-muted-foreground">
            {formatDateRange(weekly.startDate, weekly.endDate)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <WeeklyCard
            title="Income"
            value={formatCurrency(weekly.totalIncome, "BDT")}
            description={`${weekly.transactionCount} transactions this week`}
            icon={<ArrowUp className="size-4 text-emerald-400" />}
            valueClassName="text-emerald-400"
          />

          <WeeklyCard
            title="Spending"
            value={formatCurrency(weekly.totalSpending, "BDT")}
            description="Money spent this week"
            icon={<ArrowDown className="size-4 text-red-400" />}
            valueClassName="text-red-400"
          />

          <WeeklyCard
            title="Net Income"
            value={formatCurrency(weekly.netIncome, "BDT")}
            description="Weekly income minus spending"
            icon={
              weekly.netIncome >= 0 ? (
                <TrendingUp className="size-4 text-emerald-400" />
              ) : (
                <TrendingDown className="size-4 text-red-400" />
              )
            }
            valueClassName={
              weekly.netIncome >= 0 ? "text-emerald-400" : "text-red-400"
            }
          />

          <WeeklyCard
            title="Savings Rate"
            value={`${weekly.savingsRate.toFixed(1)}%`}
            description="Net income as a share of income"
            icon={<Wallet className="size-4 text-violet-400" />}
            valueClassName="text-violet-400"
          />
        </div>
      </section>

      {/* Monthly Summary */}

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Monthly summary */}

        <Card className="border-border/80 bg-card">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Monthly Summary</CardTitle>

                <CardDescription className="mt-1">
                  {formatMonth(monthly.startDate)}
                </CardDescription>
              </div>

              <Badge variant="outline" className="w-fit border-border">
                {monthly.transactionCount} transactions
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-black p-4">
                <p className="text-xs text-muted-foreground">Income</p>

                <p className="mt-2 text-xl font-semibold tabular-nums text-emerald-400">
                  {formatCurrency(monthly.totalIncome, "BDT")}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-black p-4">
                <p className="text-xs text-muted-foreground">Spending</p>

                <p className="mt-2 text-xl font-semibold tabular-nums text-red-400">
                  {formatCurrency(monthly.totalSpending, "BDT")}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-black p-4">
                <p className="text-xs text-muted-foreground">Net</p>

                <p
                  className={`mt-2 text-xl font-semibold tabular-nums ${
                    monthly.netIncome >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(monthly.netIncome, "BDT")}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
              <div>
                <p className="text-sm font-medium">Savings rate</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  How much of your monthly income remains
                </p>
              </div>

              <p className="text-xl font-semibold tabular-nums text-violet-400">
                {monthly.savingsRate.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top spending category */}

        <Card className="border-border/80 bg-card">
          <CardHeader>
            <CardTitle>Highest Spending</CardTitle>

            <CardDescription>
              Your biggest spending category this month.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {topSpendingCategory ? (
              <div className="rounded-2xl border border-border bg-black p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                      <ArrowDownLeft className="size-5" />
                    </div>

                    <p className="mt-4 text-lg font-semibold">
                      {topSpendingCategory.categoryName}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Largest category this month
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-red-500/20 bg-red-500/5 text-red-400"
                  >
                    {topSpendingCategory.percentage.toFixed(1)}%
                  </Badge>
                </div>

                <p className="mt-6 text-2xl font-semibold tabular-nums text-red-400">
                  {formatCurrency(topSpendingCategory.amount, "BDT")}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  of your total monthly spending
                </p>
              </div>
            ) : (
              <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  No spending recorded this month.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Trend + Categories */}

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Trend */}

        <Card className="border-border/80 bg-card">
          <CardHeader>
            <CardTitle>Income vs Spending</CardTitle>

            <CardDescription>
              Daily financial activity during {formatMonth(monthly.startDate)}.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <MonthlyTrend trend={trend} />
          </CardContent>
        </Card>

        {/* Categories */}

        <Card className="border-border/80 bg-card">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Spending by Category</CardTitle>

                <CardDescription className="mt-1">
                  Where your money went this month.
                </CardDescription>
              </div>

              <CircleDollarSign className="size-5 text-violet-400" />
            </div>
          </CardHeader>

          <CardContent>
            {spendingByCategory.length === 0 ? (
              <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  No spending recorded this month.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {spendingByCategory.map((category, index) => (
                  <CategoryItem
                    key={category.categoryId}
                    category={category}
                    totalSpending={monthly.totalSpending}
                    isTop={index === 0}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Recent Transactions */}

      <Card className="border-border/80 bg-card">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Recent Transactions</CardTitle>

              <CardDescription className="mt-1">
                Your latest financial activity.
              </CardDescription>
            </div>

            <ReceiptText className="size-5 text-violet-400" />
          </div>
        </CardHeader>

        <CardContent>
          {recentTransactions.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                No transactions recorded yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <RecentTransaction
                  key={transaction._id}
                  transaction={transaction}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Pulse */}

      <Card className="border-violet-500/15 bg-card">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <CircleDollarSign className="size-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">Financial Pulse</p>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                  You spent{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(weekly.totalSpending, "BDT")}
                  </span>{" "}
                  this week across{" "}
                  <span className="font-medium text-foreground">
                    {weekly.transactionCount}
                  </span>{" "}
                  transactions.
                  {topSpendingCategory && (
                    <>
                      {" "}
                      Your highest spending category this month is{" "}
                      <span className="font-medium text-foreground">
                        {topSpendingCategory.categoryName}
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xs text-muted-foreground">This week</p>

              <p
                className={`mt-1 text-lg font-semibold tabular-nums ${
                  weekly.netIncome >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {weekly.netIncome >= 0 ? "+" : ""}
                {formatCurrency(weekly.netIncome, "BDT")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
